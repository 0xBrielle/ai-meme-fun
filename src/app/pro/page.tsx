'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Home, Compass, Plus, Image, User } from 'lucide-react'

// ── Pro page color tokens (pastel blue) ───────────────────────────────────────
const PRO = {
    bg: '#EFF6FF',
    headerBg: 'rgba(239,246,255,0.92)',
    navBg: 'rgba(239,246,255,0.97)',
    border: 'rgba(96,165,250,0.15)',
    borderStrong: 'rgba(96,165,250,0.28)',
    accent: '#5B8CE8',
    accentDim: '#9EB8D4',
    accentGrad: 'linear-gradient(135deg, #5B8CE8 0%, #3B6FD4 100%)',
    accentShadow: '0 6px 20px rgba(91,140,232,0.38)',
    cardBg: 'linear-gradient(135deg, rgba(96,165,250,0.10), rgba(147,197,253,0.10))',
    text: '#1A2540',
    textSub: '#7A98BE',
}

type ProTab = 'home' | 'explore' | 'create' | 'assets' | 'profile'

export default function ProPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState<ProTab>('home')

    return (
        <div
            className="flex flex-col h-screen w-screen overflow-hidden"
            style={{ background: PRO.bg }}
        >
            {/* ── Top Bar ─────────────────────────────────────────── */}
            <header
                className="flex items-center justify-between px-5 h-14 shrink-0 safe-top z-30"
                style={{
                    background: PRO.headerBg,
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: `1px solid ${PRO.border}`,
                }}
            >
                {/* "Try ⚡Elle" — back to chat, subtle pastel pink pill */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 px-3 h-9 rounded-2xl transition-all active:scale-90"
                    style={{
                        background: 'rgba(236,214,222,0.45)',
                        border: '1px solid rgba(212,120,138,0.18)',
                    }}
                >
                    <span className="text-[13px] font-semibold" style={{ color: '#C4607A' }}>
                        Try ⚡Elle
                    </span>
                </button>

                {/* Pro logo — same size as main page Elle logo */}
                <img
                    src="/assets/logos/logoPro.png"
                    alt="Pro"
                    className="h-[42px] w-auto object-contain"
                    style={{ maxWidth: '144px' }}
                />

                {/* Spacer to balance layout */}
                <div className="w-[88px]" />
            </header>

            {/* ── Main Content (placeholder) ───────────────────────── */}
            <main className="flex-1 overflow-y-auto flex items-center justify-center">
                <div className="text-center space-y-3 px-8">
                    <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
                        style={{
                            background: PRO.cardBg,
                            border: `1px solid ${PRO.borderStrong}`,
                            boxShadow: '0 8px 32px rgba(91,140,232,0.12)',
                        }}
                    >
                        <img
                            src="/assets/logos/logoPro.png"
                            alt="Pro"
                            className="w-14 h-auto object-contain"
                        />
                    </div>
                    <p className="text-[20px] font-bold" style={{ color: PRO.text }}>
                        Pro is coming soon
                    </p>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: PRO.textSub }}>
                        Unlock advanced features, priority generation, and exclusive models.
                    </p>
                </div>
            </main>

            {/* ── Bottom Navigation ────────────────────────────────── */}
            <nav
                className="shrink-0 safe-bottom"
                style={{
                    background: PRO.navBg,
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderTop: `1px solid ${PRO.border}`,
                }}
            >
                <div className="flex items-end justify-around px-4 pt-2 pb-3 max-w-lg mx-auto">

                    {/* Home */}
                    <NavItem
                        icon={<Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />}
                        label="Home"
                        active={activeTab === 'home'}
                        activeColor={PRO.accent}
                        inactiveColor={PRO.accentDim}
                        onClick={() => setActiveTab('home')}
                    />

                    {/* Explore */}
                    <NavItem
                        icon={<Compass size={22} strokeWidth={activeTab === 'explore' ? 2.5 : 1.8} />}
                        label="Explore"
                        active={activeTab === 'explore'}
                        activeColor={PRO.accent}
                        inactiveColor={PRO.accentDim}
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
                                background: activeTab === 'create' ? PRO.accentGrad : '#FFFFFF',
                                boxShadow: activeTab === 'create'
                                    ? PRO.accentShadow
                                    : '0 4px 16px rgba(0,0,0,0.12)',
                                border: `3px solid rgba(239,246,255,0.9)`,
                            }}
                        >
                            <Plus
                                size={26}
                                strokeWidth={2.5}
                                style={{ color: activeTab === 'create' ? '#FFFFFF' : PRO.accent }}
                            />
                        </div>
                        <span
                            className="text-[10px] font-semibold mt-1"
                            style={{ color: activeTab === 'create' ? PRO.accent : PRO.accentDim }}
                        >
                            Create
                        </span>
                    </button>

                    {/* Assets */}
                    <NavItem
                        icon={<Image size={22} strokeWidth={activeTab === 'assets' ? 2.5 : 1.8} />}
                        label="Assets"
                        active={activeTab === 'assets'}
                        activeColor={PRO.accent}
                        inactiveColor={PRO.accentDim}
                        onClick={() => setActiveTab('assets')}
                    />

                    {/* Profile */}
                    <NavItem
                        icon={<User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />}
                        label="Profile"
                        active={activeTab === 'profile'}
                        activeColor={PRO.accent}
                        inactiveColor={PRO.accentDim}
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
    activeColor,
    inactiveColor,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    active: boolean
    activeColor: string
    inactiveColor: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all active:scale-90"
        >
            <span style={{ color: active ? activeColor : inactiveColor }}>{icon}</span>
            <span
                className="text-[10px] font-semibold"
                style={{ color: active ? activeColor : inactiveColor }}
            >
                {label}
            </span>
        </button>
    )
}
