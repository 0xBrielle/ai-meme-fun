'use client'

import * as React from 'react'
import { Download, Share2, RefreshCw, X, Star } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ResultDisplayProps {
    imageUrl: string | null
    isVisible: boolean
    onClose: () => void
    onDownload: () => void
    onShare: () => void
    onRegenerate: () => void
    prompt?: string
}

export function ResultDisplay({
    imageUrl,
    isVisible,
    onClose,
    onDownload,
    onShare,
    onRegenerate,
    prompt,
}: ResultDisplayProps) {
    if (!isVisible || !imageUrl) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] bg-background flex flex-col pt-safe-top"
            >
                <header className="flex items-center justify-between h-16 px-4 border-b border-surface-50">
                    <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                        <X size={24} />
                    </Button>
                    <h2 className="text-lg font-bold">Result</h2>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto pb-safe-bottom">
                    <div className="relative aspect-square md:aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-surface-50 border border-surface-200 shadow-2xl">
                        <img
                            src={imageUrl}
                            alt="Generated result"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="w-full max-w-2xl mx-auto space-y-4">
                        {prompt && (
                            <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                                <p className="text-sm text-gray-400 italic mb-2">Prompt:</p>
                                <p className="text-sm text-white line-clamp-3">{prompt}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="primary"
                                onClick={onDownload}
                                className="h-14 rounded-xl flex items-center justify-center font-bold"
                            >
                                <Download size={20} className="mr-2" />
                                Download
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={onShare}
                                className="h-14 rounded-xl flex items-center justify-center font-bold"
                            >
                                <Share2 size={20} className="mr-2" />
                                Share
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={onRegenerate}
                            className="w-full h-14 rounded-xl border border-surface-200 flex items-center justify-center font-bold text-gray-300 hover:text-white"
                        >
                            <RefreshCw size={20} className="mr-2" />
                            Re-generate (1 ⭐)
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full text-xs text-gray-500 hover:text-yellow-500 flex items-center justify-center"
                        >
                            <Star size={14} className="mr-1" />
                            Save this result to prompt library
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
