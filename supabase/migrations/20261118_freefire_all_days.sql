BEGIN;
-- Atomic registration, using existing RLS and authenticated identity.
CREATE OR REPLACE FUNCTION public.ff_register_all(p_uid text,p_nickname text,p_team text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE u uuid := auth.uid(); m text;
BEGIN
 IF u IS NULL OR NOT EXISTS (SELECT 1 FROM public.ff_identities WHERE user_id=u) THEN RAISE EXCEPTION 'Identity required'; END IF;
 IF public.ff_is_tournament_account() AND NOT EXISTS (SELECT 1 FROM public.ff_accounts WHERE user_id=u AND active) THEN RAISE EXCEPTION 'Inactive account'; END IF;
 IF p_uid IS NULL OR p_uid !~ '^[0-9]{5,20}$' OR p_nickname IS NULL OR char_length(btrim(p_nickname)) NOT BETWEEN 2 AND 60 OR p_team IS NULL OR char_length(btrim(p_team)) NOT BETWEEN 2 AND 60 THEN RAISE EXCEPTION 'Invalid registration'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,0));
 IF EXISTS (SELECT 1 FROM public.ff_registrations WHERE user_id=u AND (game_uid<>p_uid OR nickname<>btrim(p_nickname) OR (mode='clash' AND team_name<>btrim(p_team)))) THEN RAISE EXCEPTION 'Existing registration differs; contact administrator'; END IF;
 FOREACH m IN ARRAY ARRAY['survival','clash','duel'] LOOP
 INSERT INTO public.ff_registrations(user_id,mode,game_uid,nickname,team_name,status) VALUES(u,m,p_uid,btrim(p_nickname),CASE WHEN m='clash' THEN btrim(p_team) ELSE NULL END,'pending') ON CONFLICT(user_id,mode) DO NOTHING;
 END LOOP;
END; $$;
REVOKE ALL ON FUNCTION public.ff_register_all(text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ff_register_all(text,text,text) TO authenticated;
-- Prevent direct partial registration by clients; only the RPC creates entries.
DROP POLICY IF EXISTS ff_reg_insert ON public.ff_registrations;
COMMIT;
