'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Home, Compass, Plus, Image, User } from 'lucide-react'

type ProTab = 'home' | 'explore' | 'create' | 'assets' | 'profile'

export default function ProPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState<ProTab>('home')

    return (
        <div
            className="flex flex-col h-screen w-screen overflow-hidden"
            style={{ background: '#F5EFE9' }}
        >
            {/* ── Top Bar ─────────────────────────────────────────── */}
            <header
                className="flex items-center justify-between px-5 h-14 shrink-0 safe-top z-30"
                style={{
                    background: 'rgba(245,239,233,0.88)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: '1px solid rgba(212,120,138,0.1)',
                }}
            >
                {/* ⚡ElleAI — back to chat */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 px-3 h-9 rounded-2xl transition-all active:scale-90"
                    style={{
                        background: 'rgba(212,120,138,0.08)',
                    }}
                >
                    <span
                        className="text-[15px] font-bold tracking-tight"
                        style={{ color: '#D4788A' }}
                    >
                        ⚡ElleAI
                    </span>
                </button>

                {/* Page title */}
                <span
                    className="text-[15px] font-bold tracking-tight"
                    style={{ color: '#1C1410' }}
                >
                    Pro
                </span>

                {/* Spacer placeholder to balance layout */}
                <div className="w-[72px]" />
            </header>

            {/* ── Main Content (placeholder) ───────────────────────── */}
            <main className="flex-1 overflow-y-auto flex items-center justify-center">
                <div className="text-center space-y-3 px-8">
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-3xl"
                        style={{ background: 'linear-gradient(135deg, rgba(212,120,138,0.15), rgba(201,149,92,0.15))', border: '1px solid rgba(212,120,138,0.2)' }}
                    >
                        🚀
                    </div>
                    <p className="text-[20px] font-bold" style={{ color: '#1C1410' }}>
                        Pro is coming soon
                    </p>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: '#9B8D87' }}>
                        Unlock advanced features, priority generation, and exclusive models.
                    </p>
                </div>
            </main>

            {/* ── Bottom Navigation ────────────────────────────────── */}
            <nav
                className="shrink-0 safe-bottom"
                style={{
                    background: 'rgba(245,239,233,0.95)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderTop: '1px solid rgba(212,120,138,0.1)',
                }}
            >
                <div className="flex items-end justify-around px-4 pt-2 pb-3 max-w-lg mx-auto">

                    {/* Home */}
                    <NavItem
                        icon={<Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />}
                        label="Home"
                        active={activeTab === 'home'}
                        onClick={() => setActiveTab('home')}
                    />

                    {/* Explore */}
                    <NavItem
                        icon={<Compass size={22} strokeWidth={activeTab === 'explore' ? 2.5 : 1.8} />}
                        label="Explore"
                        active={activeTab === 'explore'}
                        onClick={() => setActiveTab('explore')}
                    />

                    {/* Create — center, larger white circle */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className="flex flex-col items-center -mt-5 transition-all active:scale-90"
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                            style={{
                                background: activeTab === 'create'
                                    ? 'linear-gradient(135deg, #D4788A 0%, #A84D60 100%)'
                                    : '#FFFFFF',
                                boxShadow: activeTab === 'create'
                                    ? '0 6px 20px rgba(212,120,138,0.45)'
                                    : '0 4px 16px rgba(0,0,0,0.12)',
                                border: '3px solid rgba(245,239,233,0.9)',
                            }}
                        >
                            <Plus
                                size={26}
                                strokeWidth={2.5}
                                style={{ color: activeTab === 'create' ? '#FFFFFF' : '#D4788A' }}
                            />
                        </div>
                        <span
                            className="text-[10px] font-semibold mt-1"
                            style={{ color: activeTab === 'create' ? '#D4788A' : '#BFB0AB' }}
                        >
                            Create
                        </span>
                    </button>

                    {/* Assets */}
                    <NavItem
                        icon={<Image size={22} strokeWidth={activeTab === 'assets' ? 2.5 : 1.8} />}
                        label="Assets"
                        active={activeTab === 'assets'}
                        onClick={() => setActiveTab('assets')}
                    />

                    {/* Profile */}
                    <NavItem
                        icon={<User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />}
                        label="Profile"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />

                </div>
            </nav>
        </div>
    )
}

// ── Nav item helper ────────────────────────────────────────────────────────────

function NavItem({
    icon,
    label,
    active,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all active:scale-90"
        >
            <span style={{ color: active ? '#D4788A' : '#BFB0AB' }}>{icon}</span>
            <span
                className="text-[10px] font-semibold"
                style={{ color: active ? '#D4788A' : '#BFB0AB' }}
            >
                {label}
            </span>
        </button>
    )
}
