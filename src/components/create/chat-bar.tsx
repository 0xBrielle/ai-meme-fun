'use client'

import * as React from 'react'
import { Plus, Send, X, Image as ImageIcon, Video, ChevronDown, Sparkles } from 'lucide-react'
import { useImagePicker } from '@/hooks/use-image-picker'
import { GenerationType } from '@/types/conversation'
import { cn } from '@/lib/utils'

interface ChatBarProps {
    onSend: (prompt: string, attachment: string | null, type: GenerationType, duration: number) => void
    isLoading?: boolean
}

const TYPE_OPTIONS: { value: GenerationType; label: string; icon: any }[] = [
    { value: 'text-to-image', label: 'Text → Image', icon: ImageIcon },
    { value: 'image-to-image', label: 'Image → Image', icon: Sparkles },
    { value: 'text-to-video', label: 'Text → Video', icon: Video },
    { value: 'image-to-video', label: 'Image → Video', icon: Video },
    { value: 'video-to-video', label: 'Video → Video', icon: Video },
]

export function ChatBar({ onSend, isLoading }: ChatBarProps) {
    const [input, setInput] = React.useState('')
    const [attachment, setAttachment] = React.useState<string | null>(null)
    const [generationType, setGenerationType] = React.useState<GenerationType>('text-to-image')
    const [duration, setDuration] = React.useState(5)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const { pickImage } = useImagePicker()

    const isVideo = generationType.includes('video')

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if ((!input.trim() && !attachment) || isLoading) return
        onSend(input.trim(), attachment, generationType, duration)
        setInput('')
        setAttachment(null)
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
    }

    const handleAttach = async () => {
        try {
            const result = await pickImage()
            if (result) setAttachment(result)
        } catch (err) { console.error(err) }
    }

    React.useEffect(() => {
        const t = textareaRef.current
        if (t) { t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 120)}px` }
    }, [input])

    const canSend = (input.trim() || attachment) && !isLoading

    return (
        <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-8 safe-bottom"
            style={{ background: 'linear-gradient(to top, #FDF7F5 55%, transparent)' }}
        >
            <div className="max-w-2xl mx-auto space-y-2">

                {/* Attachment preview */}
                {attachment && (
                    <div className="flex px-1 animate-in">
                        <div className="relative">
                            <img
                                src={attachment}
                                alt="Attachment"
                                className="w-14 h-14 object-cover rounded-2xl shadow-sm"
                                style={{ border: '1.5px solid rgba(232,160,168,0.3)' }}
                            />
                            <button
                                onClick={() => setAttachment(null)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md"
                                style={{ background: '#E8A0A8' }}
                            >
                                <X size={11} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Chat input box */}
                <form
                    onSubmit={handleSend}
                    style={{
                        background: 'rgba(255,255,255,0.96)',
                        border: '1.5px solid rgba(232,160,168,0.35)',
                        borderRadius: '22px',
                        boxShadow: '0 4px 20px rgba(232,160,168,0.15), 0 1px 6px rgba(0,0,0,0.04)',
                    }}
                >
                    {/* TOP ROW — Type selector + Duration */}
                    <div
                        className="flex items-center gap-2 px-3 pt-3 pb-2.5"
                        style={{ borderBottom: '1px solid rgba(232,160,168,0.12)' }}
                    >
                        {/* Type dropdown */}
                        <div className="relative flex-shrink-0">
                            <select
                                value={generationType}
                                onChange={(e) => setGenerationType(e.target.value as GenerationType)}
                                disabled={isLoading}
                                className="appearance-none text-[12px] font-semibold pl-2.5 pr-7 py-1.5 rounded-xl cursor-pointer outline-none transition-all disabled:opacity-50"
                                style={{
                                    background: '#FBF0EE',
                                    border: '1px solid rgba(232,160,168,0.25)',
                                    color: '#C8707A',
                                }}
                            >
                                {TYPE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value} style={{ background: '#FFF', color: '#2D2426' }}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={12}
                                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: '#C8707A' }}
                            />
                        </div>

                        {/* Duration selector — only for video types */}
                        {isVideo && (
                            <div
                                className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl"
                                style={{ background: '#FBF0EE', border: '1px solid rgba(232,160,168,0.2)' }}
                            >
                                {[3, 5, 10].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDuration(d)}
                                        disabled={isLoading}
                                        className={cn(
                                            'px-2.5 py-0.5 text-[11px] font-semibold rounded-lg transition-all',
                                            duration === d
                                                ? 'text-white'
                                                : 'text-[#C4B0B3] hover:text-[#C8707A]'
                                        )}
                                        style={duration === d ? {
                                            background: 'linear-gradient(135deg, #E8A0A8, #D4757F)',
                                        } : {}}
                                    >
                                        {d}s
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* BOTTOM ROW — Attach + Textarea + Send */}
                    <div className="flex items-end gap-1.5 px-2 py-2">
                        <button
                            type="button"
                            onClick={handleAttach}
                            disabled={isLoading}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
                            style={{ color: '#C4B0B3' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#E8A0A8')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#C4B0B3')}
                        >
                            <Plus size={21} strokeWidth={2} />
                        </button>

                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe what you want to create..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2 px-1 resize-none text-[15px] max-h-[120px] scrollbar-hide font-light text-[#2D2426]"
                        />

                        <button
                            type="submit"
                            disabled={!canSend}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
                            style={canSend ? {
                                background: 'linear-gradient(135deg, #E8A0A8, #D4757F)',
                                boxShadow: '0 2px 8px rgba(232,160,168,0.5)',
                                color: 'white',
                            } : {
                                background: '#F5E8E4',
                                color: '#C4B0B3',
                            }}
                        >
                            <Send size={16} fill="currentColor" />
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
