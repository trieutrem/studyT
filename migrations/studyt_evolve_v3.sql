-- StudyT Aurora V3: OPTIONAL, additive migration (PostgreSQL / Supabase).
-- Review on a staging project first. No existing table is renamed/dropped or updated.
-- Requirements: public.profiles(id uuid, role text) with administrator role = 'admin'.
-- If your schema differs, adapt admin guard before applying.
BEGIN;

CREATE TABLE IF NOT EXISTS public.studyt_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 5 AND 200),
    detail text NOT NULL CHECK (char_length(btrim(detail)) BETWEEN 10 AND 10000),
    category text NOT NULL DEFAULT 'Vấn đề khác' CHECK (char_length(category) BETWEEN 1 AND 100),
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','archived')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS studyt_reports_created_at_idx ON public.studyt_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS studyt_reports_created_by_idx ON public.studyt_reports (created_by, created_at DESC);
ALTER TABLE public.studyt_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.studyt_reports FROM anon;
GRANT SELECT,INSERT,UPDATE ON public.studyt_reports TO authenticated;

-- SECURITY DEFINER helper avoids recursive RLS inside profiles when checking an admin.
-- The function may only return true for roles actually present in profiles.
CREATE OR REPLACE FUNCTION public.studyt_evolve_is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'); $$;
REVOKE ALL ON FUNCTION public.studyt_evolve_is_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.studyt_evolve_is_admin() TO authenticated;

DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='studyt_reports' AND policyname='stnx_reports_insert_own') THEN
  CREATE POLICY stnx_reports_insert_own ON public.studyt_reports FOR INSERT TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()) AND status='open');
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='studyt_reports' AND policyname='stnx_reports_select_own_or_admin') THEN
  CREATE POLICY stnx_reports_select_own_or_admin ON public.studyt_reports FOR SELECT TO authenticated
  USING (created_by = (SELECT auth.uid()) OR (SELECT public.studyt_evolve_is_admin()));
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='studyt_reports' AND policyname='stnx_reports_update_admin') THEN
  CREATE POLICY stnx_reports_update_admin ON public.studyt_reports FOR UPDATE TO authenticated
  USING ((SELECT public.studyt_evolve_is_admin())) WITH CHECK ((SELECT public.studyt_evolve_is_admin()));
 END IF;
END $$;

-- User-specific workspace sync; disabled until students explicitly choose cloud sync.
CREATE TABLE IF NOT EXISTS public.studyt_workspaces (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(payload)='object' AND pg_column_size(payload)<2000000),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.studyt_workspaces ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.studyt_workspaces FROM anon;
GRANT SELECT,INSERT,UPDATE ON public.studyt_workspaces TO authenticated;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='studyt_workspaces' AND policyname='stnx_workspaces_select_own') THEN
  CREATE POLICY stnx_workspaces_select_own ON public.studyt_workspaces FOR SELECT TO authenticated USING (user_id=(SELECT auth.uid()));
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='studyt_workspaces' AND policyname='stnx_workspaces_insert_own') THEN
  CREATE POLICY stnx_workspaces_insert_own ON public.studyt_workspaces FOR INSERT TO authenticated WITH CHECK (user_id=(SELECT auth.uid()));
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='studyt_workspaces' AND policyname='stnx_workspaces_update_own') THEN
  CREATE POLICY stnx_workspaces_update_own ON public.studyt_workspaces FOR UPDATE TO authenticated USING (user_id=(SELECT auth.uid())) WITH CHECK (user_id=(SELECT auth.uid()));
 END IF;
END $$;
COMMIT;
-- NOTE: This migration does NOT change RLS on existing profiles/exams/questions/announcements,
-- does NOT enforce MFA, and does NOT implement global audit log or system-wide recycle bin.
