'use client'

import * as React from 'react'
import {
    ChatBar,
    GenerationSettings,
    GenerationType,
    ResultFeed
} from '@/components/create'
import { generateImage } from '@/services/ai'
import { useGenerationStore } from '@/stores/generation-store'
import { showToast } from '@/lib/toast'
import { Generation } from '@/types'
import { generateId } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content?: string
    image?: string
    generation?: Generation
    status?: 'loading' | 'error' | 'success'
}

export default function CreatePage() {
    const [messages, setMessages] = React.useState<Message[]>([])
    const [genType, setGenType] = React.useState<GenerationType>('text-to-image')
    const [duration, setDuration] = React.useState(5)

    const {
        isGenerating,
        startGeneration,
        setResult,
        setError,
    } = useGenerationStore()

    const handleSend = async (prompt: string, attachment: string | null) => {
        const userMessageId = generateId()
        const assistantMessageId = generateId()

        // 1. Add user message to feed
        const userMsg: Message = {
            id: userMessageId,
            role: 'user',
            content: prompt,
            image: attachment || undefined
        }
        setMessages(prev => [...prev, userMsg])

        // 2. Add loading assistant message
        const assistantMsg: Message = {
            id: assistantMessageId,
            role: 'assistant',
            status: 'loading'
        }
        setMessages(prev => [...prev, assistantMsg])

        startGeneration()

        try {
            const response = await generateImage({
                prompt,
                inputImage: attachment || undefined,
                // Pass extra params for video if needed
                ...(genType.includes('video') ? { duration, type: genType } : {})
            })

            if (response.success && response.outputUrls?.length) {
                const generation: Generation = {
                    id: generateId(),
                    type: genType.includes('video') ? 'video' : 'image',
                    prompt,
                    inputImageUrl: attachment,
                    outputUrl: response.outputUrls[0]!,
                    templateId: null,
                    creditsUsed: 1,
                    processingTimeMs: response.processingTimeMs || null,
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                }

                // Update assistant message with result
                setMessages(prev => prev.map(m =>
                    m.id === assistantMessageId
                        ? { ...m, status: 'success', generation }
                        : m
                ))

                setResult(generation)
            } else {
                throw new Error(response.error || 'Failed to generate')
            }
        } catch (error: any) {
            setError(error.message)
            showToast.error(error.message)

            // Update assistant message with error
            setMessages(prev => prev.map(m =>
                m.id === assistantMessageId
                    ? { ...m, status: 'error' }
                    : m
            ))
        }
    }

    const handleDownload = (gen: Generation) => {
        const link = document.createElement('a')
        link.href = gen.outputUrl
        link.download = `ai-meme-${gen.id}.${gen.type === 'video' ? 'mp4' : 'png'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async (gen: Generation) => {
        showToast.info('Sharing is coming soon!')
    }

    return (
        <main className="relative flex flex-col h-[100dvh] bg-background overflow-hidden">
            {/* Header / Settings area */}
            <div className="safe-top bg-gradient-to-b from-background to-transparent z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-xl font-semibold tracking-tight">Create</h1>
                    <GenerationSettings
                        type={genType}
                        onTypeChange={setGenType}
                        duration={duration}
                        onDurationChange={setDuration}
                        disabled={isGenerating}
                    />
                </div>
            </div>

            {/* Scrollable Feed */}
            <ResultFeed
                messages={messages}
                onDownload={handleDownload}
                onShare={handleShare}
            />

            {/* Bottom Input */}
            <ChatBar
                onSend={handleSend}
                isLoading={isGenerating}
                placeholder={
                    genType === 'text-to-image' ? "Describe an image..." :
                        genType === 'text-to-video' ? "Describe a video scene..." :
                            "What should happen?"
                }
            />

            {/* Refined Background decoration */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-white/5 blur-[100px] rounded-full pointer-events-none -z-10" />
        </main>
    )
}
