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
                className="fixed top-0 left-0 bottom-0 z-50 w-[285px] flex flex-col safe-top safe-bottom"
                style={{
                    background: '#FAF5F2',
                    borderRight: '1px solid rgba(212, 120, 138, 0.12)',
                    boxShadow: '12px 0 48px rgba(0,0,0,0.1), 4px 0 12px rgba(0,0,0,0.04)',
                }}
            >
                {/* === TOP HERO SECTION === */}
                <div
                    className="px-5 pt-6 pb-5"
                    style={{
                        background: 'linear-gradient(160deg, #F9E8EC 0%, #FAF0E8 60%, #FAF5F2 100%)',
                        borderBottom: '1px solid rgba(212, 120, 138, 0.1)',
                    }}
                >
                    {/* Logo row */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex flex-col">
                            <img
                                src="/assets/logos/logoElle.png"
                                alt="Elle AI"
                                className="h-9 w-auto object-contain object-left"
                                style={{ maxWidth: '120px' }}
                            />
                            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mt-1" style={{ color: '#BFB0AB' }}>
                                Creative Studio
                            </p>
                        </div>
                        <button
                            onClick={() => setSidebar(false)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                            style={{ background: 'rgba(212, 120, 138, 0.1)', color: '#D4788A' }}
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* New Chat button */}
                    <button
                        onClick={createConversation}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold text-white tracking-wide transition-all active:scale-98"
                        style={{
                            background: 'linear-gradient(135deg, #D4788A 0%, #A84D60 100%)',
                            boxShadow: '0 4px 16px rgba(212, 120, 138, 0.35), 0 1px 4px rgba(0,0,0,0.1)',
                            letterSpacing: '0.04em',
                        }}
                    >
                        <Plus size={16} strokeWidth={3} />
                        NEW CHAT
                    </button>

                    {/* Search */}
                    <div
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl mt-3 transition-all"
                        style={{
                            background: searchFocused ? '#FFFFFF' : 'rgba(212, 120, 138, 0.06)',
                            border: `1px solid ${searchFocused ? 'rgba(212, 120, 138, 0.35)' : 'transparent'}`,
                            boxShadow: searchFocused ? '0 0 0 3px rgba(212,120,138,0.08)' : 'none',
                        }}
                    >
                        <Search size={14} style={{ color: '#BFB0AB' }} className="shrink-0" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="flex-1 bg-transparent border-none outline-none text-[13px] font-light placeholder:text-[#BFB0AB]"
                            style={{ color: '#1C1410' }}
                        />
                    </div>
                </div>

                {/* === CONVERSATION LIST === */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                    {/* Section label */}
                    {filtered.length > 0 && (
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold px-2 pb-1" style={{ color: '#BFB0AB' }}>
                            Recent
                        </p>
                    )}

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ background: 'rgba(212, 120, 138, 0.08)' }}
                            >
                                <MessageSquare size={22} style={{ color: '#D4788A', opacity: 0.5 }} />
                            </div>
                            <p className="text-[13px] font-light" style={{ color: '#BFB0AB' }}>
                                {searchQuery ? 'No results' : 'Start your first chat'}
                            </p>
                        </div>
                    )}

                    {filtered.map((convo) => {
                        const isActive = convo.id === activeConversationId
                        return (
                            <div key={convo.id} className="group relative">
                                <button
                                    onClick={() => setActiveConversation(convo.id)}
                                    className="w-full text-left px-3 py-3 rounded-2xl transition-all"
                                    style={isActive ? {
                                        background: 'linear-gradient(135deg, rgba(212, 120, 138, 0.12), rgba(201, 149, 92, 0.06))',
                                        border: '1px solid rgba(212, 120, 138, 0.2)',
                                        boxShadow: '0 2px 8px rgba(212, 120, 138, 0.08)',
                                    } : {
                                        border: '1px solid transparent',
                                    }}
                                >
                                    {/* Active indicator dot */}
                                    <div className="flex items-start gap-2.5">
                                        {isActive && (
                                            <div
                                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #D4788A, #C9955C)' }}
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-[13px] font-medium truncate pr-5"
                                                style={{ color: isActive ? '#1C1410' : '#5C4D49' }}
                                            >
                                                {convo.title}
                                            </p>
                                            <p className="text-[11px] font-light mt-0.5" style={{ color: '#BFB0AB' }}>
                                                {formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                {/* Delete — hover only */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id) }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                    style={{ color: '#BFB0AB' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#BFB0AB' }}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* === BOTTOM: Profile === */}
                <div
                    className="px-3 py-4 space-y-1"
                    style={{ borderTop: '1px solid rgba(212, 120, 138, 0.1)' }}
                >
                    <Link href="/settings">
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13px] transition-all"
                            style={{ color: '#5C4D49' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212, 120, 138, 0.06)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <Settings size={16} style={{ color: '#BFB0AB' }} />
                            Settings
                        </button>
                    </Link>

                    {/* Account row */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl">
                        <div
                            className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #D4788A, #A84D60)' }}
                        >
                            <User size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold truncate" style={{ color: '#1C1410' }}>My Account</p>
                            <p className="text-[11px] font-light" style={{ color: '#C9955C' }}>
                                47 credits
                            </p>
                        </div>
                        <button
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                            style={{ color: '#BFB0AB' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#BFB0AB' }}
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
