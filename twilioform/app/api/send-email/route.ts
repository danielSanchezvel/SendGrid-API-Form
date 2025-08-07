import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received data:', body);
    
    const { to, subject, message } = body;

    // Validate required fields
    if (!to || !subject || !message) {
      console.log('Validation failed:', { to: !!to, subject: !!subject, message: !!message });
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    // Email configuration
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('SendGrid error:', error);
    
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}