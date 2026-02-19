'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, Search, Settings, LogOut, User, MessageSquare, X, Trash2 } from 'lucide-react'
import { useConversationStore } from '@/stores/conversation-store'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export function Sidebar() {
    const {
        conversations,
        activeConversationId,
        sidebarOpen,
        setSidebar,
        createConversation,
        setActiveConversation,
        deleteConversation,
    } = useConversationStore()

    const [searchQuery, setSearchQuery] = React.useState('')
    const [searchFocused, setSearchFocused] = React.useState(false)

    const filtered = conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (!sidebarOpen) return null

    return (
        <>
            {/* Backdrop — tap to close */}
            <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={() => setSidebar(false)}
            />

            {/* Sidebar Panel */}
            <aside
                className="fixed top-0 left-0 bottom-0 z-50 w-[300px] flex flex-col safe-top safe-bottom"
                style={{
                    background: 'linear-gradient(180deg, #FBF0EE 0%, #FDF7F5 100%)',
                    borderRight: '1px solid rgba(232, 160, 168, 0.2)',
                    boxShadow: '8px 0 32px rgba(0,0,0,0.08)',
                }}
            >
                {/* === TOP: New Chat + Search + Close === */}
                <div className="px-4 pt-4 pb-3 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                        <span className="text-[15px] font-semibold text-[#2D2426]">AI Fun Meme</span>
                        <button
                            onClick={() => setSidebar(false)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9B8A8D] hover:bg-[#F5E8E4] transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* New Chat button */}
                    <button
                        onClick={createConversation}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[14px] font-semibold text-white transition-all active:scale-98"
                        style={{
                            background: 'linear-gradient(135deg, #E8A0A8 0%, #D4757F 100%)',
                            boxShadow: '0 4px 12px rgba(232, 160, 168, 0.4)',
                        }}
                    >
                        <Plus size={17} strokeWidth={2.5} />
                        New Chat
                    </button>

                    {/* Search bar */}
                    <div
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                        style={{
                            background: searchFocused ? '#FFFFFF' : '#F5E8E4',
                            border: `1px solid ${searchFocused ? 'rgba(232,160,168,0.5)' : 'transparent'}`,
                        }}
                    >
                        <Search size={15} className="text-[#C4B0B3] shrink-0" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#2D2426] placeholder:text-[#C4B0B3] font-light"
                        />
                    </div>
                </div>

                {/* === MIDDLE: Conversation List === */}
                <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
                            <MessageSquare size={28} className="text-[#E8A0A8] opacity-40" />
                            <p className="text-[13px] text-[#C4B0B3] font-light">
                                {searchQuery ? 'No chats found' : 'No conversations yet'}
                            </p>
                        </div>
                    )}

                    {filtered.map((convo) => {
                        const isActive = convo.id === activeConversationId
                        return (
                            <div key={convo.id} className="group relative flex items-center">
                                <button
                                    onClick={() => setActiveConversation(convo.id)}
                                    className={cn(
                                        'w-full text-left px-3 py-3 rounded-xl transition-all flex flex-col gap-0.5',
                                        isActive
                                            ? 'bg-white shadow-sm'
                                            : 'hover:bg-white/60'
                                    )}
                                    style={isActive ? {
                                        border: '1px solid rgba(232,160,168,0.2)',
                                    } : { border: '1px solid transparent' }}
                                >
                                    <span className={cn(
                                        'text-[14px] font-medium truncate pr-6',
                                        isActive ? 'text-[#2D2426]' : 'text-[#5A4A4D]'
                                    )}>
                                        {convo.title}
                                    </span>
                                    <span className="text-[11px] text-[#C4B0B3] font-light">
                                        {formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true })}
                                    </span>
                                </button>

                                {/* Delete button — appears on hover */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id) }}
                                    className="absolute right-2 w-7 h-7 rounded-lg flex items-center justify-center text-[#C4B0B3] hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* === BOTTOM: Profile + Settings + Sign Out === */}
                <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(232,160,168,0.15)' }}>
                    <Link href="/settings">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-[#5A4A4D] hover:bg-white/60 transition-colors">
                            <Settings size={17} className="text-[#C4B0B3]" />
                            Settings
                        </button>
                    </Link>

                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #E8A0A8, #D4757F)' }}>
                            <User size={15} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#2D2426] truncate">My Account</p>
                            <p className="text-[11px] text-[#C4B0B3] font-light">47 credits remaining</p>
                        </div>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C4B0B3] hover:text-red-400 hover:bg-red-50 transition-colors">
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
