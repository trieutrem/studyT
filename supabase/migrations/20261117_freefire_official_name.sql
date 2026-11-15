BEGIN;
ALTER TABLE public.ff_accounts ADD COLUMN IF NOT EXISTS official_name text;
ALTER TABLE public.ff_accounts ADD COLUMN IF NOT EXISTS renamed_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS ff_official_name_unique ON public.ff_accounts (lower(official_name)) WHERE official_name IS NOT NULL;
CREATE OR REPLACE FUNCTION public.ff_set_official_name(p_name text) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,auth AS $$
DECLARE n text := regexp_replace(btrim(p_name), '[[:space:]]+', ' ', 'g');
BEGIN
 IF auth.uid() IS NULL OR n IS NULL OR char_length(n) NOT BETWEEN 3 AND 120 OR n !~ '^[[:alpha:]]+([ -][[:alpha:]]+)+$' THEN RAISE EXCEPTION 'Họ tên không hợp lệ'; END IF;
 UPDATE public.ff_accounts SET official_name=n, renamed_at=now() WHERE user_id=auth.uid() AND active AND official_name IS NULL;
 IF NOT FOUND THEN RAISE EXCEPTION 'Tài khoản không hoạt động hoặc đã đổi tên'; END IF;
 UPDATE public.profiles SET full_name=n WHERE id=auth.uid();
 UPDATE public.ff_identities SET full_name=n WHERE user_id=auth.uid();
 RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.ff_set_official_name(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ff_set_official_name(text) TO authenticated;
-- Only resolves tournament internal email aliases, never personal email addresses.
CREATE OR REPLACE FUNCTION public.ff_resolve_login(p_name text) RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,auth AS $$
 SELECT a.alias || '@studyt.app' FROM public.ff_accounts a
 WHERE a.active AND lower(a.official_name)=lower(regexp_replace(btrim(p_name),'[[:space:]]+',' ','g')) LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.ff_resolve_login(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ff_resolve_login(text) TO anon,authenticated;
CREATE OR REPLACE FUNCTION public.ff_identity_official_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,auth AS $$
DECLARE a public.ff_accounts%ROWTYPE;
BEGIN
 SELECT * INTO a FROM public.ff_accounts WHERE user_id=NEW.user_id;
 IF FOUND AND NOT public.ff_is_admin() THEN
  IF NOT a.active OR a.official_name IS NULL THEN RAISE EXCEPTION 'Cần hoàn thành đổi tên chính thức'; END IF;
  IF NEW.full_name IS DISTINCT FROM a.official_name THEN RAISE EXCEPTION 'Họ tên phải khớp tên chính thức'; END IF;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS ff_identity_official_guard ON public.ff_identities;
CREATE TRIGGER ff_identity_official_guard BEFORE INSERT OR UPDATE ON public.ff_identities FOR EACH ROW EXECUTE FUNCTION public.ff_identity_official_guard();
DROP POLICY IF EXISTS ff_registration_name_gate ON public.ff_registrations;
CREATE POLICY ff_registration_name_gate ON public.ff_registrations AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (NOT public.ff_is_tournament_account() OR EXISTS (SELECT 1 FROM public.ff_accounts a WHERE a.user_id=auth.uid() AND a.active AND a.official_name IS NOT NULL));
COMMIT;
