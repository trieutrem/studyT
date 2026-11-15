BEGIN;
CREATE TABLE IF NOT EXISTS public.ff_draws (
 mode text NOT NULL CHECK(mode IN ('clash','duel')), round_no int NOT NULL CHECK(round_no BETWEEN 1 AND 5),
 pairs jsonb NOT NULL, bye uuid, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(mode,round_no)
);
ALTER TABLE public.ff_draws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ff_draw_read ON public.ff_draws;
CREATE POLICY ff_draw_read ON public.ff_draws FOR SELECT TO authenticated USING(public.ff_access_active());
REVOKE ALL ON public.ff_draws FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.ff_draws TO authenticated;
CREATE OR REPLACE FUNCTION public.ff_draw(p_mode text,p_round int) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE ids uuid[]; n int; j int; pairs jsonb='[]'; old jsonb; bye_id uuid; stage_name text; prev public.ff_draws%ROWTYPE; p jsonb; m public.ff_duel_matches%ROWTYPE; losers uuid[]='{}'; winners uuid[]='{}';
BEGIN
 IF NOT public.ff_is_admin() THEN RAISE EXCEPTION 'Không có quyền'; END IF;
 PERFORM pg_advisory_xact_lock(20261120);
 IF p_mode='clash' THEN
  IF EXISTS(SELECT 1 FROM ff_clash_matches c WHERE NOT EXISTS(SELECT 1 FROM ff_draws d WHERE d.mode='clash' AND d.round_no=c.match_no)) THEN RAISE EXCEPTION 'Có kết quả Tử chiến cũ; cần quản trị xử lý trước khi dùng bốc thăm'; END IF;
  IF p_round IS NULL OR p_round NOT BETWEEN 1 AND 5 OR EXISTS(SELECT 1 FROM ff_clash_matches WHERE match_no=p_round) THEN RAISE EXCEPTION 'Trận đã chốt hoặc không hợp lệ'; END IF;
  SELECT array_agg(user_id ORDER BY played,random()) INTO ids FROM (SELECT a.user_id,(SELECT count(*) FROM ff_draws d JOIN ff_clash_matches c ON c.match_no=d.round_no WHERE d.mode='clash' AND d.pairs::text LIKE '%'||a.user_id::text||'%') played FROM ff_accounts a WHERE a.active AND a.official_name IS NOT NULL AND a.alias ~ '^ffplayer(0[1-9]|1[0-5])$' AND EXISTS(SELECT 1 FROM ff_registrations r WHERE r.user_id=a.user_id AND r.mode='clash' AND r.status='approved')) s;
  IF coalesce(cardinality(ids),0)<8 THEN RAISE EXCEPTION 'Cần ít nhất 8 thí sinh đã đổi tên và được duyệt'; END IF;
  SELECT array_agg(x ORDER BY random()) INTO ids FROM unnest(ids[1:8]) x;
  pairs=jsonb_build_array(jsonb_build_object('a',to_jsonb(ids[1:4]),'b',to_jsonb(ids[5:8])));
  SELECT d.pairs INTO old FROM ff_draws d WHERE mode='clash' AND round_no=p_round;
  IF old IS NOT NULL AND ((old->0->'a' @> pairs->0->'a' AND old->0->'b' @> pairs->0->'b') OR (old->0->'a' @> pairs->0->'b' AND old->0->'b' @> pairs->0->'a')) THEN pairs=jsonb_build_array(jsonb_build_object('a',to_jsonb(ARRAY[ids[5],ids[2],ids[3],ids[4]]),'b',to_jsonb(ARRAY[ids[1],ids[6],ids[7],ids[8]]))); END IF;
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
CREATE OR REPLACE FUNCTION public.ff_draw_score(p_mode text,p_round int,p_pair int,p_a int,p_b int) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE p jsonb;
BEGIN
 IF NOT public.ff_is_admin() THEN RAISE EXCEPTION 'Không có quyền'; END IF;
 PERFORM pg_advisory_xact_lock(20261120);
 SELECT pairs->p_pair INTO p FROM ff_draws WHERE mode=p_mode AND round_no=p_round;
 IF p_pair IS NULL OR p_pair<0 OR p IS NULL OR p->>'b' IS NULL THEN RAISE EXCEPTION 'Cặp không hợp lệ'; END IF;
 IF p_mode='clash' THEN
 INSERT INTO ff_clash_matches(match_no,team_a,team_b,rounds_a,rounds_b) VALUES(p_round,'Trận '||p_round||' · A','Trận '||p_round||' · B',p_a,p_b);
 ELSE
 IF EXISTS(SELECT 1 FROM ff_duel_matches WHERE stage=p->>'stage' AND player_a=(p->>'a')::uuid AND player_b=(p->>'b')::uuid) THEN RAISE EXCEPTION 'Đã chốt kết quả'; END IF;
 INSERT INTO ff_duel_matches(stage,player_a,player_b,score_a,score_b) VALUES(p->>'stage',(p->>'a')::uuid,(p->>'b')::uuid,p_a,p_b);
 END IF;
END $$;
REVOKE ALL ON FUNCTION public.ff_draw(text,int),public.ff_draw_score(text,int,int,int,int) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ff_draw(text,int),public.ff_draw_score(text,int,int,int,int) TO authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.ff_clash_matches,public.ff_duel_matches FROM authenticated,anon;
COMMIT;
