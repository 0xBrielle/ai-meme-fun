'use client'

import * as React from 'react'
import { Modal } from '@/components/ui'
import { ResultDisplay } from './result-display'

interface ResultModalProps {
    imageUrl: string | null
    isOpen: boolean
    onClose: () => void
    onDownload: () => void
    onShare: () => void
    onRegenerate: () => void
    prompt?: string
}

export function ResultModal({
    imageUrl,
    isOpen,
    onClose,
    onDownload,
    onShare,
    onRegenerate,
    prompt,
}: ResultModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Result">
            <div className="space-y-6">
                <ResultDisplay
                    imageUrl={imageUrl}
                    isVisible={true}
                    onClose={onClose}
                    onDownload={onDownload}
                    onShare={onShare}
                    onRegenerate={onRegenerate}
                    prompt={prompt}
                />
            </div>
        </Modal>
    )
}
