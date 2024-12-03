import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GmailService } from '@/lib/gmail';

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { emailId, label } = await request.json();
    const gmailService = new GmailService({ access_token: session.accessToken });
    await gmailService.applyLabel(emailId, label);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to apply label:', error);
    return NextResponse.json({ error: 'Failed to apply label' }, { status: 500 });
  }
}