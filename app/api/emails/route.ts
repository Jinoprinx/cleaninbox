import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GmailService } from '@/lib/gmail';

export async function GET() {
  const session = await getServerSession();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const gmailService = new GmailService({ access_token: session.accessToken });
    const emails = await gmailService.listEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}