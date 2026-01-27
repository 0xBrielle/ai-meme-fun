'use client'

import * as React from 'react'
import { ImageUpload, PromptInput, GenerateButton, ProcessingOverlay } from '@/components/create'
import { ResultModal } from '@/components/result'
import { generateImage } from '@/services/ai'
import { useGenerationStore } from '@/stores/generation-store'
import { showToast } from '@/lib/toast'
import { Generation } from '@/types'
import { generateId } from '@/lib/utils'

export default function CreatePage() {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
    const [prompt, setPrompt] = React.useState('')

    const {
        isGenerating,
        progress,
        currentResult,
        startGeneration,
        setResult,
        setError,
        reset
    } = useGenerationStore()

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            showToast.error('Please enter a description.')
            return
        }

        startGeneration()

        try {
            const response = await generateImage({
                prompt,
                inputImage: selectedImage || undefined,
            })

            if (response.success && response.outputUrls?.length) {
                const generation: Generation = {
                    id: generateId(),
                    type: 'image',
                    prompt,
                    inputImageUrl: selectedImage,
                    outputUrl: response.outputUrls[0]!,
                    templateId: null,
                    creditsUsed: 1,
                    processingTimeMs: response.processingTimeMs || null,
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                }

                setResult(generation)
                showToast.success('Image generated!')
            } else {
                throw new Error(response.error || 'Failed to generate image')
            }
        } catch (error: any) {
            setError(error.message)
            showToast.error(error.message)
        }
    }

    const handleDownload = () => {
        if (!currentResult) return
        const link = document.createElement('a')
        link.href = currentResult.outputUrl
        link.download = `ai-meme-${currentResult.id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async () => {
        showToast.info('Sharing is coming soon to the web!')
    }

    return (
        <div className="py-8 space-y-8 max-w-2xl mx-auto">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold">Create Something Fun</h1>
                <p className="text-gray-400">Describe what you want to achieve or use an image to start.</p>
            </div>

            <div className="grid gap-8">
                <ImageUpload
                    value={selectedImage}
                    onChange={setSelectedImage}
                    disabled={isGenerating}
                />

                <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    disabled={isGenerating}
                />

                <div className="pt-4">
                    <GenerateButton
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                    />
                </div>
            </div>

            <ProcessingOverlay
                isVisible={isGenerating}
                progress={progress.progress}
                status={progress.message || 'Creating your image...'}
                inputImage={selectedImage}
                prompt={prompt}
            />

            <ResultModal
                imageUrl={currentResult?.outputUrl || null}
                isOpen={!!currentResult}
                onClose={reset}
                onDownload={handleDownload}
                onShare={handleShare}
                onRegenerate={handleGenerate}
                prompt={prompt}
            />

            {/* Background decoration */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-secondary/10 blur-[100px] rounded-full -z-10" />
        </div>
    )
}
