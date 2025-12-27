"use client";

import { Mail, Loader2, AlertTriangle, Star, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Email, EmailLabel } from '@/types/email';

interface EmailCardProps {
  email: Email;
  processing: string | null;
  onLabelApply: (emailId: string, label: EmailLabel) => Promise<void>;
}

export function EmailCard({ email, processing, onLabelApply }: EmailCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{email.from}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{email.subject}</h3>
          <p className="text-muted-foreground">{email.snippet}</p>
          <div className="mt-2 flex gap-2">
            {email.labels.map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!!processing}
            onClick={() => onLabelApply(email.id, 'Spam')}
          >
            {processing === email.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span className="ml-2">Spam</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!!processing}
            onClick={() => onLabelApply(email.id, 'Important')}
          >
            {processing === email.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Star className="h-4 w-4" />
            )}
            <span className="ml-2">Important</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!!processing}
            onClick={() => onLabelApply(email.id, 'Ads')}
          >
            {processing === email.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Tag className="h-4 w-4" />
            )}
            <span className="ml-2">Ads</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}