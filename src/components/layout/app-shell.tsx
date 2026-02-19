'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { useConversationStore } from '@/stores/conversation-store'
import { Menu, Plus } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
    const { toggleSidebar, createConversation } = useConversationStore()

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

                    {/* Brand — gradient text */}
                    <span
                        className="text-[15px] font-bold tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #D4788A 0%, #C9955C 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        AI Fun Meme
                    </span>

                    <button
                        onClick={createConversation}
                        className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                        style={{ background: 'rgba(212,120,138,0.08)', color: '#D4788A' }}
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                </header>

                <main className="flex-1 overflow-hidden w-full max-w-3xl mx-auto relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
