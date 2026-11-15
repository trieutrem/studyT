# StudyT Aurora V9.3 — Reference Refresh

Based on V9.2. New visual layer for index.html and admin.html; dark dashboard inspired by the supplied design. The hero artwork is cropped from the supplied reference, with feathered transparent edges; the light theme keeps the existing transparent mascot. CSS motion respects reduced-motion preferences. Existing app functions and Supabase configuration remain unchanged. The removed V9 workspace is not re-enabled.

Dashboard: existing counters remain data-driven. New task and upcoming exam cards read existing account-specific task storage and loaded exam records. Study schedule reads existing study-plan storage; no sample appointments are inserted. Buttons open existing modules. The top-bar language selector uses the existing settings and translation engine; translation coverage of legacy screens is not guaranteed. No database migration is needed.

Deploy the entire folder as a static Vercel project. Hard refresh after deployment; service worker cache version is updated. Test login, navigation, light/dark, language, task/exam data, and mobile layout before replacing production. Syntax checks were performed; live browser/Supabase verification was not performed.
