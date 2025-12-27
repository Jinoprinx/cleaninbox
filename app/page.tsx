import { getServerSession } from 'next-auth';
import Inbox from '@/components/inbox';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return <Inbox />;
}