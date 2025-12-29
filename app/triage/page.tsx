"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Email, EmailLabel } from '@/types/email';

export default function TriagePage() {
    const { data: session } = useSession();
    const [emails, setEmails] = useState<Email[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (session) {
            fetchEmails();
        }
    }, [session]);

    const fetchEmails = async () => {
        try {
            const response = await fetch('/api/emails');
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setEmails(data);
                setLoading(false);
            } else {
                setCompleted(true);
                setLoading(false);
            }
        } catch (error) {
            toast.error('Failed to load emails');
            setLoading(false);
        }
    };

    const applyLabel = async (label: EmailLabel) => {
        if (!currentEmail) return;

        setProcessing(true);
        try {
            await fetch('/api/label', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailId: currentEmail.id, label }),
            });
            toast.success(`Marked as ${label}`);
            nextEmail();
        } catch (error) {
            toast.error('Failed to apply label');
        } finally {
            setProcessing(false);
        }
    };

    const archiveEmail = async () => {
        if (!currentEmail) return;

        setProcessing(true);
        try {
            // Archive by removing INBOX label
            await fetch('/api/archive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailId: currentEmail.id }),
            });
            toast.success('Archived');
            nextEmail();
        } catch (error) {
            toast.error('Failed to archive');
        } finally {
            setProcessing(false);
        }
    };

    const deleteEmail = async () => {
        if (!currentEmail) return;

        setProcessing(true);
        try {
            await fetch('/api/clean', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailIds: [currentEmail.id] }),
            });
            toast.success('Moved to trash');
            nextEmail();
        } catch (error) {
            toast.error('Failed to delete');
        } finally {
            setProcessing(false);
        }
    };

    const nextEmail = () => {
        if (currentIndex + 1 >= emails.length) {
            setCompleted(true);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const skipEmail = () => {
        nextEmail();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (processing || completed) return;

            const key = e.key.toLowerCase();

            switch (key) {
                case 'e':
                    archiveEmail();
                    break;
                case 's':
                    applyLabel('Spam');
                    break;
                case 'd':
                    deleteEmail();
                    break;
                case 'i':
                    applyLabel('Important');
                    break;
                case 'a':
                    applyLabel('Ads');
                    break;
                case 'n':
                case 'arrowright':
                    skipEmail();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, processing, completed, emails]);

    const currentEmail = emails[currentIndex];
    const progress = emails.length > 0 ? ((currentIndex + 1) / emails.length) * 100 : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (completed) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="p-12 text-center max-w-md">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Inbox Zero!</h2>
                    <p className="text-muted-foreground mb-6">You've processed all emails in triage mode.</p>
                    <Link href="/">
                        <Button>Return to Inbox</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <Link href="/" className="text-lg font-bold">
                    ← Exit Triage
                </Link>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Triage Mode</h1>
                    <p className="text-sm text-muted-foreground">{currentIndex + 1} of {emails.length}</p>
                </div>
                <div className="w-24"></div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Email Card */}
            {currentEmail && (
                <Card className="p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-4">{currentEmail.subject}</h2>
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                        <span>{currentEmail.from}</span>
                        <span>{currentEmail.date}</span>
                    </div>
                    <p className="text-lg leading-relaxed">{currentEmail.snippet}</p>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <Button
                    variant="outline"
                    onClick={archiveEmail}
                    disabled={processing}
                    className="h-16"
                >
                    <div className="text-center">
                        <div className="font-bold">E</div>
                        <div className="text-xs">Archive</div>
                    </div>
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => applyLabel('Spam')}
                    disabled={processing}
                    className="h-16"
                >
                    <div className="text-center">
                        <div className="font-bold">S</div>
                        <div className="text-xs">Spam</div>
                    </div>
                </Button>
                <Button
                    variant="destructive"
                    onClick={deleteEmail}
                    disabled={processing}
                    className="h-16"
                >
                    <div className="text-center">
                        <div className="font-bold">D</div>
                        <div className="text-xs">Delete</div>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => applyLabel('Important')}
                    disabled={processing}
                    className="h-16"
                >
                    <div className="text-center">
                        <div className="font-bold">I</div>
                        <div className="text-xs">Important</div>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => applyLabel('Ads')}
                    disabled={processing}
                    className="h-16"
                >
                    <div className="text-center">
                        <div className="font-bold">A</div>
                        <div className="text-xs">Ads</div>
                    </div>
                </Button>
                <Button
                    variant="secondary"
                    onClick={skipEmail}
                    disabled={processing}
                    className="h-16"
                >
                    <div className="text-center">
                        <div className="font-bold">N</div>
                        <div className="text-xs">Skip</div>
                    </div>
                </Button>
            </div>

            {/* Keyboard Shortcuts Help */}
            <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-2 text-sm">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div><kbd className="px-2 py-1 bg-background rounded">E</kbd> Archive</div>
                    <div><kbd className="px-2 py-1 bg-background rounded">S</kbd> Mark Spam</div>
                    <div><kbd className="px-2 py-1 bg-background rounded">D</kbd> Delete</div>
                    <div><kbd className="px-2 py-1 bg-background rounded">I</kbd> Important</div>
                    <div><kbd className="px-2 py-1 bg-background rounded">A</kbd> Mark Ads</div>
                    <div><kbd className="px-2 py-1 bg-background rounded">N</kbd> Skip</div>
                </div>
            </Card>
        </div>
    );
}
