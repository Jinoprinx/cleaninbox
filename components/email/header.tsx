"use client";

import { InboxIcon, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <InboxIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Smart Inbox</h1>
      </div>
      <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}