import { getServerSession } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Inbox from '@/components/inbox';

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <Mail className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Smart Email Labeling</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Automatically organize your Gmail inbox with intelligent labeling for spam, important messages, and promotional content.
          </p>
          <Button asChild size="lg">
            <a href="/api/auth/signin">Sign in with Google</a>
          </Button>
        </div>
      </div>
    );
  }

  return <Inbox />;
}