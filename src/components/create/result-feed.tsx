'use client'

import * as React from 'react'
import { Generation } from '@/types'
import { Loader2, Download, Share2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content?: string
    image?: string
    generation?: Generation
    status?: 'loading' | 'error' | 'success'
}

interface ResultFeedProps {
    messages: Message[]
    onDownload: (generation: Generation) => void
    onShare: (generation: Generation) => void
}

export function ResultFeed({ messages, onDownload, onShare }: ResultFeedProps) {
    const bottomRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-48 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
                    <div className="w-16 h-16 rounded-full bg-white border border-black/5 flex items-center justify-center text-black/10">
                        <Play size={32} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-medium text-[#1A1A1A]">Ready to create?</h2>
                        <p className="text-[#999] font-light px-10">Describe what you want to see, or attach an image to get started.</p>
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
                                <div className="bg-[#1A1A1A] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[15px] font-light whitespace-pre-wrap">
                                    {message.content}
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Assistant Output */}
                    {message.role === 'assistant' && (
                        <div className="max-w-[90%] w-full space-y-3">
                            {message.status === 'loading' && (
                                <div className="bg-white border border-black/5 rounded-2xl rounded-tl-sm px-5 py-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
                                    <Loader2 className="animate-spin text-black/20" size={24} />
                                    <p className="text-sm font-light text-black/20 italic">Generating your masterpiece...</p>
                                </div>
                            )}

                            {message.status === 'error' && (
                                <div className="bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-4 py-3 text-red-500 text-sm font-light">
                                    Failed to generate. Please try again.
                                </div>
                            )}

                            {message.generation && (
                                <div className="group relative">
                                    <div className="bg-white rounded-3xl overflow-hidden border border-black/10 shadow-lg animate-scale">
                                        <img
                                            src={message.generation.outputUrl}
                                            alt="Generated"
                                            className="w-full h-auto object-contain bg-black/5"
                                        />

                                        {/* Actions Overlay */}
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onDownload(message.generation!)}
                                                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm border border-black/5 flex items-center justify-center text-[#1A1A1A]"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => onShare(message.generation!)}
                                                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm border border-black/5 flex items-center justify-center text-[#1A1A1A]"
                                            >
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtitle / Metadata */}
                                    <div className="mt-2 text-[11px] text-[#999] uppercase tracking-widest font-semibold px-2">
                                        FAL.AI • FLUX SCHNELL • {message.generation.processingTimeMs}MS
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
