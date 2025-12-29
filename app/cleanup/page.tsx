"use client";

import { useState } from 'react';
import { Loader2, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';

export default function StaleCleanupPage() {
    const [processing, setProcessing] = useState(false);
    const [adsAge, setAdsAge] = useState('30');
    const [spamAge, setSpamAge] = useState('7');

    const cleanStaleEmails = async (label: 'Ads' | 'Spam', days: number) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/clean/stale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, olderThanDays: days }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Cleaned ${data.count} old ${label} emails`);
            } else {
                toast.error(data.error || 'Failed to clean emails');
            }
        } catch (error) {
            toast.error('Failed to clean stale emails');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                    ← Back to Inbox
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Stale Email Cleanup</h1>
                    <p className="text-muted-foreground">Delete old promotional and spam emails</p>
                </div>
                <div className="w-32"></div>
            </div>

            <div className="grid gap-6">
                {/* Ads Cleanup */}
                <Card className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">Clean Old Ads</h2>
                            <p className="text-muted-foreground mb-4">
                                Remove promotional emails that are no longer relevant. Ads lose value quickly and can clutter your inbox.
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">Delete ads older than:</span>
                                <Select value={adsAge} onValueChange={setAdsAge}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="60">60 days</SelectItem>
                                        <SelectItem value="90">90 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            disabled={processing}
                            onClick={() => cleanStaleEmails('Ads', parseInt(adsAge))}
                            className="min-w-[140px]"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Clean Ads
                        </Button>
                    </div>
                </Card>

                {/* Spam Cleanup */}
                <Card className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">Clean Old Spam</h2>
                            <p className="text-muted-foreground mb-4">
                                Remove spam emails after they've been in the folder for a while. No need to keep junk forever.
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">Delete spam older than:</span>
                                <Select value={spamAge} onValueChange={setSpamAge}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3 days</SelectItem>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            disabled={processing}
                            onClick={() => cleanStaleEmails('Spam', parseInt(spamAge))}
                            className="min-w-[140px]"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Clean Spam
                        </Button>
                    </div>
                </Card>

                {/* Info Card */}
                <Card className="p-4 bg-muted/50">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-2">
                                <strong>How it works:</strong> This tool searches for emails with the selected label that are older than your chosen threshold and moves them to trash.
                            </p>
                            <p>
                                Items in trash are automatically deleted by Gmail after 30 days, or you can manually empty your trash at any time.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
