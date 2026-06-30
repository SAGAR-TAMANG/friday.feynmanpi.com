import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// ── Log every Google sign-in (so we know who our users are) ──────────────────
// The Friday desktop app does a native-desktop OAuth flow and, on success, POSTs
// the raw Google id_token here. We do NOT trust a client-supplied profile — we
// re-verify the token against Google's live signing keys and read the identity
// from the verified claims, then upsert it into D1. A forged POST can't get past
// jwtVerify, so the table only ever holds real Google identities.

// Google's public JWKS — createRemoteJWKSet fetches + caches the keys and rotates
// them automatically, so we never hard-code a signing key.
const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

export async function POST(request: Request) {
  let body: { idToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const idToken = typeof body.idToken === 'string' ? body.idToken : '';
  if (!idToken) {
    return NextResponse.json({ error: 'Missing idToken.' }, { status: 400 });
  }

  // The desktop app's OAuth client id — the token's `aud` must equal this, or it
  // was minted for some other app. Same value as the Electron app's
  // MAIN_VITE_GOOGLE_OAUTH_CLIENT_ID.
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) {
    console.error('[friday auth/log] GOOGLE_OAUTH_CLIENT_ID is not set.');
    return NextResponse.json({ error: 'Login logging is not configured yet.' }, { status: 503 });
  }

  // Verify signature + iss + aud + exp against Google's live keys. Anything not
  // freshly minted by Google for our client throws here.
  let claims;
  try {
    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: GOOGLE_ISSUERS,
      audience: clientId
    });
    claims = payload;
  } catch (err) {
    console.warn(
      '[friday auth/log] id_token verification failed:',
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: 'Invalid id_token.' }, { status: 401 });
  }

  const sub = typeof claims.sub === 'string' ? claims.sub : '';
  const email = typeof claims.email === 'string' ? claims.email.toLowerCase() : '';
  const name = typeof claims.name === 'string' ? claims.name : email;
  const picture = typeof claims.picture === 'string' ? claims.picture : null;
  const emailVerified = claims.email_verified === true ? 1 : 0;
  if (!sub || !email) {
    return NextResponse.json({ error: 'Token missing sub/email.' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const db = env.DB;
  if (!db) {
    console.error('[friday auth/log] D1 binding DB is not configured.');
    return NextResponse.json({ error: 'Login logging is not configured yet.' }, { status: 503 });
  }

  // First login inserts; repeat logins bump last_login + login_count (keyed on
  // sub, Google's stable per-user id — not email, which can change).
  const now = Date.now();
  try {
    await db
      .prepare(
        `INSERT INTO users (sub, email, name, picture, email_verified, created_at, last_login, login_count)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6, 1)
         ON CONFLICT(sub) DO UPDATE SET
           email = excluded.email,
           name = excluded.name,
           picture = excluded.picture,
           email_verified = excluded.email_verified,
           last_login = excluded.last_login,
           login_count = users.login_count + 1`
      )
      .bind(sub, email, name, picture, emailVerified, now)
      .run();
  } catch (err) {
    console.error('[friday auth/log] D1 upsert failed:', err);
    return NextResponse.json({ error: 'Could not record login.' }, { status: 500 });
  }

  console.log(`[friday auth/log] recorded login sub=${sub} email=${email}`);
  return NextResponse.json({ ok: true });
}
