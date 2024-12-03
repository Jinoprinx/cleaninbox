import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { Email, EmailLabel } from '@/types/email';

export class GmailService {
  private oauth2Client: OAuth2Client;

  constructor(credentials: any) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.oauth2Client.setCredentials(credentials);
  }

  async listEmails(): Promise<Email[]> {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 100,
    });

    const messages = response.data.messages || [];
    const emails: Email[] = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
      });

      const headers = email.data.payload?.headers;
      const subject = headers?.find((h) => h.name === 'Subject')?.value || '';
      const from = headers?.find((h) => h.name === 'From')?.value || '';
      const date = headers?.find((h) => h.name === 'Date')?.value || '';

      emails.push({
        id: email.data.id!,
        threadId: email.data.threadId!,
        subject,
        snippet: email.data.snippet || '',
        from,
        date,
        labels: email.data.labelIds || [],
      });
    }

    return emails;
  }

  async applyLabel(emailId: string, label: EmailLabel): Promise<void> {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    // Create label if it doesn't exist
    try {
      await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: label,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        },
      });
    } catch (error) {
      // Label might already exist, continue
    }

    // Apply label to email
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: [label],
      },
    });
  }
}