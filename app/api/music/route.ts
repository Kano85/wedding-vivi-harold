import { NextResponse } from 'next/server';

type MusicPayload = {
  message?: string;
  language?: 'es' | 'en';
  timestamp?: string;
};

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as MusicPayload;
    const message = (data.message || '').trim();

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required.' },
        { status: 400 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.MUSIC_TO_EMAIL || 'Strube.cano@gmail.com';
    const fromEmail = process.env.MUSIC_FROM_EMAIL || 'Wedding <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable.');
      return NextResponse.json(
        { success: false, message: 'Email provider is not configured.' },
        { status: 500 },
      );
    }

    const language = data.language === 'es' ? 'es' : 'en';
    const subject =
      language === 'es'
        ? 'Nueva sugerencia musical (sin Spotify)'
        : 'Neuer Musikwunsch (ohne Spotify)';
    const submittedAt = data.timestamp ? new Date(data.timestamp) : new Date();

    const textBody = [
      'Music recommendation without Spotify',
      `Language: ${language === 'es' ? 'Spanish' : 'German'}`,
      `Submitted at: ${submittedAt.toISOString()}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        text: textBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errorText);
      return NextResponse.json(
        { success: false, message: 'Failed to send email.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Music request processing error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while sending the email.' },
      { status: 500 },
    );
  }
}
