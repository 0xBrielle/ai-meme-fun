'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { useConversationStore } from '@/stores/conversation-store'
import { Menu, Plus } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
    const { toggleSidebar, createConversation } = useConversationStore()

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#FDF7F5]">
            {/* Sidebar (slide-over) */}
            <Sidebar />

            {/* Main area — full width on mobile */}
            <div className="flex flex-col flex-1 min-w-0 h-full relative">

                {/* Minimal top bar — just hamburger + new chat */}
                <div
                    className="flex items-center justify-between px-4 h-14 shrink-0 safe-top"
                    style={{
                        background: 'rgba(253,247,245,0.9)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderBottom: '1px solid rgba(232,160,168,0.1)',
                    }}
                >
                    {/* Hamburger — opens sidebar */}
                    <button
                        onClick={toggleSidebar}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9B8A8D] hover:bg-[#F5E8E4] transition-colors active:scale-95"
                    >
                        <Menu size={20} />
                    </button>

                    <span className="text-[15px] font-semibold text-[#2D2426] tracking-tight">
                        AI Fun Meme
                    </span>

                    {/* New Chat shortcut */}
                    <button
                        onClick={createConversation}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#E8A0A8] hover:bg-[#F5E8E4] transition-colors active:scale-95"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-hidden w-full max-w-3xl mx-auto relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
