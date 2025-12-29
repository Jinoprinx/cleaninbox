"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, TrendingUp, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SenderStat {
    sender: string;
    email: string;
    count: number;
}

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<SenderStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchStats();
        }
    }, [session]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            if (Array.isArray(data)) {
                setStats(data);
            }
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalEmails = stats.reduce((sum, stat) => sum + stat.count, 0);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                    ← Back to Inbox
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Inbox Analytics</h1>
                    <p className="text-muted-foreground">Top senders from your last 500 emails</p>
                </div>
                <div className="w-32"></div>
            </div>

            <div className="grid gap-6">
                {/* Summary Card */}
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <div>
                            <h2 className="text-2xl font-bold">{totalEmails} Total Emails Analyzed</h2>
                            <p className="text-muted-foreground">From {stats.length} unique senders</p>
                        </div>
                    </div>
                </Card>

                {/* Top Senders List */}
                <div className="grid gap-3">
                    {stats.map((stat, index) => (
                        <Card key={stat.email} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{stat.sender}</h3>
                                        <p className="text-sm text-muted-foreground">{stat.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{stat.count}</div>
                                        <div className="text-xs text-muted-foreground">emails</div>
                                    </div>
                                    <div className="w-32">
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${(stat.count / stats[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {stats.length === 0 && (
                    <Card className="p-8 text-center text-muted-foreground">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No email data available for analysis</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
