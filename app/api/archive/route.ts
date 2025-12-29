import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GmailService } from '@/lib/gmail';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { emailId } = await request.json();
        const gmailService = new GmailService({ access_token: session.accessToken });
        await gmailService.archiveEmail(emailId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to archive email:', error);
        return NextResponse.json({ error: 'Failed to archive email' }, { status: 500 });
    }
}
