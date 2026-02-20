'use client'

import * as React from 'react'
import { Plus, Send, X, ChevronDown, Film } from 'lucide-react'
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
        resolution: Resolution,
        generateAudio: boolean,
        videoUrl?: string,
        keepOriginalSound?: boolean,
        characterOrientation?: 'image' | 'video',
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
                    <option key={o.value} value={o.value}
                        style={{ background: '#FAF5F2', color: '#1C1410', fontWeight: '400', letterSpacing: '0' }}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#D4788A' }} />
        </div>
    )
}

function Pill({ label, active, onClick, disabled }: {
    label: string; active: boolean; onClick: () => void; disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'px-3 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0',
                active ? 'text-white' : 'text-[#BFB0AB] hover:text-[#D4788A]'
            )}
            style={active ? { background: 'linear-gradient(135deg, #D4788A, #A84D60)' } : {}}
        >
            {label}
        </button>
    )
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider shrink-0"
                style={{ color: '#BFB0AB', minWidth: 60 }}>
                {label}
            </span>
            <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl"
                style={{ background: 'rgba(212,120,138,0.08)', border: '1px solid rgba(212,120,138,0.2)' }}>
                {children}
            </div>
        </div>
    )
}

function getTypeOptions(hasAttachment: boolean) {
    return hasAttachment
        ? [
            { value: 'image-to-image', label: 'Img → Img' },
            { value: 'image-to-video', label: 'Img → Vid' },
            { value: 'video-to-video', label: 'Vid → Vid' },
        ]
        : [
            { value: 'text-to-image', label: 'Txt → Img' },
            { value: 'text-to-video', label: 'Txt → Vid' },
        ]
}

export function ChatBar({ onSend, isLoading, lastGeneratedImageUrl }: ChatBarProps) {
    const [input, setInput] = React.useState('')
    const [attachment, setAttachment] = React.useState<string | null>(null)
    const [generationType, setGenerationType] = React.useState<GenerationType>('text-to-image')
    const [duration, setDuration] = React.useState(5)                     // 5 or 10
    const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('9:16')
    const [resolution, setResolution] = React.useState<Resolution>('2k')  // images only
    const [generateAudio, setGenerateAudio] = React.useState(true)
    // Video-to-video specific
    const [videoUrl, setVideoUrl] = React.useState('')
    const [keepOriginalSound, setKeepOriginalSound] = React.useState(true)  // default true per API
    const [characterOrientation, setCharacterOrientation] = React.useState<'image' | 'video'>('image')

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const { pickImage } = useImagePicker()

    const isVideo = generationType.includes('video')
    const isVideoToVideo = generationType === 'video-to-video'

    // Auto-switch type when attachment changes
    React.useEffect(() => {
        if (!attachment) {
            if (generationType !== 'text-to-image' && generationType !== 'text-to-video') {
                setGenerationType('text-to-image')
            }
        } else {
            if (generationType === 'text-to-image') setGenerationType('image-to-image')
            else if (generationType === 'text-to-video') setGenerationType('image-to-video')
        }
    }, [attachment])

    // Clamp aspect ratio to Kling-valid when switching to video
    React.useEffect(() => {
        if (isVideo) {
            if (!['16:9', '9:16', '1:1'].includes(aspectRatio)) setAspectRatio('9:16')
        }
    }, [isVideo])

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (isLoading) return
        if (isVideoToVideo && (!attachment || !videoUrl.trim())) return
        if (!isVideoToVideo && !input.trim() && !attachment) return

        let effectiveType: GenerationType = generationType
        let effectiveAttachment = attachment

        if (attachment && generationType === 'text-to-image') effectiveType = 'image-to-image'
        else if (attachment && generationType === 'text-to-video') effectiveType = 'image-to-video'
        else if (!attachment && generationType !== 'text-to-image' && generationType !== 'text-to-video' && !isVideoToVideo) {
            effectiveType = 'text-to-image'
        }

        // Auto-reference last generated image for image-to-video
        if (effectiveType === 'image-to-video' && !effectiveAttachment && lastGeneratedImageUrl) {
            effectiveAttachment = lastGeneratedImageUrl
        }

        onSend(
            input.trim(),
            effectiveAttachment,
            effectiveType,
            duration,
            aspectRatio,
            resolution,
            generateAudio,
            isVideoToVideo ? videoUrl.trim() : undefined,
            isVideoToVideo ? keepOriginalSound : undefined,
            isVideoToVideo ? characterOrientation : undefined,
        )

        setInput('')
        setAttachment(null)
        setVideoUrl('')
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

    const canSend = !isLoading && (
        isVideoToVideo
            ? (!!attachment && !!videoUrl.trim())
            : (!!input.trim() || !!attachment)
    )

    return (
        <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-12 safe-bottom"
            style={{ background: 'linear-gradient(to top, #F5EFE9 50%, rgba(245,239,233,0.8) 75%, transparent 100%)' }}
        >
            <div className="max-w-2xl mx-auto space-y-2">

                {/* Attachment preview */}
                {attachment && (
                    <div className="flex px-2 message-in">
                        <div className="relative">
                            <img src={attachment} alt="Attachment"
                                className="w-16 h-16 object-cover rounded-2xl"
                                style={{ border: '2px solid rgba(212,120,138,0.3)', boxShadow: '0 4px 12px rgba(212,120,138,0.2)' }}
                            />
                            <button onClick={() => setAttachment(null)}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #D4788A, #A84D60)' }}>
                                <X size={10} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Auto-reference hint */}
                {generationType === 'image-to-video' && !attachment && lastGeneratedImageUrl && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl mx-2 message-in"
                        style={{ background: 'rgba(212,120,138,0.06)', border: '1px solid rgba(212,120,138,0.15)' }}>
                        <img src={lastGeneratedImageUrl} alt="Reference"
                            className="w-8 h-8 rounded-xl object-cover"
                            style={{ border: '1px solid rgba(212,120,138,0.2)' }} />
                        <p className="text-[12px] font-medium flex-1" style={{ color: '#9B8D87' }}>
                            Using last generated image as reference
                        </p>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: 'linear-gradient(135deg, #D4788A, #C9955C)' }} />
                    </div>
                )}

                <form onSubmit={handleSend} className="glass-elevated" style={{ borderRadius: '26px' }}>

                    {/* ── VIDEO MODE: Vertical panel ── */}
                    {isVideo ? (
                        <div className="px-4 pt-3.5 pb-3 space-y-2.5"
                            style={{ borderBottom: '1px solid rgba(212,120,138,0.1)' }}>

                            {/* Row 1: Type + model badge */}
                            <div className="flex items-center justify-between">
                                <ControlSelect
                                    value={generationType}
                                    onChange={(v) => setGenerationType(v as GenerationType)}
                                    disabled={isLoading}
                                    options={getTypeOptions(!!attachment)}
                                />
                                <span className="text-[10px] font-semibold uppercase tracking-wider"
                                    style={{ color: '#D4788A', opacity: 0.6 }}>
                                    Kling 2.6
                                </span>
                            </div>

                            {/* Video-to-video: reference video URL input */}
                            {isVideoToVideo && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                    style={{ background: 'rgba(212,120,138,0.06)', border: '1px solid rgba(212,120,138,0.15)' }}>
                                    <Film size={13} style={{ color: '#D4788A', flexShrink: 0 }} />
                                    <input
                                        type="url"
                                        placeholder="Paste reference video URL..."
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        disabled={isLoading}
                                        className="flex-1 bg-transparent border-none outline-none text-[12px] font-light placeholder:text-[#BFB0AB] disabled:opacity-40"
                                        style={{ color: '#1C1410' }}
                                    />
                                    {videoUrl && (
                                        <button type="button" onClick={() => setVideoUrl('')}
                                            style={{ color: '#BFB0AB' }}>
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Aspect Ratio — text/image-to-video only */}
                            {!isVideoToVideo && (
                                <ControlRow label="Ratio">
                                    {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((r) => (
                                        <Pill key={r} label={r} active={aspectRatio === r}
                                            onClick={() => setAspectRatio(r)} disabled={isLoading} />
                                    ))}
                                </ControlRow>
                            )}

                            {/* Duration — text/image-to-video only */}
                            {!isVideoToVideo && (
                                <ControlRow label="Duration">
                                    {[5, 10].map((d) => (
                                        <Pill key={d} label={`${d}s`} active={duration === d}
                                            onClick={() => setDuration(d)} disabled={isLoading} />
                                    ))}
                                </ControlRow>
                            )}

                            {/* Audio — text/image-to-video only */}
                            {!isVideoToVideo && (
                                <ControlRow label="Audio">
                                    <Pill label="On" active={generateAudio}
                                        onClick={() => setGenerateAudio(true)} disabled={isLoading} />
                                    <Pill label="Off" active={!generateAudio}
                                        onClick={() => setGenerateAudio(false)} disabled={isLoading} />
                                </ControlRow>
                            )}

                            {/* Sound — video-to-video */}
                            {isVideoToVideo && (
                                <ControlRow label="Sound">
                                    <Pill label="Keep" active={keepOriginalSound}
                                        onClick={() => setKeepOriginalSound(true)} disabled={isLoading} />
                                    <Pill label="Off" active={!keepOriginalSound}
                                        onClick={() => setKeepOriginalSound(false)} disabled={isLoading} />
                                </ControlRow>
                            )}

                            {/* Character orientation — video-to-video */}
                            {isVideoToVideo && (
                                <ControlRow label="Follow">
                                    <Pill label="Image" active={characterOrientation === 'image'}
                                        onClick={() => setCharacterOrientation('image')} disabled={isLoading} />
                                    <Pill label="Video" active={characterOrientation === 'video'}
                                        onClick={() => setCharacterOrientation('video')} disabled={isLoading} />
                                </ControlRow>
                            )}

                            {/* Missing inputs hint — video-to-video */}
                            {isVideoToVideo && (!attachment || !videoUrl.trim()) && (
                                <p className="text-[10px] font-medium text-center" style={{ color: '#BFB0AB' }}>
                                    {!attachment && !videoUrl.trim()
                                        ? '⚠️ Tap + for a reference image and paste a video URL above'
                                        : !attachment
                                            ? '⚠️ Tap + below to attach a reference image'
                                            : '⚠️ Paste a reference video URL above to continue'}
                                </p>
                            )}
                        </div>

                    ) : (
                        /* ── IMAGE MODE: Horizontal scrollable row ── */
                        <div className="relative" style={{ borderBottom: '1px solid rgba(212,120,138,0.1)' }}>
                            <div className="flex items-center gap-1.5 px-3 pt-3 pb-2.5 overflow-x-auto scrollbar-hide"
                                style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                                <ControlSelect
                                    value={generationType}
                                    onChange={(v) => setGenerationType(v as GenerationType)}
                                    disabled={isLoading}
                                    options={getTypeOptions(!!attachment)}
                                />
                                <div className="h-4 w-px shrink-0" style={{ background: 'rgba(212,120,138,0.2)' }} />
                                <ControlSelect
                                    value={aspectRatio}
                                    onChange={(v) => setAspectRatio(v as AspectRatio)}
                                    disabled={isLoading}
                                    options={[
                                        { value: '4:3', label: '4:3' },
                                        { value: '1:1', label: '1:1' },
                                        { value: '3:4', label: '3:4' },
                                        { value: '9:16', label: '9:16' },
                                        { value: '5:4', label: '5:4' },
                                    ]}
                                />
                                <div className="h-4 w-px shrink-0" style={{ background: 'rgba(212,120,138,0.2)' }} />
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
                                <div className="w-6 shrink-0" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none"
                                style={{ background: 'linear-gradient(to right, transparent, rgba(250,245,242,0.95))', borderRadius: '0 26px 0 0' }} />
                        </div>
                    )}

                    {/* BOTTOM ROW */}
                    <div className="flex items-end gap-2 px-3 py-2.5">
                        <button type="button" onClick={handleAttach} disabled={isLoading}
                            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
                            style={{ background: 'rgba(212,120,138,0.08)', color: '#D4788A' }}>
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                isVideoToVideo ? 'Describe the motion (optional)...' :
                                    isVideo ? 'Describe your video...' :
                                        'Describe what you want to create...'
                            }
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2 px-1 resize-none text-[15px] max-h-[120px] scrollbar-hide font-light"
                            style={{ color: '#1C1410' }}
                        />
                        <button type="submit" disabled={!canSend}
                            className={cn('w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90', canSend && 'pulse-glow')}
                            style={canSend ? {
                                background: 'linear-gradient(135deg, #D4788A 0%, #A84D60 100%)',
                                color: 'white',
                                boxShadow: '0 4px 16px rgba(212,120,138,0.4)',
                            } : {
                                background: 'rgba(212,120,138,0.08)',
                                color: '#BFB0AB',
                            }}>
                            <Send size={16} fill="currentColor" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
