"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, HardDrive, Trash2 } from 'lucide-react';
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
import type { Email } from '@/types/email';

interface LargeEmail extends Email {
    sizeEstimate: number;
}

export default function AttachmentsPage() {
    const { data: session } = useSession();
    const [emails, setEmails] = useState<LargeEmail[]>([]);
    const [loading, setLoading] = useState(true);
    const [minSize, setMinSize] = useState('10');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            fetchLargeEmails();
        }
    }, [session, minSize]);

    const fetchLargeEmails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/attachments?minSize=${minSize}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setEmails(data);
            }
        } catch (error) {
            toast.error('Failed to load large emails');
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (bytes: number): string => {
        const mb = bytes / (1024 * 1024);
        if (mb >= 1) {
            return `${mb.toFixed(2)} MB`;
        }
        return `${(bytes / 1024).toFixed(2)} KB`;
    };

    const handleDelete = async (emailId: string) => {
        setDeleting(emailId);
        try {
            // Use trash instead of permanent delete
            await fetch('/api/clean', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailIds: [emailId] }),
            });
            toast.success('Email moved to trash');
            setEmails(prev => prev.filter(e => e.id !== emailId));
        } catch (error) {
            toast.error('Failed to delete email');
        } finally {
            setDeleting(null);
        }
    };

    const totalSize = emails.reduce((sum, email) => sum + email.sizeEstimate, 0);

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
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Attachment Manager</h1>
                    <p className="text-muted-foreground">Find and clean large emails</p>
                </div>
                <div className="w-32"></div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Minimum size:</span>
                    <Select value={minSize} onValueChange={setMinSize}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 MB</SelectItem>
                            <SelectItem value="10">10 MB</SelectItem>
                            <SelectItem value="25">25 MB</SelectItem>
                            <SelectItem value="50">50 MB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <HardDrive className="h-6 w-6 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Total Size</div>
                            <div className="text-xl font-bold">{formatSize(totalSize)}</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-3">
                {emails.map((email) => (
                    <Card key={email.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate">{email.subject}</h3>
                                <p className="text-sm text-muted-foreground truncate">{email.from}</p>
                                <p className="text-xs text-muted-foreground mt-1">{email.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-primary">{formatSize(email.sizeEstimate)}</div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={!!deleting}
                                    onClick={() => handleDelete(email.id)}
                                >
                                    {deleting === email.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {emails.length === 0 && (
                    <Card className="p-8 text-center text-muted-foreground">
                        <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No large emails found with minimum size of {minSize} MB</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
