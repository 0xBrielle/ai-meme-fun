'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProcessingOverlayProps {
    isVisible: boolean
    progress: number // 0-100, or -1 for indeterminate
    status: string
    inputImage?: string | null
    prompt?: string
}

export function ProcessingOverlay({
    isVisible,
    progress,
    status,
    inputImage,
    prompt,
}: ProcessingOverlayProps) {
    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-background/90 backdrop-blur-lg"
            >
                <div className="w-full max-w-sm space-y-8 text-center">
                    {inputImage ? (
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-surface-200 shadow-2xl mx-auto w-48">
                            <img src={inputImage} alt="Input" className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                    )}

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">{status}</h2>
                        {prompt && <p className="text-gray-400 text-sm italic line-clamp-2">"{prompt}"</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="h-2 w-full bg-surface-50 rounded-full overflow-hidden border border-surface-200">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                initial={{ width: 0 }}
                                animate={{
                                    width: progress >= 0 ? `${progress}%` : '100%',
                                    transition: progress >= 0 ? { duration: 0.5 } : { duration: 2, repeat: Infinity },
                                }}
                            />
                        </div>
                        {progress >= 0 && <span className="text-xs font-bold text-primary">{progress}%</span>}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
