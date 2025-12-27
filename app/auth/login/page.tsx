"use client";

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function LoginPage() {
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
                <Button size="lg" onClick={() => signIn('google', { callbackUrl: '/' })}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
