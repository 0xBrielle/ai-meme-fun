'use client'

import * as React from 'react'
import { ChevronDown, Video, Image as ImageIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export type GenerationType = 'text-to-image' | 'text-to-video' | 'image-to-video' | 'video-to-video'

interface GenerationSettingsProps {
    type: GenerationType
    onTypeChange: (type: GenerationType) => void
    duration: number
    onDurationChange: (duration: number) => void
    disabled?: boolean
}

const TYPE_OPTIONS: { value: GenerationType, label: string, icon: any }[] = [
    { value: 'text-to-image', label: 'Text to Image', icon: ImageIcon },
    { value: 'text-to-video', label: 'Text to Video', icon: Video },
    { value: 'image-to-video', label: 'Image to Video', icon: Sparkles },
    { value: 'video-to-video', label: 'Video to Video', icon: Video },
]

const DURATION_OPTIONS = [3, 5, 10]

export function GenerationSettings({
    type,
    onTypeChange,
    duration,
    onDurationChange,
    disabled
}: GenerationSettingsProps) {
    const isVideo = type.includes('video')

    return (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 animate-in">
            {/* Type Dropdown */}
            <div className="relative group">
                <select
                    value={type}
                    onChange={(e) => onTypeChange(e.target.value as GenerationType)}
                    disabled={disabled}
                    className="appearance-none glass rounded-full pl-10 pr-10 py-2 text-sm font-light text-white outline-none focus:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                >
                    {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#121212]">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                    {(() => {
                        const Icon = TYPE_OPTIONS.find(opt => opt.value === type)?.icon || ImageIcon
                        return <Icon size={16} />
                    })()}
                </div>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>

            {/* Duration - Only for Video */}
            {isVideo && (
                <div className="flex items-center glass rounded-full px-3 py-1 gap-1 animate-scale">
                    {DURATION_OPTIONS.map((d) => (
                        <button
                            key={d}
                            onClick={() => onDurationChange(d)}
                            disabled={disabled}
                            className={cn(
                                "px-2 py-1 text-xs rounded-full transition-all",
                                duration === d
                                    ? "bg-white text-black font-semibold"
                                    : "text-white/40 hover:text-white/60"
                            )}
                        >
                            {d}s
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
