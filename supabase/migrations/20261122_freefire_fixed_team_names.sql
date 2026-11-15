BEGIN;
DO $$
DECLARE n jsonb;
BEGIN
 SELECT pairs->0 INTO n FROM public.ff_draws WHERE mode='clash' AND pairs->0->>'name_a' IS NOT NULL AND pairs->0->>'name_b' IS NOT NULL ORDER BY round_no LIMIT 1;
 IF n IS NOT NULL THEN
  IF EXISTS(SELECT 1 FROM public.ff_clash_matches c WHERE c.team_a IS DISTINCT FROM n->>'name_a' OR c.team_b IS DISTINCT FROM n->>'name_b') THEN RAISE EXCEPTION 'Tên đội trong kết quả cũ không thống nhất; cần xử lý trước khi nâng cấp'; END IF;
  UPDATE public.ff_draws SET pairs=jsonb_build_array((pairs->0)||jsonb_build_object('name_a',n->>'name_a','name_b',n->>'name_b')) WHERE mode='clash';
 END IF;
END $$;
CREATE OR REPLACE FUNCTION public.ff_draw(p_mode text,p_round int) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE names jsonb; ids uuid[]; n int; j int; pairs jsonb='[]'; old jsonb; bye_id uuid; stage_name text; prev public.ff_draws%ROWTYPE; p jsonb; m public.ff_duel_matches%ROWTYPE; losers uuid[]='{}'; winners uuid[]='{}';
BEGIN
 IF NOT public.ff_is_admin() THEN RAISE EXCEPTION 'Không có quyền'; END IF;
 PERFORM pg_advisory_xact_lock(20261120);
 IF p_mode='clash' THEN
  IF EXISTS(SELECT 1 FROM ff_clash_matches c WHERE NOT EXISTS(SELECT 1 FROM ff_draws d WHERE d.mode='clash' AND d.round_no=c.match_no)) THEN RAISE EXCEPTION 'Có kết quả Tử chiến cũ; cần quản trị xử lý trước khi dùng bốc thăm'; END IF;
  IF p_round IS NULL OR p_round NOT BETWEEN 1 AND 5 OR EXISTS(SELECT 1 FROM ff_clash_matches WHERE match_no=p_round) THEN RAISE EXCEPTION 'Trận đã chốt hoặc không hợp lệ'; END IF;
  SELECT array_agg(user_id ORDER BY played,random()) INTO ids FROM (SELECT a.user_id,(SELECT count(*) FROM ff_draws d JOIN ff_clash_matches c ON c.match_no=d.round_no WHERE d.mode='clash' AND d.pairs::text LIKE '%'||a.user_id::text||'%') played FROM ff_accounts a WHERE a.active AND a.official_name IS NOT NULL AND a.alias ~ '^ffplayer(0[1-9]|1[0-5])$' AND EXISTS(SELECT 1 FROM ff_registrations r WHERE r.user_id=a.user_id AND r.mode='clash' AND r.status='approved')) s;
  IF coalesce(cardinality(ids),0)<10 THEN RAISE EXCEPTION 'Cần ít nhất 10 thí sinh đã đổi tên và được duyệt'; END IF;
  SELECT array_agg(x ORDER BY random()) INTO ids FROM unnest(ids[1:10]) x;
  pairs=jsonb_build_array(jsonb_build_object('a',to_jsonb(ids[1:5]),'b',to_jsonb(ids[6:10])));
  SELECT d.pairs INTO old FROM ff_draws d WHERE mode='clash' AND round_no=p_round;
  IF old IS NOT NULL AND ((old->0->'a' @> pairs->0->'a' AND old->0->'b' @> pairs->0->'b') OR (old->0->'a' @> pairs->0->'b' AND old->0->'b' @> pairs->0->'a')) THEN pairs=jsonb_build_array(jsonb_build_object('a',to_jsonb(ARRAY[ids[6],ids[2],ids[3],ids[4],ids[5]]),'b',to_jsonb(ARRAY[ids[1],ids[7],ids[8],ids[9],ids[10]]))); END IF;
  SELECT pairs->0 INTO names FROM ff_draws WHERE mode='clash' AND pairs->0->>'name_a' IS NOT NULL AND pairs->0->>'name_b' IS NOT NULL ORDER BY round_no LIMIT 1;
  IF names IS NOT NULL THEN pairs=jsonb_build_array((pairs->0)||jsonb_build_object('name_a',names->>'name_a','name_b',names->>'name_b')); END IF;
  INSERT INTO ff_draws(mode,round_no,pairs) VALUES(p_mode,p_round,pairs) ON CONFLICT(mode,round_no) DO UPDATE SET pairs=excluded.pairs,created_at=now(); RETURN;
 END IF;
 IF p_mode IS DISTINCT FROM 'duel' OR p_round IS NULL OR p_round NOT BETWEEN 1 AND 4 OR EXISTS(SELECT 1 FROM ff_draws WHERE mode='duel' AND round_no=p_round) THEN RAISE EXCEPTION 'Vòng đã bốc thăm hoặc không hợp lệ'; END IF;
 IF p_round=1 THEN
  IF EXISTS(SELECT 1 FROM ff_duel_matches) THEN RAISE EXCEPTION 'Đã có kết quả Độc Lang cũ; không thể tạo nhánh mới'; END IF;
  SELECT array_agg(a.user_id ORDER BY random()) INTO ids FROM ff_accounts a WHERE a.active AND a.official_name IS NOT NULL AND a.alias ~ '^ffplayer(0[1-9]|1[0-5])$' AND EXISTS(SELECT 1 FROM ff_registrations r WHERE r.user_id=a.user_id AND r.mode='duel' AND r.status='approved');
  IF coalesce(cardinality(ids),0) NOT BETWEEN 9 AND 16 THEN RAISE EXCEPTION 'Cần 9–16 thí sinh để tạo nhánh 4 vòng'; END IF;
  n=cardinality(ids); -- preliminary round reduces field to eight; multiple byes stored in pairs as singletons
  FOR j IN 1..(n-8) LOOP pairs=pairs||jsonb_build_array(jsonb_build_object('a',ids[2*j-1],'b',ids[2*j],'stage','Vòng loại')); END LOOP;
  IF 2*(n-8)<n THEN FOR j IN (2*(n-8)+1)..n LOOP pairs=pairs||jsonb_build_array(jsonb_build_object('a',ids[j],'b',null,'stage','Vòng loại')); END LOOP; END IF;
 ELSE
  SELECT * INTO prev FROM ff_draws WHERE mode='duel' AND round_no=p_round-1;
  IF NOT FOUND THEN RAISE EXCEPTION 'Chưa bốc thăm vòng trước'; END IF;
  FOR p IN SELECT value FROM jsonb_array_elements(prev.pairs) LOOP
   IF p->>'b' IS NULL THEN winners=array_append(winners,(p->>'a')::uuid); CONTINUE; END IF;
   SELECT * INTO m FROM ff_duel_matches WHERE stage=p->>'stage' AND player_a=(p->>'a')::uuid AND player_b=(p->>'b')::uuid;
   IF NOT FOUND THEN RAISE EXCEPTION 'Chưa đủ kết quả vòng trước'; END IF;
   winners=array_append(winners,CASE WHEN m.score_a=5 THEN m.player_a ELSE m.player_b END); losers=array_append(losers,CASE WHEN m.score_a=5 THEN m.player_b ELSE m.player_a END);
  END LOOP;
  SELECT array_agg(x ORDER BY random()) INTO ids FROM unnest(winners) x;
  stage_name=CASE p_round WHEN 2 THEN 'Tứ kết' WHEN 3 THEN 'Bán kết' ELSE 'Chung kết' END;
  FOR j IN 1..(cardinality(ids)/2) LOOP pairs=pairs||jsonb_build_array(jsonb_build_object('a',ids[2*j-1],'b',ids[2*j],'stage',stage_name)); END LOOP;
  IF p_round=4 THEN pairs=pairs||jsonb_build_array(jsonb_build_object('a',losers[1],'b',losers[2],'stage','Tranh hạng ba')); END IF;
 END IF;
 INSERT INTO ff_draws(mode,round_no,pairs) VALUES(p_mode,p_round,pairs);
END $$;
CREATE OR REPLACE FUNCTION public.ff_name_clash_teams(p_round int,p_a text,p_b text,p_agreed boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE q jsonb; existing jsonb;
BEGIN
 IF NOT public.ff_is_admin() THEN RAISE EXCEPTION 'Không có quyền'; END IF;
 PERFORM pg_advisory_xact_lock(20261120);
 IF p_agreed IS DISTINCT FROM true OR p_a IS NULL OR p_b IS NULL OR char_length(btrim(p_a)) NOT BETWEEN 2 AND 60 OR char_length(btrim(p_b)) NOT BETWEEN 2 AND 60 OR lower(btrim(p_a))=lower(btrim(p_b)) THEN RAISE EXCEPTION 'Tên đội phải khác nhau, 2–60 ký tự và được thống nhất'; END IF;
 SELECT pairs->0 INTO existing FROM ff_draws WHERE mode='clash' AND pairs->0->>'name_a' IS NOT NULL AND pairs->0->>'name_b' IS NOT NULL ORDER BY round_no LIMIT 1;
 IF existing IS NOT NULL THEN RAISE EXCEPTION 'Tên hai đội đã cố định cho toàn bộ giải'; END IF;
 IF EXISTS(SELECT 1 FROM ff_clash_matches WHERE match_no=p_round) THEN RAISE EXCEPTION 'Trận đã chốt'; END IF;
 SELECT pairs->0 INTO q FROM ff_draws WHERE mode='clash' AND round_no=p_round;
 IF q IS NULL OR jsonb_array_length(q->'a')<>5 OR jsonb_array_length(q->'b')<>5 THEN RAISE EXCEPTION 'Cần bốc thăm 5v5 trước'; END IF;
 UPDATE ff_draws SET pairs=jsonb_build_array((pairs->0)||jsonb_build_object('name_a',btrim(p_a),'name_b',btrim(p_b))) WHERE mode='clash';
END $$;
REVOKE ALL ON FUNCTION public.ff_name_clash_teams(int,text,text,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ff_name_clash_teams(int,text,text,boolean) TO authenticated;


COMMIT;
