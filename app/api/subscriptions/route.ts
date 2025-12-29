import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GmailService } from '@/lib/gmail';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const gmailService = new GmailService({ access_token: session.accessToken });
        const subscriptions = await gmailService.listSubscriptions();
        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { subscription } = await request.json();
        const gmailService = new GmailService({ access_token: session.accessToken });
        const success = await gmailService.unsubscribe(subscription);
        return NextResponse.json({ success });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }
}
