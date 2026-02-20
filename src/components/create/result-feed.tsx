'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/types/conversation'
import { Download, Share2, X, Maximize2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Media Lightbox ───────────────────────────────────────────────────────────

interface LightboxProps {
    message: ChatMessage
    onClose: () => void
    onDownload: (message: ChatMessage) => void
    onShare: (message: ChatMessage) => void
}

function MediaLightbox({ message, onClose, onDownload, onShare }: LightboxProps) {
    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    // Close on Escape key
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4"
            style={{ background: 'rgba(10, 6, 4, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
            onClick={handleBackdropClick}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-5 right-5 w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(8px)' }}
            >
                <X size={20} />
            </button>

            {/* Media */}
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative max-w-full max-h-[80vh] rounded-3xl overflow-hidden"
                style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {message.outputType === 'video' ? (
                    <video
                        src={message.outputUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="max-w-full max-h-[70vh] rounded-3xl"
                        style={{ background: '#000' }}
                    />
                ) : (
                    <img
                        src={message.outputUrl}
                        alt="Generated"
                        className="max-w-full max-h-[70vh] object-contain rounded-3xl"
                        style={{ background: '#111' }}
                    />
                )}
            </motion.div>

            {/* Action bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mt-5"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => onDownload(message)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #D4788A, #A84D60)',
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(212,120,138,0.4)',
                    }}
                >
                    <Download size={15} />
                    Save
                </button>
                <button
                    onClick={() => onShare(message)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all active:scale-95"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}
                >
                    <Share2 size={15} />
                    Share
                </button>
            </motion.div>

            {/* Generation metadata */}
            <p className="mt-3 text-[11px] font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {message.generationType?.replace(/-/g, ' ')}
                {message.processingTimeMs ? ` · ${(message.processingTimeMs / 1000).toFixed(1)}s` : ''}
            </p>
        </motion.div>
    )
}

// ─── Elle Loading Avatar ──────────────────────────────────────────────────────

function ElleLoadingBubble() {
    const [dots, setDots] = React.useState(0)

    React.useEffect(() => {
        const t = setInterval(() => setDots((d) => (d + 1) % 4), 480)
        return () => clearInterval(t)
    }, [])

    return (
        <div className="flex items-end gap-3 message-in origin-bottom-left">
            {/* Elle avatar with spinning ring */}
            <div className="relative flex items-center justify-center shrink-0" style={{ width: 40, height: 40 }}>
                {/* Spinning ring */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        inset: 0,
                        background: 'conic-gradient(from 0deg, #D4788A, #C9955C, #F5B8C4, #D4788A)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner background mask */}
                <div
                    className="absolute rounded-full"
                    style={{ inset: 3, background: '#FAF5F2' }}
                />
                {/* Logo */}
                <img
                    src="/assets/logos/logoElle.png"
                    alt="Elle"
                    className="relative z-10 rounded-full"
                    style={{ width: 28, height: 28, objectFit: 'contain', padding: 3, background: 'white' }}
                />
            </div>

            {/* Typing bubble */}
            <div
                className="px-5 py-3.5 rounded-[22px] rounded-bl-[6px] flex items-center gap-1.5"
                style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(212,120,138,0.15)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(212,120,138,0.08)',
                }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="rounded-full"
                        style={{ width: 6, height: 6, background: '#D4788A' }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.95, 1.05, 0.95]
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}
            </div>
        </div>
    )
}

// ─── Media Thumbnail ──────────────────────────────────────────────────────────

interface ThumbnailProps {
    message: ChatMessage
    onExpand: () => void
}

function MediaThumbnail({ message, onExpand }: ThumbnailProps) {
    const isVideo = message.outputType === 'video'

    return (
        <div className="flex items-end gap-3 message-in">
            {/* Elle avatar — static for completed messages */}
            <div
                className="shrink-0 rounded-full overflow-hidden flex items-center justify-center"
                style={{
                    width: 40,
                    height: 40,
                    background: 'white',
                    border: '1.5px solid rgba(212,120,138,0.2)',
                    padding: 4,
                    boxShadow: '0 2px 8px rgba(212,120,138,0.12)',
                }}
            >
                <img
                    src="/assets/logos/logoElle.png"
                    alt="Elle AI"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>

            {/* Compact thumbnail card */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={onExpand}
                    className="group relative rounded-[20px] rounded-bl-[6px] overflow-hidden transition-all active:scale-98"
                    style={{
                        width: 240,
                        height: 240,
                        border: '1.5px solid rgba(212,120,138,0.15)',
                        boxShadow: '0 4px 20px rgba(212,120,138,0.12), 0 1px 4px rgba(0,0,0,0.06)',
                        background: '#F0E8E2',
                    }}
                >
                    {isVideo ? (
                        <>
                            <video
                                src={message.outputUrl}
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            {/* Video play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                                >
                                    <div
                                        style={{
                                            width: 0, height: 0,
                                            borderTop: '8px solid transparent',
                                            borderBottom: '8px solid transparent',
                                            borderLeft: '14px solid #D4788A',
                                            marginLeft: 2,
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <img
                            src={message.outputUrl}
                            alt="Generated"
                            className="w-full h-full object-cover"
                        />
                    )}

                    {/* Expand hint — shows on hover */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: '#1C1410' }}
                        >
                            <Maximize2 size={13} />
                        </div>
                    </div>
                </button>

                {/* Metadata chip */}
                <div className="flex items-center gap-1.5 px-1">
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #D4788A, #C9955C)' }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#C9955C' }}>
                        {message.generationType?.replace(/-/g, ' ')}
                    </span>
                    {message.processingTimeMs && (
                        <>
                            <span style={{ color: '#BFB0AB', fontSize: '10px' }}>·</span>
                            <span className="text-[10px] font-light" style={{ color: '#BFB0AB' }}>
                                {(message.processingTimeMs / 1000).toFixed(1)}s
                            </span>
                        </>
                    )}
                    <span style={{ color: '#BFB0AB', fontSize: '10px' }}>·</span>
                    <span className="text-[10px] font-light" style={{ color: '#C9955C', opacity: 0.7 }}>
                        Tap to expand
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Result Feed ──────────────────────────────────────────────────────────────

interface ResultFeedProps {
    messages: ChatMessage[]
    onDownload: (message: ChatMessage) => void
    onShare: (message: ChatMessage) => void
}

export function ResultFeed({ messages, onDownload, onShare }: ResultFeedProps) {
    const bottomRef = React.useRef<HTMLDivElement>(null)
    const [lightboxMessage, setLightboxMessage] = React.useState<ChatMessage | null>(null)

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-48 space-y-4 scrollbar-hide">

                {/* Empty state */}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-6 px-8 pt-16 text-center">
                        <div className="relative">
                            <div
                                className="w-24 h-24 rounded-[32px] flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #F9E8EC 0%, #F5E0D0 100%)',
                                    border: '1.5px solid rgba(212,120,138,0.2)',
                                    boxShadow: '0 8px 32px rgba(212,120,138,0.15), 0 2px 8px rgba(0,0,0,0.04)',
                                }}
                            >
                                <Sparkles size={38} style={{ color: '#D4788A' }} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: '#C9955C', opacity: 0.6 }} />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full" style={{ background: '#D4788A', opacity: 0.4 }} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-[26px] font-black tracking-tight leading-tight" style={{ color: '#1C1410' }}>
                                Create anything.
                            </h2>
                            <p className="text-[15px] font-light leading-relaxed" style={{ color: '#8C7B76', maxWidth: '260px', margin: '0 auto' }}>
                                Type a prompt or attach an image to generate stunning visuals.
                            </p>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex flex-col space-y-2",
                            message.role === 'user' ? "items-end" : "items-start"
                        )}
                    >
                        {/* User bubble */}
                        {message.role === 'user' && (
                            <div className="max-w-[80%] space-y-2 text-right">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Uploaded"
                                        className="rounded-2xl border border-black/10 shadow-sm ml-auto message-in"
                                        style={{ width: 160, height: 160, objectFit: 'cover' }}
                                    />
                                )}
                                {message.content && (
                                    <div
                                        className="inline-block max-w-full px-4 py-3 rounded-[20px] rounded-tr-[6px] text-[15px] font-light whitespace-pre-wrap text-left message-in"
                                        style={{
                                            background: 'linear-gradient(135deg, #D4788A 0%, #A84D60 100%)',
                                            color: '#FFFFFF',
                                            boxShadow: '0 4px 16px rgba(212,120,138,0.3), 0 1px 4px rgba(0,0,0,0.08)',
                                        }}
                                    >
                                        {message.content}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* AI messages */}
                        {message.role === 'assistant' && (
                            <>
                                {/* Loading state — inline Elle avatar + typing dots */}
                                {message.status === 'loading' && <ElleLoadingBubble />}

                                {/* Error state */}
                                {message.status === 'error' && (
                                    <div
                                        className="flex items-end gap-3 message-in"
                                    >
                                        <div
                                            className="shrink-0 rounded-full overflow-hidden flex items-center justify-center"
                                            style={{ width: 40, height: 40, background: 'white', border: '1.5px solid rgba(212,120,138,0.2)', padding: 4 }}
                                        >
                                            <img src="/assets/logos/logoElle.png" alt="Elle AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div
                                            className="px-4 py-3 rounded-[20px] rounded-bl-[6px] text-[14px] font-light"
                                            style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
                                        >
                                            Something went wrong — please try again.
                                        </div>
                                    </div>
                                )}

                                {/* Success state — compact thumbnail */}
                                {message.status === 'success' && message.outputUrl && (
                                    <MediaThumbnail
                                        message={message}
                                        onExpand={() => setLightboxMessage(message)}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ))}

                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxMessage && (
                    <MediaLightbox
                        message={lightboxMessage}
                        onClose={() => setLightboxMessage(null)}
                        onDownload={(msg) => { onDownload(msg); }}
                        onShare={(msg) => { onShare(msg); }}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
