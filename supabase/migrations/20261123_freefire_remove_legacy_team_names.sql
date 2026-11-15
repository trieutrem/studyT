BEGIN;
-- Remove obsolete player-supplied team names only; preserve registrations and results.
ALTER TABLE public.ff_registrations DROP CONSTRAINT IF EXISTS ff_clash_team_name;
UPDATE public.ff_registrations SET team_name=NULL WHERE team_name IS NOT NULL;
ALTER TABLE public.ff_registrations DROP CONSTRAINT IF EXISTS ff_registration_no_team_name;
ALTER TABLE public.ff_registrations ADD CONSTRAINT ff_registration_no_team_name CHECK (team_name IS NULL);
-- Official names remain in ff_draws, set by the administrator RPC from V1.0.23.
COMMIT;
