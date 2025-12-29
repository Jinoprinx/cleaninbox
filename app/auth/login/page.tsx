"use client";

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Zap, BarChart3, Trash2, Filter, CheckCircle } from 'lucide-react';
import EmailPurgeBackground from '@/components/EmailPurgeBackground';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 relative">
            {/* Animated Background */}
            <EmailPurgeBackground />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Smart Inbox</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Take control of your Gmail with intelligent labeling, powerful analytics, and automated cleanup tools.
                        </p>
                        <Button size="lg" onClick={() => signIn('google', { callbackUrl: '/' })} className="gap-2">
                            <Mail className="h-5 w-5" />
                            Sign in with Google
                        </Button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                        <Card className="p-6 bg-gray-900 border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Smart Labeling</h3>
                            <p className="text-sm text-gray-400">
                                Automatically categorize emails as Spam, Important, or Ads with intelligent filters.
                            </p>
                        </Card>

                        <Card className="p-6 bg-gray-900 border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Analytics Dashboard</h3>
                            <p className="text-sm text-gray-400">
                                See who's sending you the most emails and identify storage-hogging senders.
                            </p>
                        </Card>

                        <Card className="p-6 bg-gray-900 border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Trash2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Bulk Cleanup</h3>
                            <p className="text-sm text-gray-400">
                                Delete old promotional emails and spam in bulk to reclaim storage space.
                            </p>
                        </Card>

                        <Card className="p-6 bg-gray-900 border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <CheckCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">One-Click Unsubscribe</h3>
                            <p className="text-sm text-gray-400">
                                Manage subscriptions and unsubscribe from unwanted newsletters instantly.
                            </p>
                        </Card>

                        <Card className="p-6 bg-gray-900 border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Filter className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Triage Mode</h3>
                            <p className="text-sm text-gray-400">
                                Process emails rapidly with keyboard shortcuts for quick inbox zero.
                            </p>
                        </Card>

                        <Card className="p-6 bg-gray-900 border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Attachment Manager</h3>
                            <p className="text-sm text-gray-400">
                                Find and remove large emails to free up storage in your Gmail account.
                            </p>
                        </Card>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-12 text-sm text-muted-foreground">
                        <p>Secure OAuth authentication • Read-only access to Gmail • Your data stays private</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
