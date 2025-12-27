"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from './email/header';
import { EmailList } from './email/email-list';
import type { Email, EmailLabel } from '@/types/email';

export default function Inbox() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [filter, setFilter] = useState<string>("All Email");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchEmails(filter);
    }
  }, [session, filter]);

  const fetchEmails = async (category: string = 'All Email') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails?label=${category}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setEmails(data);
      } else {
        console.error('Expected array of emails, got:', data);
        setEmails([]);
        if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch emails');
      setEmails([]);
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
      fetchEmails(filter);
    } catch (error) {
      toast.error('Failed to apply label');
    } finally {
      setProcessing(null);
    }
  };

  const cleanLabel = async (label: EmailLabel) => {
    try {
      toast.info(`Cleaning ${label} emails...`);
      await fetch('/api/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
      });
      toast.success(`Cleaned all ${label} emails`);
      fetchEmails(filter);
    } catch (error) {
      toast.error('Failed to clean emails');
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {/* Dropdown Menu */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Email">All Email</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
              <SelectItem value="Important">Important</SelectItem>
              <SelectItem value="Ads">Ads</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <Button variant="destructive" onClick={() => cleanLabel('Spam')}>Clean Spam</Button>
          <Button variant="outline" onClick={() => cleanLabel('Ads')}>Clean Ads</Button>
        </div>
      </div>
      <EmailList
        emails={emails}
        processing={processing}
        onLabelApply={applyLabel}
      />
    </div>
  );
}