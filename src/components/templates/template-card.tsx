'use client'

import * as React from 'react'
import { Card } from '@/components/ui'
import { Template } from '@/types'
import { cn } from '@/lib/utils'
import { Play, Image as ImageIcon } from 'lucide-react'

interface TemplateCardProps {
    template: Template
    onClick: (template: Template) => void
    isLoading?: boolean
}

export function TemplateCard({ template, onClick, isLoading }: TemplateCardProps) {
    if (isLoading) {
        return (
            <Card className="aspect-square bg-surface-50 animate-pulse border-none" />
        )
    }

    return (
        <Card
            onClick={() => onClick(template)}
            className="group relative aspect-square cursor-pointer active:scale-95 transition-all duration-200 border-none rounded-2xl"
        >
            <img
                src={template.previewUrl}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            {/* Badges */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg flex items-center space-x-1 border border-white/10">
                {template.type === 'video' ? <Play size={10} className="fill-white text-white" /> : <ImageIcon size={10} className="text-white" />}
            </div>

            <div className="absolute top-2 right-2 px-2 py-1 bg-primary/80 backdrop-blur-md rounded-lg border border-white/10">
                <span className="text-[10px] font-bold text-white leading-none">{template.creditsCost} ⭐</span>
            </div>

            {/* Name */}
            <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-sm font-bold text-white truncate">{template.name}</h3>
            </div>
        </Card>
    )
}
