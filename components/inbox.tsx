"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from './email/header';
import { EmailList } from './email/email-list';
import type { Email, EmailLabel } from '@/types/email';

export default function Inbox() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, [session]);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails');
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const applyLabel = async (emailId: string, label: EmailLabel) => {
    setProcessing(emailId);
    try {
      await fetch('/api/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, label }),
      });
      toast.success(`Marked as ${label.toLowerCase()}`);
      fetchEmails();
    } catch (error) {
      toast.error('Failed to apply label');
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
      <Header />
      <EmailList
        emails={emails}
        processing={processing}
        onLabelApply={applyLabel}
      />
    </div>
  );
}