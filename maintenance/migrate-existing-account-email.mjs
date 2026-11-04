/**
 * STUDYT — ADMIN-ONLY rescue for legacy pseudo-email accounts.
 * Never upload this file or the Supabase secret key to your publicly deployed site.
 * Requires Node.js 20+, @supabase/supabase-js, and explicit operator verification.
 * Updates an EXISTING Auth user ID, preserving UID / related user data.
 */
import { createClient } from '@supabase/supabase-js';

const env = process.env;
const url = env.SUPABASE_URL || '';
const secret = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';
const uid = env.STUDYT_USER_ID || '';
const oldEmail = (env.STUDYT_EXPECT_OLD_EMAIL || '').trim().toLowerCase();
const newEmail = (env.STUDYT_NEW_GMAIL || '').trim().toLowerCase();
const agreed = env.STUDYT_PROOF_VERIFIED === 'YES';
const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isGmail = /^[a-z0-9._+\-]+@gmail\.com$/i;
const isLegacy = /@(studyt|quizmaster)\.app$/i;

if (!url.startsWith('https://') || !secret || !isUuid.test(uid) || !isLegacy.test(oldEmail) || !isGmail.test(newEmail) || !agreed) {
 console.error('Missing or unsafe configuration. Require SUPABASE_URL, SUPABASE_SECRET_KEY,');
 console.error('STUDYT_USER_ID (UUID), STUDYT_EXPECT_OLD_EMAIL (legacy @studyt.app or @quizmaster.app),');
 console.error('STUDYT_NEW_GMAIL, STUDYT_PROOF_VERIFIED=YES. Verify Gmail ownership before running.');
 process.exitCode = 1;
} else {
 const client = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
 const current = await client.auth.admin.getUserById(uid);
 if (current.error || !current.data?.user) throw new Error(`Cannot load existing user: ${current.error?.message || 'unknown'}`);
 const actual = String(current.data.user.email || '').toLowerCase();
 if (actual !== oldEmail) throw new Error(`EMAIL MISMATCH: existing account is ${actual}, expected ${oldEmail}. No changes made.`);
 if (newEmail === actual) throw new Error('New email matches current email.');
 const check = await client.from('profiles').select('id,role,username').eq('id', uid).maybeSingle();
 if (check.error) throw new Error('Cannot verify existing profile; refusing update: ' + check.error.message);
 if (!check.data) throw new Error('No profile for existing UID; refusing update.');
 const updated = await client.auth.admin.updateUserById(uid, { email: newEmail, email_confirm: true });
 if (updated.error) throw new Error('Supabase rejected email update: ' + updated.error.message);
 console.log(`Updated existing UID ${uid}. Original profile role=${check.data.role}. New Gmail=${updated.data?.user?.email}`);
 console.log('Verify the same UID and profile in Supabase Dashboard, then test login on StudyT.');
}
