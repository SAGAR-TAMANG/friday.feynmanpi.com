import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Intent = 'windows' | 'mac-waitlist' | 'waitlist';

export async function POST(request: Request) {
  let body: { email?: unknown; intent?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const intent = body.intent as Intent;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (intent !== 'windows' && intent !== 'mac-waitlist' && intent !== 'waitlist') {
    return NextResponse.json({ error: 'Unknown signup intent.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error('[friday signup] RESEND_API_KEY or RESEND_AUDIENCE_ID is not set.');
    return NextResponse.json({ error: 'Waitlist is not configured yet. Try again later.' }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.contacts.create({
    email,
    audienceId,
    unsubscribed: false,
  });

  if (error) {
    // Resend returns a specific error code when the contact already exists
    if ('name' in error && error.name === 'validation_error') {
      // Treat duplicate signups silently as success — no need to alarm the user
      return NextResponse.json({ ok: true });
    }
    console.error('[friday signup] Resend error:', error);
    return NextResponse.json({ error: 'Could not add you to the waitlist. Please try again.' }, { status: 500 });
  }

  console.log(`[friday signup] added intent=${intent} email=${email}`);
  return NextResponse.json({ ok: true });
}
