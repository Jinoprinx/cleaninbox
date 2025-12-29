import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GmailService } from '@/lib/gmail';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const minSize = parseInt(searchParams.get('minSize') || '10');

        const gmailService = new GmailService({ access_token: session.accessToken });
        const largeEmails = await gmailService.listLargeEmails(minSize);
        return NextResponse.json(largeEmails);
    } catch (error) {
        console.error('Failed to fetch large emails:', error);
        return NextResponse.json({ error: 'Failed to fetch large emails' }, { status: 500 });
    }
}
