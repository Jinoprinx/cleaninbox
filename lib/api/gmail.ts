import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { Email, EmailLabel } from '@/types/email';
import { parseEmailHeaders } from '@/lib/utils/email';

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

  private getGmailClient() {
    return google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async listEmails(): Promise<Email[]> {
    const gmail = this.getGmailClient();
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

      const parsedEmail = parseEmailHeaders(email.data);
      emails.push(parsedEmail);
    }

    return emails;
  }

  async applyLabel(emailId: string, label: EmailLabel): Promise<void> {
    const gmail = this.getGmailClient();
    await this.ensureLabelExists(gmail, label);
    await this.modifyEmailLabels(gmail, emailId, label);
  }

  private async ensureLabelExists(gmail: any, label: EmailLabel) {
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
  }

  private async modifyEmailLabels(gmail: any, emailId: string, label: EmailLabel) {
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: [label],
      },
    });
  }
}