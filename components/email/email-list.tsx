"use client";

import { EmailCard } from './email-card';
import type { Email, EmailLabel } from '@/types/email';

interface EmailListProps {
  emails: Email[];
  processing: string | null;
  onLabelApply: (emailId: string, label: EmailLabel) => Promise<void>;
}

export function EmailList({ emails, processing, onLabelApply }: EmailListProps) {
  return (
    <div className="grid gap-4">
      {Array.isArray(emails) && emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
          processing={processing}
          onLabelApply={onLabelApply}
        />
      ))}
    </div>
  );
}