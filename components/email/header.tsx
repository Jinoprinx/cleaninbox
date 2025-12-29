"use client";

import { InboxIcon, LogOut, Wrench } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <InboxIcon className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-medium text-foreground">Smart Inbox</h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="gap-2 bg-[#FBBC04] hover:bg-[#F9AB00] text-gray-900 border-2 border-[#34A853] font-medium shadow-sm"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Tools</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link href="/subscriptions">
              <DropdownMenuItem className="cursor-pointer">
                Subscription Manager
              </DropdownMenuItem>
            </Link>
            <Link href="/analytics">
              <DropdownMenuItem className="cursor-pointer">
                Analytics Dashboard
              </DropdownMenuItem>
            </Link>
            <Link href="/attachments">
              <DropdownMenuItem className="cursor-pointer">
                Attachment Manager
              </DropdownMenuItem>
            </Link>
            <Link href="/triage">
              <DropdownMenuItem className="cursor-pointer">
                Triage Mode
              </DropdownMenuItem>
            </Link>
            <Link href="/cleanup">
              <DropdownMenuItem className="cursor-pointer">
                Stale Email Cleanup
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/pricing">
          <Button variant="default" size="sm" className="hidden md:flex gap-2">
            Upgrade to Pro
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/auth/login' })} className="gap-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}