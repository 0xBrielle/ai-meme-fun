'use client'

import * as React from 'react'
import { Plus, Send, X, Image as ImageIcon, ChevronDown } from 'lucide-react'
import { GenerationType } from './generation-settings'
import { useImagePicker } from '@/hooks/use-image-picker'
import { cn } from '@/lib/utils'

interface ChatBarProps {
    onSend: (prompt: string, attachment: string | null) => void
    isLoading?: boolean
    placeholder?: string
    generationType: GenerationType
    onTypeChange: (type: GenerationType) => void
    duration: number
    onDurationChange: (duration: number) => void
}

export function ChatBar({
    onSend,
    isLoading,
    placeholder = "Describe what you want to create...",
    generationType,
    onTypeChange,
    duration,
    onDurationChange
}: ChatBarProps) {
    const [input, setInput] = React.useState('')
    const [attachment, setAttachment] = React.useState<string | null>(null)
    const { pickImage } = useImagePicker()

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if ((!input.trim() && !attachment) || isLoading) return

        onSend(input, attachment)
        setInput('')
        setAttachment(null)

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleAttach = async () => {
        try {
            const result = await pickImage()
            if (result) {
                setAttachment(result)
            }
        } catch (error) {
            console.error('Failed to pick image:', error)
        }
    }

    // Auto-resize textarea
    React.useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
        }
    }, [input])

    return (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-28 pt-4 z-50"
            style={{
                background: 'linear-gradient(to top, #F7F7F5 60%, transparent)',
            }}
        >
            <div className="max-w-3xl mx-auto space-y-2 text-left">
                {/* Attachment Preview (unchanged logic, updated style) */}
                {attachment && (
                    <div className="flex px-1 animate-in">
                        <div className="relative">
                            <img
                                src={attachment}
                                alt="Attachment"
                                className="w-14 h-14 object-cover rounded-2xl border border-black/10 shadow-sm"
                            />
                            <button
                                onClick={() => setAttachment(null)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow transition-transform active:scale-90"
                            >
                                <X size={11} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Main chat box — with clear visible border */}
                <form
                    onSubmit={handleSend}
                    style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1.5px solid rgba(0,0,0,0.12)',
                        borderRadius: '24px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                    }}
                >
                    {/* === TOP ROW: Generation type selector + duration === */}
                    <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-black/6">
                        {/* Type dropdown */}
                        <div className="relative">
                            <select
                                value={generationType}
                                onChange={(e) => onTypeChange(e.target.value as GenerationType)}
                                disabled={isLoading}
                                className="appearance-none pl-8 pr-7 py-1.5 text-[13px] font-medium text-[#1A1A1A] rounded-full cursor-pointer outline-none transition-all"
                                style={{
                                    background: '#F0F0EE',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                }}
                            >
                                <option value="text-to-image">Text to Image</option>
                                <option value="text-to-video">Text to Video</option>
                                <option value="image-to-video">Image to Video</option>
                                <option value="video-to-video">Video to Video</option>
                            </select>
                            <ImageIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
                        </div>

                        {/* Duration pills — only for video */}
                        {generationType.includes('video') && (
                            <div className="flex items-center gap-1 animate-scale">
                                {[3, 5, 10].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => onDurationChange(d)}
                                        className={cn(
                                            'px-2.5 py-1 text-[12px] rounded-full font-medium transition-all',
                                            duration === d
                                                ? 'bg-[#1A1A1A] text-white'
                                                : 'text-[#999] hover:text-[#1A1A1A]'
                                        )}
                                    >
                                        {d}s
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* === BOTTOM ROW: Attach + Textarea + Send === */}
                    <div className="flex items-end gap-2 px-2 py-2">
                        <button
                            type="button"
                            onClick={handleAttach}
                            disabled={isLoading}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[#999] hover:text-[#1A1A1A] hover:bg-black/5 transition-colors"
                        >
                            <Plus size={20} />
                        </button>

                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="flex-1 bg-transparent border-none focus:ring-0 py-2 px-1 resize-none text-[15px] max-h-[120px] scrollbar-hide text-[#1A1A1A] placeholder:text-[#BBBBBB] font-light"
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            disabled={(!input.trim() && !attachment) || isLoading}
                            className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95',
                                (input.trim() || attachment)
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'bg-[#F0F0EE] text-[#BBBBBB]'
                            )}
                        >
                            <Send size={16} fill="currentColor" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
