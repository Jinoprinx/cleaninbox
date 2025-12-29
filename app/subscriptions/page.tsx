"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, MailX, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import type { Subscription } from '@/types/email';

export default function SubscriptionsPage() {
    const { data: session } = useSession();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            fetchSubscriptions();
        }
    }, [session]);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('/api/subscriptions');
            const data = await response.json();
            if (Array.isArray(data)) {
                setSubscriptions(data);
            }
        } catch (error) {
            toast.error('Failed to load subscriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async (sub: Subscription) => {
        if (sub.unsubscribeLink && !sub.unsubscribeEmail) {
            // If only link, open it
            window.open(sub.unsubscribeLink, '_blank');
            return;
        }

        setProcessing(sub.email);
        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                body: JSON.stringify({ subscription: sub }),
            });

            if (response.ok) {
                toast.success(`Unsubscribed from ${sub.sender}`);
                // Remove from list locally
                setSubscriptions(prev => prev.filter(s => s.email !== sub.email));
            } else {
                toast.error('Failed to unsubscribe');
            }
        } catch (error) {
            toast.error('Error unsubscribing');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                    ← Back to Inbox
                </Link>
                <h1 className="text-3xl font-bold">Subscription Manager</h1>
            </div>

            <div className="grid gap-4">
                {subscriptions.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                        No active newsletters found in your recent emails.
                    </Card>
                ) : (
                    subscriptions.map(sub => (
                        <Card key={sub.id} className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">{sub.sender}</h3>
                                <p className="text-sm text-muted-foreground">{sub.email}</p>
                            </div>
                            <Button
                                variant={sub.unsubscribeEmail ? "destructive" : "outline"}
                                disabled={!!processing}
                                onClick={() => handleUnsubscribe(sub)}
                            >
                                {processing === sub.email ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : sub.unsubscribeEmail ? (
                                    <MailX className="h-4 w-4 mr-2" />
                                ) : (
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                )}
                                {sub.unsubscribeEmail ? 'One-Click Unsubscribe' : 'Open Unsubscribe Page'}
                            </Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
