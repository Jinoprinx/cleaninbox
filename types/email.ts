export type EmailLabel = 'Spam' | 'Important' | 'Ads';

export interface Email {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: string;
  date: string;
  labels: string[];
}

export interface Subscription {
  id: string;
  sender: string;
  email: string;
  unsubscribeLink?: string;
  unsubscribeEmail?: string;
  lastEmailDate: string;
}