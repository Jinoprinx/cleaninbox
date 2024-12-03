import { InboxIcon } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <InboxIcon className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-bold">Smart Inbox</h1>
    </div>
  );
}