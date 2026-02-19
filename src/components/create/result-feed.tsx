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
                <div className="h-full flex flex-col items-center justify-center gap-4 px-8 pt-20 text-center">
                    <div className="w-20 h-20 rounded-[28px] flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #FBF0EE, #F5E8E4)',
                            border: '1.5px solid rgba(232, 160, 168, 0.2)',
                        }}
                    >
                        <Sparkles size={32} style={{ color: '#E8A0A8' }} />
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-[22px] font-semibold" style={{ color: '#2D2426' }}>
                            What will you create?
                        </h2>
                        <p className="text-[15px] font-light leading-relaxed" style={{ color: '#9B8A8D' }}>
                            Type a prompt or attach an image below to get started.
                        </p>
                    </div>
                </div>
            )}

            {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "flex flex-col space-y-2 animate-in",
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
                                    className="rounded-2xl border border-black/10 w-48 h-auto shadow-sm ml-auto"
                                />
                            )}
                            {message.content && (
                                <div
                                    className="max-w-full px-4 py-3 rounded-[20px] rounded-tr-[6px] text-[15px] font-light whitespace-pre-wrap text-white text-left"
                                    style={{
                                        background: 'linear-gradient(135deg, #E8A0A8 0%, #D4757F 100%)',
                                        boxShadow: '0 2px 12px rgba(232, 160, 168, 0.3)',
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
                                    className="px-6 py-8 rounded-[24px] rounded-tl-[6px] flex flex-col items-center gap-3"
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(232, 160, 168, 0.15)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                    }}
                                >
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i}
                                                className="w-2.5 h-2.5 rounded-full animate-bounce"
                                                style={{
                                                    background: '#E8A0A8',
                                                    animationDelay: `${i * 0.15}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[13px] font-light" style={{ color: '#C4B0B3' }}>
                                        Creating your masterpiece…
                                    </p>
                                </div>
                            )}

                            {message.status === 'error' && (
                                <div className="bg-red-50 border border-red-100 rounded-[20px] rounded-tl-[6px] px-4 py-3 text-red-500 text-[14px] font-light">
                                    Oops! Something went wrong. Please try again.
                                </div>
                            )}

                            {message.outputUrl && (
                                <div className="group relative w-full">
                                    <div
                                        className="rounded-[24px] overflow-hidden"
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid rgba(232, 160, 168, 0.2)',
                                            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)',
                                        }}
                                    >
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

                                        {/* Actions Overlay */}
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onDownload(message)}
                                                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm border border-black/5 flex items-center justify-center text-[#2D2426] hover:bg-white transition-colors"
                                            >
                                                <Download size={17} />
                                            </button>
                                            <button
                                                onClick={() => onShare(message)}
                                                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm border border-black/5 flex items-center justify-center text-[#2D2426] hover:bg-white transition-colors"
                                            >
                                                <Share2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtitle / Metadata */}
                                    <div className="mt-2 text-[10px] text-[#C4B0B3] uppercase tracking-[0.15em] font-bold px-3">
                                        {message.generationType?.replace(/-/g, ' ')} • {message.processingTimeMs}MS
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
