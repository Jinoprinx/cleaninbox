"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const EMAILS = [
    { sender: "Weekly Newsletter", subject: "Your digest is here!", type: "unwanted", color: "red" },
    { sender: "Project Team", subject: "Meeting notes", type: "keep", color: "blue" },
    { sender: "Spam Deals", subject: "50% OFF EVERYTHING!", type: "unwanted", color: "red" },
    { sender: "Bank Alert", subject: "Transaction confirmed", type: "keep", color: "green" },
    { sender: "Promo Blast", subject: "Limited time offer", type: "unwanted", color: "orange" },
    { sender: "Work Notification", subject: "Task assigned", type: "keep", color: "blue" },
    { sender: "Marketing Co", subject: "Don't miss out!", type: "unwanted", color: "red" },
    { sender: "Finance Team", subject: "Invoice ready", type: "keep", color: "green" },
];

export default function EmailPurgeBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const messageRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

        // Create cards dynamically
        const fragment = document.createDocumentFragment();
        cardsRef.current = [];

        EMAILS.forEach((email, i) => {
            const card = document.createElement('div');
            const borderColor = email.type === 'unwanted'
                ? 'border-red-500'
                : email.color === 'blue' ? 'border-blue-500' : 'border-green-500';

            card.className = `email-card absolute bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 text-xs shadow-google border-l-4 ${borderColor} w-56`;
            card.innerHTML = `
        <div class="font-semibold truncate text-foreground">${email.sender}</div>
        <div class="text-muted-foreground truncate mt-1">${email.subject}</div>
        <div class="mt-2 text-lg">${email.type === 'unwanted' ? '🗑️' : '✅'}</div>
      `;
            card.style.opacity = '0';
            card.style.left = `${10 + (i % 3) * 30}%`;
            card.style.top = `${10 + Math.floor(i / 3) * 25}%`;

            fragment.appendChild(card);
            cardsRef.current.push(card);
        });

        // Create success messages
        const messageDiv = document.createElement('div');
        messageDiv.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-green-600 whitespace-nowrap';
        messageDiv.textContent = 'Your Inbox is now clean';
        messageDiv.style.opacity = '0';
        messageRef.current = messageDiv;

        const statsDiv = document.createElement('div');
        statsDiv.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 text-2xl font-semibold text-blue-600 whitespace-nowrap';
        statsDiv.textContent = '76% Storage Space Recovered';
        statsDiv.style.opacity = '0';
        statsRef.current = statsDiv;

        fragment.appendChild(messageDiv);
        fragment.appendChild(statsDiv);

        containerRef.current.appendChild(fragment);

        // Phase 1: Inflow with Google-style entrance
        tl.fromTo(cardsRef.current, {
            y: (i: number) => (i % 3 === 0 ? -60 : i % 3 === 1 ? 60 : 0),
            x: (i: number) => (i % 2 === 0 ? -40 : 40),
            opacity: 0,
            scale: 0.8,
            rotation: (i: number) => (i % 2 === 0 ? -5 : 5)
        }, {
            y: 0,
            x: 0,
            opacity: 0.9,
            scale: 1,
            rotation: 0,
            duration: 1.8,
            stagger: 0.12,
            ease: "power3.out"
        }, 0);

        // Phase 2: Highlight unwanted emails with red pulsing
        tl.to(
            cardsRef.current.filter((_, i) => EMAILS[i].type === 'unwanted'),
            {
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)",
                scale: 1.05,
                duration: 0.4,
                yoyo: true,
                repeat: 2,
                ease: "power2.inOut"
            },
            2.5
        );

        // Phase 3: Purge unwanted emails (no sound)
        tl.to(
            cardsRef.current.filter((_, i) => EMAILS[i].type === 'unwanted'),
            {
                scale: 0,
                opacity: 0,
                rotation: (i: number) => (i % 2 === 0 ? 360 : -360),
                filter: "blur(4px)",
                x: (i: number) => (i % 2 === 0 ? -200 : 200),
                y: -100,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.in"
            },
            4
        );

        // Phase 4: Keep emails settle with gentle bounce
        tl.to(
            cardsRef.current.filter((_, i) => EMAILS[i].type === 'keep'),
            {
                y: (i: number) => 30 + (i * 10),
                scale: 0.95,
                opacity: 0.6,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            },
            4.2
        );

        // Phase 5: Show success message - slide in from left
        tl.fromTo(messageRef.current,
            {
                x: -500,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            },
            5
        );

        // Phase 6: Show stats message - slide in from right
        tl.fromTo(statsRef.current,
            {
                x: 500,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            },
            5.5
        );

        // Phase 7: Hold messages briefly
        tl.to({}, { duration: 1.5 }, 6.5);

        // Phase 8: Fade out everything
        tl.to([...cardsRef.current, messageRef.current, statsRef.current], {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "power2.in"
        }, 8);

        return () => {
            tl.kill();
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-30"
            aria-hidden="true"
            role="presentation"
        />
    );
}
