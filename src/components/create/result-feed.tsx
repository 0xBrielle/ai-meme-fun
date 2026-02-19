'use client'

import * as React from 'react'
import { ChatMessage, GenerationType } from '@/types/conversation'
import { Download, Share2, Play, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResultFeedProps {
    messages: ChatMessage[]
    onDownload: (message: ChatMessage) => void
    onShare: (message: ChatMessage) => void
}

export function ResultFeed({ messages, onDownload, onShare }: ResultFeedProps) {
    const bottomRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-48 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center gap-6 px-8 pt-16 text-center">
                    {/* Large decorative mark */}
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
                        {/* Floating dot accents */}
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

            {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "flex flex-col space-y-2",
                        message.role === 'user' ? "items-end" : "items-start"
                    )}
                >
                    {/* User Prompt Bubble */}
                    {message.role === 'user' && (
                        <div className="max-w-[85%] space-y-2 text-right">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Uploaded"
                                    className="rounded-2xl border border-black/10 w-48 h-auto shadow-sm ml-auto message-in"
                                />
                            )}
                            {message.content && (
                                <div
                                    className="max-w-full px-4 py-3 rounded-[20px] rounded-tr-[6px] text-[15px] font-light whitespace-pre-wrap text-left message-in"
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

                    {/* AI Assistant Output */}
                    {message.role === 'assistant' && (
                        <div className="max-w-[92%] w-full space-y-3">
                            {message.status === 'loading' && (
                                <div
                                    className="shimmer rounded-[24px] rounded-tl-[6px] px-6 py-10 flex flex-col items-center gap-3 message-in"
                                    style={{
                                        border: '1.5px solid rgba(212,120,138,0.15)',
                                        background: 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full animate-bounce"
                                                style={{
                                                    background: `linear-gradient(135deg, #D4788A, #C9955C)`,
                                                    animationDelay: `${i * 0.18}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[12px] uppercase tracking-[0.15em] font-semibold" style={{ color: '#BFB0AB' }}>
                                        Generating
                                    </p>
                                </div>
                            )}

                            {message.status === 'error' && (
                                <div className="bg-red-50 border border-red-100 rounded-[20px] rounded-tl-[6px] px-4 py-3 text-red-500 text-[14px] font-light message-in">
                                    Oops! Something went wrong. Please try again.
                                </div>
                            )}

                            {message.outputUrl && (
                                <div className="group relative w-full message-in">
                                    <div className="card-output shadow-lg">
                                        {message.outputType === 'video' ? (
                                            <video
                                                src={message.outputUrl}
                                                controls
                                                className="w-full h-auto"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={message.outputUrl}
                                                alt="Generated"
                                                className="w-full h-auto object-contain bg-black/5"
                                            />
                                        )}

                                        {/* Actions — always visible on mobile, hover on desktop */}
                                        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            <button
                                                onClick={() => onDownload(message)}
                                                className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    backdropFilter: 'blur(12px)',
                                                    border: '1px solid rgba(0,0,0,0.06)',
                                                    color: '#1C1410',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={() => onShare(message)}
                                                className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    backdropFilter: 'blur(12px)',
                                                    border: '1px solid rgba(0,0,0,0.06)',
                                                    color: '#1C1410',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Metadata chip — gold accent */}
                                    <div className="mt-2.5 flex items-center gap-1.5 px-1">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ background: 'linear-gradient(135deg, #D4788A, #C9955C)' }}
                                        />
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-[0.18em]"
                                            style={{ color: '#C9955C' }}
                                        >
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
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div ref={bottomRef} className="h-4" />
        </div>
    )
}
