import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GmailService } from '@/lib/gmail';
import type { EmailLabel } from '@/types/email';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { label, olderThanDays } = await request.json();

        if (!label || !olderThanDays) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const gmailService = new GmailService({ access_token: session.accessToken });
        const count = await gmailService.cleanStaleEmails(label as EmailLabel, olderThanDays);

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Failed to clean stale emails:', error);
        return NextResponse.json({ error: 'Failed to clean stale emails' }, { status: 500 });
    }
}
