'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
    Home, Compass, Plus, Image, User,
    Heart, Share2, MoreVertical, ChevronRight,
    Video, Camera,
} from 'lucide-react'

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

// ── Placeholder data — TODO: replace with Supabase queries ───────────────────

const HERO_SLIDES = [
    {
        id: '1',
        title: 'Christmas Magic',
        subtitle: 'Transform your photo into a magical Christmas scene',
        gradient: 'linear-gradient(160deg, #1a3a5c 0%, #2d6a9f 50%, #c0392b 100%)',
    },
    {
        id: '2',
        title: 'Cinematic Portrait',
        subtitle: 'Turn a selfie into a Hollywood-style cinematic shot',
        gradient: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
        id: '3',
        title: 'Fantasy Warrior',
        subtitle: 'Step into an epic fantasy world as your character',
        gradient: 'linear-gradient(160deg, #2c1654 0%, #4a1942 50%, #8b0000 100%)',
    },
    {
        id: '4',
        title: 'Neon City Night',
        subtitle: 'See yourself in a glowing cyberpunk cityscape',
        gradient: 'linear-gradient(160deg, #0d0221 0%, #190641 50%, #6a0572 100%)',
    },
]

interface TemplateItem {
    id: string
    title: string
    gradient: string
    tag?: string
}

interface Category {
    id: string
    label: string
    items: TemplateItem[]
}

const CATEGORIES: Category[] = [
    {
        id: 'trends',
        label: 'Trends',
        items: [
            { id: 't1', title: 'Viral Dance', gradient: 'linear-gradient(160deg,#667eea,#764ba2)', tag: '🔥' },
            { id: 't2', title: 'Time Warp', gradient: 'linear-gradient(160deg,#f093fb,#f5576c)', tag: '🔥' },
            { id: 't3', title: 'Glow Up', gradient: 'linear-gradient(160deg,#4facfe,#00f2fe)' },
            { id: 't4', title: 'Mirror Effect', gradient: 'linear-gradient(160deg,#43e97b,#38f9d7)' },
            { id: 't5', title: 'Silhouette Beat', gradient: 'linear-gradient(160deg,#fa709a,#fee140)' },
        ],
    },
    {
        id: 'seasonal',
        label: 'Seasonal',
        items: [
            { id: 's1', title: 'Winter Wonderland', gradient: 'linear-gradient(160deg,#a1c4fd,#c2e9fb)' },
            { id: 's2', title: 'Spring Bloom', gradient: 'linear-gradient(160deg,#d4fc79,#96e6a1)' },
            { id: 's3', title: 'Summer Vibes', gradient: 'linear-gradient(160deg,#f7971e,#ffd200)' },
            { id: 's4', title: 'Autumn Leaves', gradient: 'linear-gradient(160deg,#eb3349,#f45c43)' },
            { id: 's5', title: 'New Year Sparks', gradient: 'linear-gradient(160deg,#1a1a2e,#e94560)' },
        ],
    },
    {
        id: 'romance',
        label: 'Romance',
        items: [
            { id: 'r1', title: 'Rose Garden', gradient: 'linear-gradient(160deg,#ff9a9e,#fecfef)' },
            { id: 'r2', title: 'Sunset Kiss', gradient: 'linear-gradient(160deg,#f6d365,#fda085)' },
            { id: 'r3', title: 'Candlelight', gradient: 'linear-gradient(160deg,#a18cd1,#fbc2eb)' },
            { id: 'r4', title: 'Paris Dreams', gradient: 'linear-gradient(160deg,#89f7fe,#66a6ff)' },
            { id: 'r5', title: 'Love Letter', gradient: 'linear-gradient(160deg,#fddb92,#d1fdff)' },
        ],
    },
    {
        id: 'transformation',
        label: 'Transformation & Recovery',
        items: [
            { id: 'tr1', title: 'Glow Up Journey', gradient: 'linear-gradient(160deg,#30cfd0,#330867)' },
            { id: 'tr2', title: 'Power Up', gradient: 'linear-gradient(160deg,#f83600,#f9d423)' },
            { id: 'tr3', title: 'New Chapter', gradient: 'linear-gradient(160deg,#0ba360,#3cba92)' },
            { id: 'tr4', title: 'Rise & Shine', gradient: 'linear-gradient(160deg,#fc5c7d,#6a82fb)' },
            { id: 'tr5', title: 'Stronger', gradient: 'linear-gradient(160deg,#2b5876,#4e4376)' },
        ],
    },
    {
        id: 'fashion',
        label: 'Fashion',
        items: [
            { id: 'f1', title: 'Runway Walk', gradient: 'linear-gradient(160deg,#1c1c1c,#4a4a4a)' },
            { id: 'f2', title: 'Vogue Cover', gradient: 'linear-gradient(160deg,#bdc3c7,#2c3e50)' },
            { id: 'f3', title: 'Streetwear', gradient: 'linear-gradient(160deg,#e96c1c,#1a1a2e)' },
            { id: 'f4', title: 'Haute Couture', gradient: 'linear-gradient(160deg,#d4a054,#1a0a00)' },
            { id: 'f5', title: 'Y2K Aesthetic', gradient: 'linear-gradient(160deg,#ff6ec7,#a855f7)' },
        ],
    },
    {
        id: 'fantasy',
        label: 'Fantasy & Anime',
        items: [
            { id: 'fa1', title: 'Anime Hero', gradient: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)' },
            { id: 'fa2', title: 'Dragon Realm', gradient: 'linear-gradient(160deg,#200122,#6f0000)' },
            { id: 'fa3', title: 'Fairy Light', gradient: 'linear-gradient(160deg,#a18cd1,#fbc2eb)' },
            { id: 'fa4', title: 'Cyberpunk', gradient: 'linear-gradient(160deg,#0d0221,#6a0572)' },
            { id: 'fa5', title: 'Spirit Forest', gradient: 'linear-gradient(160deg,#134e5e,#71b280)' },
        ],
    },
]

// TODO: replace with Supabase query to fetch recent public generations
const EXPLORE_FEED = [
    {
        id: 'e1',
        username: '@aurora.creates',
        prompt: 'Dancing in the rain, cinematic style, slow motion petals',
        likes: 1243,
        gradient: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
        avatarGrad: 'linear-gradient(135deg,#667eea,#764ba2)',
    },
    {
        id: 'e2',
        username: '@motion.kai',
        prompt: 'Fantasy warrior transformation, epic fantasy world',
        likes: 876,
        gradient: 'linear-gradient(160deg,#2c1654 0%,#4a1942 50%,#8b0000 100%)',
        avatarGrad: 'linear-gradient(135deg,#f093fb,#f5576c)',
    },
    {
        id: 'e3',
        username: '@neon.dreamer',
        prompt: 'Cyberpunk city street, neon reflections, rain puddles',
        likes: 2108,
        gradient: 'linear-gradient(160deg,#0d0221 0%,#190641 50%,#6a0572 100%)',
        avatarGrad: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    },
    {
        id: 'e4',
        username: '@spring.yuki',
        prompt: 'Cherry blossom walk, soft bokeh, Studio Ghibli feel',
        likes: 3401,
        gradient: 'linear-gradient(160deg,#a1c4fd 0%,#c2e9fb 100%)',
        avatarGrad: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    },
    {
        id: 'e5',
        username: '@stellar.ai',
        prompt: 'Runway fashion walk, Vogue magazine aesthetic, dramatic lighting',
        likes: 659,
        gradient: 'linear-gradient(160deg,#1c1c1c 0%,#4a4a4a 100%)',
        avatarGrad: 'linear-gradient(135deg,#fa709a,#fee140)',
    },
]

// ── Types ─────────────────────────────────────────────────────────────────────
type ProTab = 'home' | 'explore' | 'create' | 'assets' | 'profile'

// ─────────────────────────────────────────────────────────────────────────────
// HOME TAB
// ─────────────────────────────────────────────────────────────────────────────

function HomeTab() {
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [heroVisible, setHeroVisible] = React.useState(true)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Auto-advance slideshow every 4 s
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    // Collapse hero when user scrolls > 10 px
    const handleScroll = () => {
        if (scrollRef.current) {
            setHeroVisible(scrollRef.current.scrollTop < 10)
        }
    }

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto scrollbar-hide"
            style={{ background: PRO.bg }}
        >
            {/* ── Hero block — collapses on scroll ─────────────────── */}
            <div
                className="overflow-hidden"
                style={{
                    maxHeight: heroVisible ? '520px' : '0px',
                    opacity: heroVisible ? 1 : 0,
                    transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
                }}
            >
                {/* Slideshow */}
                <div className="relative mx-4 mt-4 rounded-3xl overflow-hidden" style={{ height: 320 }}>
                    {HERO_SLIDES.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{
                                background: slide.gradient,
                                opacity: idx === currentSlide ? 1 : 0,
                            }}
                        >
                            {/* Dark gradient overlay for text legibility */}
                            <div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }}
                            />

                            {/* Text — bottom left */}
                            <div className="absolute bottom-12 left-5 right-24 space-y-1">
                                <p className="text-white text-[18px] font-bold leading-snug drop-shadow-lg">
                                    {slide.title}
                                </p>
                                <p className="text-white/75 text-[12px] font-light leading-snug">
                                    {slide.subtitle}
                                </p>
                            </div>

                            {/* Try It — bottom right */}
                            <button
                                className="absolute bottom-12 right-4 px-4 py-2 rounded-full text-[13px] font-bold transition-all active:scale-95"
                                style={{
                                    background: 'rgba(255,255,255,0.92)',
                                    color: '#1A2540',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                                }}
                            >
                                Try It
                            </button>
                        </div>
                    ))}

                    {/* Dot indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                        {HERO_SLIDES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className="rounded-full transition-all"
                                style={{
                                    width: idx === currentSlide ? 18 : 6,
                                    height: 6,
                                    background: idx === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick-action buttons: Text to Video / Photo to Video */}
                <div className="flex gap-3 mx-4 mt-3 pb-1">
                    <QuickActionButton
                        icon={<Video size={18} strokeWidth={2} />}
                        label="Text to Video"
                    />
                    <QuickActionButton
                        icon={<Camera size={18} strokeWidth={2} />}
                        label="Photo to Video"
                    />
                </div>
            </div>

            {/* ── Category rows ─────────────────────────────────────── */}
            <div className="pb-6 pt-2 space-y-6">
                {CATEGORIES.map((cat) => (
                    <CategoryRow key={cat.id} category={cat} />
                ))}
            </div>
        </div>
    )
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all active:scale-95"
            style={{
                background: 'linear-gradient(135deg, rgba(27,46,92,0.85), rgba(30,58,138,0.9))',
                border: '1px solid rgba(96,165,250,0.25)',
                boxShadow: '0 2px 12px rgba(59,106,212,0.2)',
                color: '#FFFFFF',
            }}
        >
            <span style={{ color: '#93C5FD' }}>{icon}</span>
            <span className="text-[13px] font-semibold text-white">{label}</span>
        </button>
    )
}

function CategoryRow({ category }: { category: Category }) {
    return (
        <div>
            {/* Row header */}
            <div className="flex items-center justify-between px-4 mb-3">
                <span className="text-[15px] font-bold" style={{ color: PRO.text }}>
                    {category.label}
                </span>
                <button className="flex items-center gap-0.5 text-[12px] font-semibold" style={{ color: PRO.accent }}>
                    View all <ChevronRight size={13} strokeWidth={2.5} />
                </button>
            </div>

            {/* Horizontal scroll */}
            <div
                className="flex gap-3 overflow-x-auto scrollbar-hide px-4"
                style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
                {category.items.map((item) => (
                    <TemplateCard key={item.id} item={item} />
                ))}
                {/* Trailing spacer */}
                <div className="w-1 shrink-0" />
            </div>
        </div>
    )
}

function TemplateCard({ item }: { item: TemplateItem }) {
    return (
        <div
            className="relative shrink-0 rounded-2xl overflow-hidden"
            style={{ width: 120, height: 168 }}
        >
            {/* Gradient placeholder background */}
            <div className="absolute inset-0" style={{ background: item.gradient }} />

            {/* Dark overlay for text */}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }}
            />

            {/* Tag badge */}
            {item.tag && (
                <div
                    className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                    {item.tag} Trending
                </div>
            )}

            {/* Title */}
            <p
                className="absolute bottom-3 left-3 right-3 text-white text-[12px] font-semibold leading-snug"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
            >
                {item.title}
            </p>

            {/* Try It micro-button */}
            <button
                className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'rgba(255,255,255,0.88)', color: '#1A2540' }}
            >
                Try
            </button>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPLORE TAB — TikTok-style vertical snap feed
// ─────────────────────────────────────────────────────────────────────────────

function ExploreTab() {
    const [feedTab, setFeedTab] = React.useState<'foryou' | 'following'>('foryou')
    const [likedIds, setLikedIds] = React.useState<Set<string>>(new Set())

    const toggleLike = (id: string) => {
        setLikedIds((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className="relative h-full overflow-hidden" style={{ background: '#0a0a0a' }}>

            {/* For You / Following — floating pill at top */}
            <div className="absolute top-3 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div
                    className="flex pointer-events-auto rounded-full p-1"
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                    }}
                >
                    {(['foryou', 'following'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFeedTab(tab)}
                            className="px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all"
                            style={{
                                background: feedTab === tab ? 'rgba(255,255,255,0.9)' : 'transparent',
                                color: feedTab === tab ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                            }}
                        >
                            {tab === 'foryou' ? 'For You' : 'Following'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vertical snap scroll feed */}
            <div
                className="h-full overflow-y-auto scrollbar-hide"
                style={{
                    scrollSnapType: 'y mandatory',
                    WebkitOverflowScrolling: 'touch',
                } as React.CSSProperties}
            >
                {EXPLORE_FEED.map((item) => (
                    <ExploreCard
                        key={item.id}
                        item={item}
                        liked={likedIds.has(item.id)}
                        onLike={() => toggleLike(item.id)}
                    />
                ))}
            </div>
        </div>
    )
}

function ExploreCard({
    item,
    liked,
    onLike,
}: {
    item: typeof EXPLORE_FEED[number]
    liked: boolean
    onLike: () => void
}) {
    return (
        <div
            className="relative w-full shrink-0"
            style={{
                height: '100%',
                minHeight: '100%',
                scrollSnapAlign: 'start',
                background: item.gradient,
            }}
        >
            {/* Subtle film-grain overlay for depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}
            />

            {/* Right action column */}
            <div className="absolute right-4 bottom-28 flex flex-col items-center gap-5 z-10">
                {/* Avatar */}
                <div className="relative">
                    <div
                        className="w-11 h-11 rounded-full"
                        style={{ background: item.avatarGrad, border: '2px solid white' }}
                    />
                    <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: PRO.accent, border: '1.5px solid white' }}
                    >
                        <Plus size={10} strokeWidth={3} color="white" />
                    </div>
                </div>

                {/* Heart */}
                <button
                    onClick={onLike}
                    className="flex flex-col items-center gap-1 transition-all active:scale-90"
                >
                    <Heart
                        size={28}
                        strokeWidth={2}
                        style={{
                            color: liked ? '#FF4D6D' : 'white',
                            fill: liked ? '#FF4D6D' : 'transparent',
                        }}
                    />
                    <span className="text-white text-[11px] font-semibold">
                        {(item.likes + (liked ? 1 : 0)).toLocaleString()}
                    </span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1 transition-all active:scale-90">
                    <Share2 size={26} strokeWidth={2} color="white" />
                    <span className="text-white text-[11px] font-semibold">Share</span>
                </button>

                {/* More */}
                <button className="transition-all active:scale-90">
                    <MoreVertical size={24} strokeWidth={2} color="white" />
                </button>
            </div>

            {/* Bottom info — username, label, prompt */}
            <div className="absolute bottom-20 left-4 right-20 z-10 space-y-1.5">
                <p className="text-white font-bold text-[14px]">{item.username}</p>
                <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(91,140,232,0.7)', backdropFilter: 'blur(4px)' }}
                >
                    <span className="text-white text-[10px] font-semibold">⚡ AI Video</span>
                </div>
                <p className="text-white/80 text-[13px] font-light leading-snug line-clamp-2">
                    {item.prompt}
                </p>
            </div>

            {/* Recreate button */}
            <div className="absolute bottom-6 left-4 right-4 z-10">
                <button
                    className="w-full py-3 rounded-2xl text-[14px] font-bold transition-all active:scale-95"
                    style={{
                        background: 'rgba(255,255,255,0.92)',
                        color: '#1A2540',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                >
                    ✨ Recreate
                </button>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER TABS (Assets, Profile, Create)
// ─────────────────────────────────────────────────────────────────────────────

function PlaceholderTab({ label }: { label: string }) {
    return (
        <div className="h-full flex items-center justify-center">
            <p className="text-[15px] font-semibold" style={{ color: PRO.accentDim }}>
                {label} — coming soon
            </p>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PRO PAGE
// ─────────────────────────────────────────────────────────────────────────────

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
                    background: activeTab === 'explore' ? 'transparent' : PRO.headerBg,
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: activeTab === 'explore' ? 'none' : `1px solid ${PRO.border}`,
                    position: activeTab === 'explore' ? 'absolute' : 'relative',
                    top: 0, left: 0, right: 0,
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

                {/* Pro logo */}
                <img
                    src="/assets/logos/logoPro.png"
                    alt="Pro"
                    className="h-[42px] w-auto object-contain"
                    style={{ maxWidth: '144px', opacity: activeTab === 'explore' ? 0 : 1, transition: 'opacity 0.2s' }}
                />

                {/* Spacer */}
                <div className="w-[88px]" />
            </header>

            {/* ── Content area ─────────────────────────────────────── */}
            <main
                className="flex-1 overflow-hidden relative"
                style={{ paddingTop: activeTab === 'explore' ? 56 : 0 }}
            >
                {activeTab === 'home' && <HomeTab />}
                {activeTab === 'explore' && <ExploreTab />}
                {activeTab === 'create' && <PlaceholderTab label="Create" />}
                {activeTab === 'assets' && <PlaceholderTab label="Assets" />}
                {activeTab === 'profile' && <PlaceholderTab label="Profile" />}
            </main>

            {/* ── Bottom Navigation ────────────────────────────────── */}
            <nav
                className="shrink-0 safe-bottom z-30"
                style={{
                    background: activeTab === 'explore'
                        ? 'rgba(10,10,10,0.75)'
                        : PRO.navBg,
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderTop: activeTab === 'explore'
                        ? '1px solid rgba(255,255,255,0.08)'
                        : `1px solid ${PRO.border}`,
                }}
            >
                <div className="flex items-end justify-around px-4 pt-2 pb-3 max-w-lg mx-auto">

                    <NavItem
                        icon={<Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />}
                        label="Home"
                        active={activeTab === 'home'}
                        activeColor={activeTab === 'explore' ? '#fff' : PRO.accent}
                        inactiveColor={activeTab === 'explore' ? 'rgba(255,255,255,0.4)' : PRO.accentDim}
                        onClick={() => setActiveTab('home')}
                    />

                    <NavItem
                        icon={<Compass size={22} strokeWidth={activeTab === 'explore' ? 2.5 : 1.8} />}
                        label="Explore"
                        active={activeTab === 'explore'}
                        activeColor={activeTab === 'explore' ? '#fff' : PRO.accent}
                        inactiveColor={activeTab === 'explore' ? 'rgba(255,255,255,0.4)' : PRO.accentDim}
                        onClick={() => setActiveTab('explore')}
                    />

                    {/* Create — center elevated */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className="flex flex-col items-center -mt-5 transition-all active:scale-90"
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                                background: activeTab === 'create' ? PRO.accentGrad : '#FFFFFF',
                                boxShadow: activeTab === 'create'
                                    ? PRO.accentShadow
                                    : '0 4px 16px rgba(0,0,0,0.14)',
                                border: `3px solid ${activeTab === 'explore' ? 'rgba(10,10,10,0.75)' : PRO.navBg}`,
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
                            style={{
                                color: activeTab === 'create'
                                    ? PRO.accent
                                    : (activeTab === 'explore' ? 'rgba(255,255,255,0.4)' : PRO.accentDim),
                            }}
                        >
                            Create
                        </span>
                    </button>

                    <NavItem
                        icon={<Image size={22} strokeWidth={activeTab === 'assets' ? 2.5 : 1.8} />}
                        label="Assets"
                        active={activeTab === 'assets'}
                        activeColor={activeTab === 'explore' ? '#fff' : PRO.accent}
                        inactiveColor={activeTab === 'explore' ? 'rgba(255,255,255,0.4)' : PRO.accentDim}
                        onClick={() => setActiveTab('assets')}
                    />

                    <NavItem
                        icon={<User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />}
                        label="Profile"
                        active={activeTab === 'profile'}
                        activeColor={activeTab === 'explore' ? '#fff' : PRO.accent}
                        inactiveColor={activeTab === 'explore' ? 'rgba(255,255,255,0.4)' : PRO.accentDim}
                        onClick={() => setActiveTab('profile')}
                    />

                </div>
            </nav >
        </div >
    )
}

// ── Nav item helper ────────────────────────────────────────────────────────────

function NavItem({
    icon, label, active, activeColor, inactiveColor, onClick,
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
            <span className="text-[10px] font-semibold" style={{ color: active ? activeColor : inactiveColor }}>
                {label}
            </span>
        </button>
    )
}
