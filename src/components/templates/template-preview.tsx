'use client'

import * as React from 'react'
import { Modal, Button } from '@/components/ui'
import { Template } from '@/types'
import { Play, Sparkles } from 'lucide-react'

interface TemplatePreviewProps {
    template: Template | null
    isOpen: boolean
    onClose: () => void
    onUse: (template: Template) => void
}

export function TemplatePreview({ template, isOpen, onClose, onUse }: TemplatePreviewProps) {
    if (!template) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={template.name}>
            <div className="space-y-6">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img
                        src={template.previewUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                    />
                    {template.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                <Play size={24} className="fill-white text-white ml-1" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {template.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider">
                        <span>{template.type}</span>
                        <span>•</span>
                        <span>{template.category.replace('_', ' ')}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-surface-200">
                    <Button
                        fullWidth
                        onClick={() => onUse(template)}
                        className="h-12 bg-gradient-to-r from-primary to-secondary font-bold text-lg"
                    >
                        <Sparkles size={20} className="mr-2" />
                        Use This Template ({template.creditsCost} ⭐)
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
