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

  private getGmailClient() {
    return google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async listEmails(category: string = 'All Email'): Promise<Email[]> {
    const gmail = this.getGmailClient();

    // 1. Fetch Labels to create ID -> Name map (needed for mapping IDs to names later)
    const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
    const labelMap = new Map<string, string>();
    labelsResponse.data.labels?.forEach((l: any) => {
      if (l.id && l.name) {
        if (l.id === 'SPAM') labelMap.set(l.id, 'Spam');
        else if (l.id === 'IMPORTANT') labelMap.set(l.id, 'Important');
        else labelMap.set(l.id, l.name);
      }
    });

    // 2. Determine which Label ID to fetch from
    let labelIdToFetch = 'INBOX';
    if (category !== 'All Email') {
      try {
        labelIdToFetch = await this.getOrCreateLabelId(gmail, category);
      } catch (error) {
        console.error(`Could not resolve label for category ${category}, defaulting to INBOX`);
      }
    }

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [labelIdToFetch],
      maxResults: 100,
    });

    const messages = response.data.messages || [];

    // Process in parallel chunks to be faster
    const chunkHelp = async (msg: any) => {
      try {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        });

        const headers = email.data.payload?.headers;
        const subject = headers?.find((h) => h.name === 'Subject')?.value || '';
        const from = headers?.find((h) => h.name === 'From')?.value || '';
        const date = headers?.find((h) => h.name === 'Date')?.value || '';

        // Map IDs to Names
        const rawLabelIds = email.data.labelIds || [];
        const humanLabels = rawLabelIds.map((id: string) => labelMap.get(id) || id);

        return {
          id: email.data.id!,
          threadId: email.data.threadId!,
          subject,
          snippet: email.data.snippet || '',
          from,
          date,
          labels: humanLabels,
        };
      } catch (error) {
        return null;
      }
    };

    const results = await Promise.all(messages.map(chunkHelp));
    return results.filter((email): email is Email => email !== null);
  }

  // Helper to get ID for system labels or create custom ones
  private async getOrCreateLabelId(gmail: any, labelName: string): Promise<string> {
    // Map display names to System IDs
    if (labelName.toLowerCase() === 'spam') return 'SPAM';
    if (labelName.toLowerCase() === 'important') return 'IMPORTANT';

    const labels = await gmail.users.labels.list({ userId: 'me' });
    const existing = labels.data.labels?.find((l: any) => l.name === labelName);

    if (existing?.id) return existing.id;

    // Create if doesn't exist
    try {
      const newLabel = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: labelName,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        },
      });
      return newLabel.data.id!;
    } catch (error) {
      throw new Error(`Failed to create label: ${labelName}`);
    }
  }

  async applyLabel(emailId: string, label: EmailLabel): Promise<void> {
    const gmail = this.getGmailClient();

    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
    });

    const headers = email.data.payload?.headers;
    const fromHeader = headers?.find((h) => h.name === 'From')?.value || '';
    const senderMatch = fromHeader.match(/<(.+)>/);
    const sender = senderMatch ? senderMatch[1] : fromHeader;

    if (!sender) throw new Error("Could not determine sender");

    // Resolve Label ID
    const labelId = await this.getOrCreateLabelId(gmail, label);

    // 3. Create Filter for FUTURE emails
    await this.createSenderFilter(gmail, sender, labelId);

    // 4. Label ALL CURRENT emails from sender
    await this.labelAllFromSender(gmail, sender, labelId);
  }

  // Not strictly needed as getOrCreate handles creation, but keeping for filter logic if needed
  private async createSenderFilter(gmail: any, sender: string, labelId: string) {
    try {
      await gmail.users.settings.filters.create({
        userId: 'me',
        requestBody: {
          criteria: { from: sender },
          action: {
            addLabelIds: [labelId],
            // Don't remove INBOX for Important/Ads unless specified, 
            // Use removeLabelIds: ['INBOX'] only if truly desired behavior (Archive)
          }
        }
      });
    } catch (e) {
      // Filter exists or error
    }
  }

  private async labelAllFromSender(gmail: any, sender: string, labelId: string) {
    let query = `from:${sender}`;
    let messages: any[] = [];

    let response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 500
    });

    if (response.data.messages) {
      messages = messages.concat(response.data.messages);
    }

    if (messages.length === 0) return;

    const batchSize = 1000;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize).map((m: any) => m.id);
      await gmail.users.messages.batchModify({
        userId: 'me',
        requestBody: {
          ids: batch,
          addLabelIds: [labelId]
        }
      });
    }
  }

  async batchDeleteByLabel(label: EmailLabel): Promise<void> {
    const gmail = this.getGmailClient();
    // Get Label ID via helper
    const labelId = await this.getOrCreateLabelId(gmail, label);

    let messages: any[] = [];
    let pageToken = undefined;

    do {
      const response: any = await gmail.users.messages.list({
        userId: 'me',
        labelIds: [labelId],
        maxResults: 500,
        pageToken: pageToken
      });

      if (response.data.messages) {
        messages = messages.concat(response.data.messages);
      }
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    if (messages.length === 0) return;

    // Move to Trash (batchModify) instead of permanent delete (batchDelete)
    // This works with 'gmail.modify' scope and is safer for users.
    const batchSize = 1000;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize).map((m: any) => m.id);
      await gmail.users.messages.batchModify({
        userId: 'me',
        requestBody: {
          ids: batch,
          addLabelIds: ['TRASH']
        }
      });
    }
  }
}