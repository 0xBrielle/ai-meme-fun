'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { useConversationStore } from '@/stores/conversation-store'
import { Menu } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
    const { toggleSidebar } = useConversationStore()
    const router = useRouter()

    return (
        <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#F5EFE9' }}>
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 h-full relative">

                {/* Header */}
                <header
                    className="flex items-center justify-between px-5 h-14 shrink-0 safe-top z-30"
                    style={{
                        background: 'rgba(245,239,233,0.88)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderBottom: '1px solid rgba(212,120,138,0.1)',
                    }}
                >
                    <button
                        onClick={toggleSidebar}
                        className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                        style={{ background: 'rgba(212,120,138,0.08)', color: '#D4788A' }}
                    >
                        <Menu size={18} strokeWidth={2.5} />
                    </button>

                    {/* Brand — Elle AI logo (50% larger: 28px → 42px) */}
                    <img
                        src="/assets/logos/logoElle.png"
                        alt="Elle AI"
                        className="h-[42px] w-auto object-contain"
                        style={{ maxWidth: '144px' }}
                    />

                    {/* 🚀 Pro button — navigates to /pro page */}
                    <button
                        onClick={() => router.push('/pro')}
                        className="flex items-center justify-center h-9 px-2 rounded-2xl transition-all active:scale-90"
                        style={{
                            background: 'linear-gradient(135deg, rgba(212,120,138,0.15), rgba(201,149,92,0.15))',
                            border: '1px solid rgba(212,120,138,0.25)',
                        }}
                    >
                        <img
                            src="/assets/logos/logoPro.png"
                            alt="Pro"
                            className="h-6 w-auto object-contain"
                            style={{ maxWidth: '72px' }}
                        />
                    </button>
                </header>

                <main className="flex-1 overflow-hidden w-full max-w-3xl mx-auto relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
