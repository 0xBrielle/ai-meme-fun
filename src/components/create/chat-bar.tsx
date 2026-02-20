'use client'

import * as React from 'react'
import { Plus, Send, X, Image as ImageIcon, Video, ChevronDown, Sparkles } from 'lucide-react'
import { useImagePicker } from '@/hooks/use-image-picker'
import { GenerationType, AspectRatio, Resolution } from '@/types/conversation'
import { cn } from '@/lib/utils'

interface ChatBarProps {
    onSend: (
        prompt: string,
        attachment: string | null,
        type: GenerationType,
        duration: number,
        aspectRatio: AspectRatio,
        resolution: Resolution
    ) => void
    isLoading?: boolean
    lastGeneratedImageUrl?: string | null
}

interface ControlSelectProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    options: { value: string; label: string }[]
}

function ControlSelect({ value, onChange, disabled, options }: ControlSelectProps) {
    return (
        <div className="relative shrink-0">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="appearance-none text-[11px] font-bold uppercase tracking-wider pl-3 pr-6 py-1.5 rounded-full cursor-pointer outline-none transition-all disabled:opacity-40"
                style={{
                    background: 'rgba(212,120,138,0.08)',
                    border: '1px solid rgba(212,120,138,0.2)',
                    color: '#D4788A',
                    letterSpacing: '0.06em',
                }}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: '#FAF5F2', color: '#1C1410', fontWeight: '400', letterSpacing: '0' }}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#D4788A' }} />
        </div>
    )
}

// Derive available options based on whether an attachment exists
function getTypeOptions(hasAttachment: boolean) {
    return hasAttachment
        ? [
            { value: 'image-to-image', label: 'Image → Image' },
            { value: 'image-to-video', label: 'Image → Video' },
        ]
        : [
            { value: 'text-to-image', label: 'Text → Image' },
            { value: 'text-to-video', label: 'Text → Video' },
        ]
}

export function ChatBar({ onSend, isLoading, lastGeneratedImageUrl }: ChatBarProps) {
    const [input, setInput] = React.useState('')
    const [attachment, setAttachment] = React.useState<string | null>(null)
    const [generationType, setGenerationType] = React.useState<GenerationType>('text-to-image')
    const [duration, setDuration] = React.useState(5)
    const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('9:16')
    const [resolution, setResolution] = React.useState<Resolution>('2k')

    // Auto-switch type when attachment changes
    React.useEffect(() => {
        if (!attachment) {
            // No attachment → must be text-based
            if (generationType !== 'text-to-image' && generationType !== 'text-to-video') {
                setGenerationType('text-to-image')
            }
        } else {
            // Attachment present → switch text-only types to image equivalents
            if (generationType === 'text-to-image') setGenerationType('image-to-image')
            else if (generationType === 'text-to-video') setGenerationType('image-to-video')
        }
    }, [attachment])

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const { pickImage } = useImagePicker()

    const isVideo = generationType.includes('video')

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if ((!input.trim() && !attachment) || isLoading) return

        let effectiveType: GenerationType = generationType
        let effectiveAttachment = attachment

        // Auto-upgrade type based on attachment
        if (attachment && generationType === 'text-to-image') effectiveType = 'image-to-image'
        else if (attachment && generationType === 'text-to-video') effectiveType = 'image-to-video'
        else if (!attachment && generationType !== 'text-to-image' && generationType !== 'text-to-video') {
            effectiveType = 'text-to-image'
        }

        // Auto-reference last generated image for image-to-video when no attachment provided
        if (effectiveType === 'image-to-video' && !effectiveAttachment && lastGeneratedImageUrl) {
            effectiveAttachment = lastGeneratedImageUrl
        }

        onSend(input.trim(), effectiveAttachment, effectiveType, duration, aspectRatio, resolution)
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
            className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-12 safe-bottom"
            style={{
                background: 'linear-gradient(to top, #F5EFE9 50%, rgba(245,239,233,0.8) 75%, transparent 100%)',
            }}
        >
            <div className="max-w-2xl mx-auto space-y-2">

                {/* Attachment preview */}
                {attachment && (
                    <div className="flex px-2 message-in">
                        <div className="relative">
                            <img
                                src={attachment}
                                alt="Attachment"
                                className="w-16 h-16 object-cover rounded-2xl"
                                style={{
                                    border: '2px solid rgba(212,120,138,0.3)',
                                    boxShadow: '0 4px 12px rgba(212,120,138,0.2)',
                                }}
                            />
                            <button
                                onClick={() => setAttachment(null)}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #D4788A, #A84D60)' }}
                            >
                                <X size={10} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Auto-reference hint — when image-to-video is selected and a previous image exists */}
                {generationType === 'image-to-video' && !attachment && lastGeneratedImageUrl && (
                    <div
                        className="flex items-center gap-2 px-3 py-2 rounded-2xl mx-2 message-in"
                        style={{
                            background: 'rgba(212,120,138,0.06)',
                            border: '1px solid rgba(212,120,138,0.15)',
                        }}
                    >
                        <img
                            src={lastGeneratedImageUrl}
                            alt="Reference"
                            className="w-8 h-8 rounded-xl object-cover"
                            style={{ border: '1px solid rgba(212,120,138,0.2)' }}
                        />
                        <p className="text-[12px] font-medium flex-1" style={{ color: '#9B8D87' }}>
                            Using last generated image as reference
                        </p>
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'linear-gradient(135deg, #D4788A, #C9955C)', flexShrink: 0 }}
                        />
                    </div>
                )}

                {/* Chat input box */}
                <form
                    onSubmit={handleSend}
                    className="glass-elevated"
                    style={{ borderRadius: '26px' }}
                >
                    {/* TOP ROW — all generation controls, horizontally scrollable */}
                    <div
                        className="flex items-center gap-2 px-4 pt-3.5 pb-3 overflow-x-auto scrollbar-hide"
                        style={{ borderBottom: '1px solid rgba(212,120,138,0.1)' }}
                    >
                        {/* 1. Generation Type */}
                        <ControlSelect
                            value={generationType}
                            onChange={(v) => setGenerationType(v as GenerationType)}
                            disabled={isLoading}
                            options={getTypeOptions(!!attachment)}
                        />

                        {/* Divider */}
                        <div className="h-4 w-px shrink-0" style={{ background: 'rgba(212,120,138,0.2)' }} />

                        {/* 2. Aspect Ratio */}
                        <ControlSelect
                            value={aspectRatio}
                            onChange={(v) => setAspectRatio(v as AspectRatio)}
                            disabled={isLoading}
                            options={[
                                { value: '4:3', label: '4:3 Classic' },
                                { value: '1:1', label: '1:1 Square' },
                                { value: '3:4', label: '3:4 Portrait' },
                                { value: '9:16', label: '9:16 Mobile' },
                                { value: '5:4', label: '5:4 Art Print' },
                            ]}
                        />

                        {/* Divider */}
                        <div className="h-4 w-px shrink-0" style={{ background: 'rgba(212,120,138,0.2)' }} />

                        {/* 3. Resolution */}
                        <ControlSelect
                            value={resolution}
                            onChange={(v) => setResolution(v as Resolution)}
                            disabled={isLoading}
                            options={[
                                { value: '1k', label: '1K' },
                                { value: '2k', label: '2K' },
                                { value: '4k', label: '4K' },
                            ]}
                        />

                        {/* 4. Duration — only shown for video types */}
                        {isVideo && (
                            <>
                                <div className="h-4 w-px shrink-0" style={{ background: 'rgba(212,120,138,0.2)' }} />
                                <div
                                    className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl shrink-0"
                                    style={{ background: 'rgba(212,120,138,0.08)', border: '1px solid rgba(212,120,138,0.2)' }}
                                >
                                    {[5, 8].map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setDuration(d)}
                                            disabled={isLoading}
                                            className={cn(
                                                'px-2.5 py-0.5 text-[11px] font-bold rounded-lg transition-all shrink-0',
                                                duration === d ? 'text-white' : 'text-[#BFB0AB] hover:text-[#D4788A]'
                                            )}
                                            style={duration === d ? {
                                                background: 'linear-gradient(135deg, #D4788A, #A84D60)',
                                            } : {}}
                                        >
                                            {d}s
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* BOTTOM ROW — Attach + Textarea + Send */}
                    <div className="flex items-end gap-2 px-3 py-2.5">
                        <button
                            type="button"
                            onClick={handleAttach}
                            disabled={isLoading}
                            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
                            style={{ background: 'rgba(212,120,138,0.08)', color: '#D4788A' }}
                        >
                            <Plus size={20} strokeWidth={2.5} />
                        </button>

                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe what you want to create..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2 px-1 resize-none text-[15px] max-h-[120px] scrollbar-hide font-light"
                            style={{ color: '#1C1410' }}
                        />

                        <button
                            type="submit"
                            disabled={!canSend}
                            className={cn(
                                'w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90',
                                canSend && 'pulse-glow'
                            )}
                            style={canSend ? {
                                background: 'linear-gradient(135deg, #D4788A 0%, #A84D60 100%)',
                                color: 'white',
                                boxShadow: '0 4px 16px rgba(212,120,138,0.4)',
                            } : {
                                background: 'rgba(212,120,138,0.08)',
                                color: '#BFB0AB',
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
