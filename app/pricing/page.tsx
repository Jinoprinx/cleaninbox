"use client";

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/email/header';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                    ← Back to Inbox
                </Link>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-muted-foreground">Choose the plan that fits your inbox needs</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="p-8 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold">Free Plan</h2>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-muted-foreground ml-2">/month</span>
                        </div>
                        <p className="text-muted-foreground mt-2">Perfect for getting organized.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Smart Labeling (Spam, Important, Ads)</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Inbox Filtering</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Bulk Cleaning (Move to Trash)</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Auto-Rules for Senders</span>
                        </li>
                    </ul>

                    <Button className="w-full" variant="outline" disabled>
                        Current Plan
                    </Button>
                </Card>

                {/* Pro Plan */}
                <Card className="p-8 flex flex-col border-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                        RECOMMENDED
                    </div>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold">Pro Plan</h2>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-bold">$5</span>
                            <span className="text-muted-foreground ml-2">/month</span>
                        </div>
                        <p className="text-muted-foreground mt-2">Power tools for inbox zero heroes.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Everything in Free</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Subscription Manager & One-Click Unsubscribe</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>"Stale Email" Auto-Cleaning Rules</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Top Sender Analytics Dashboard</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Smart Sender Muting</span>
                        </li>
                    </ul>

                    <Button className="w-full">
                        Upgrade to Pro
                    </Button>
                </Card>
            </div>
        </div>
    );
}
