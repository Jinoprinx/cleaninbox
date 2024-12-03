export type EmailLabel = 'SPAM' | 'IMPORTANT' | 'PROMOTIONAL';

export interface Email {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: string;
  date: string;
  labels: string[];
}