'use client'

import * as React from 'react'
import { ChatBar } from '@/components/create/chat-bar'
import { ResultFeed } from '@/components/create/result-feed'
import { ProcessingOverlay } from '@/components/create/processing-overlay'
import { useConversationStore } from '@/stores/conversation-store'
import { useGenerationStore } from '@/stores/generation-store'
import { generateImage, generateVideo } from '@/services/ai'
import { ChatMessage, GenerationType, AspectRatio, Resolution } from '@/types/conversation'
import { showToast } from '@/lib/toast'
import { generateId } from '@/lib/utils'

export default function CreatePage() {
    const { activeConversationId, createConversation, addMessage, updateMessage, getActiveConversation } =
        useConversationStore()
    const { isGenerating, startGeneration, setResult, setError } = useGenerationStore()

    // Ensure there's always an active conversation
    React.useEffect(() => {
        if (!activeConversationId) createConversation()
    }, [activeConversationId])

    const conversation = getActiveConversation()
    const messages = conversation?.messages ?? []

    const handleSend = async (
        prompt: string,
        attachment: string | null,
        type: GenerationType,
        duration: number,
        aspectRatio: AspectRatio,
        resolution: Resolution
    ) => {
        const conversationId = activeConversationId ?? createConversation()

        // Add user message
        const userMsgId = generateId()
        addMessage(conversationId, {
            id: userMsgId,
            role: 'user',
            content: prompt || undefined,
            image: attachment || undefined,
            generationType: type,
            aspectRatio,
            resolution,
            createdAt: new Date().toISOString(),
        })

        // Add placeholder assistant message
        const assistantMsgId = generateId()
        addMessage(conversationId, {
            id: assistantMsgId,
            role: 'assistant',
            status: 'loading',
            generationType: type,
            aspectRatio,
            resolution,
            createdAt: new Date().toISOString(),
        })

        startGeneration()

        try {
            const isVideoType = type.includes('video')

            let outputUrl: string
            let processingTimeMs: number

            if (isVideoType) {
                // Route to Veo3 via FAL
                const res = await generateVideo({
                    prompt,
                    inputImage: attachment || undefined,
                    // No model specified — route.ts decides: fal-ai/veo3
                    durationSeconds: duration,
                    type,
                    aspectRatio,
                    resolution,
                })
                if (!res.success || !res.outputUrls?.[0]) throw new Error(res.error ?? 'Video generation failed')
                outputUrl = res.outputUrls[0]
                processingTimeMs = res.processingTimeMs ?? 0
            } else {
                // Route to Nano Banana via FAL for image generation
                const res = await generateImage({
                    prompt,
                    inputImage: attachment || undefined,
                    // No model specified — route.ts decides:
                    // attachment present → fal-ai/nano-banana/edit
                    // no attachment     → fal-ai/nano-banana
                    type,
                    aspectRatio,
                    resolution,
                })
                if (!res.success || !res.outputUrls?.[0]) throw new Error(res.error ?? 'Image generation failed')
                outputUrl = res.outputUrls[0]
                processingTimeMs = res.processingTimeMs ?? 0
            }

            updateMessage(conversationId, assistantMsgId, {
                status: 'success',
                outputUrl,
                outputType: isVideoType ? 'video' : 'image',
                processingTimeMs,
                aspectRatio,
                resolution,
            })

            setResult({
                id: assistantMsgId,
                type: isVideoType ? 'video' : 'image',
                prompt,
                inputImageUrl: attachment,
                outputUrl,
                templateId: null,
                creditsUsed: 1,
                processingTimeMs,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
            })

            showToast.success(isVideoType ? 'Video generated!' : 'Image generated!')
        } catch (err: any) {
            updateMessage(conversationId, assistantMsgId, { status: 'error' })
            setError(err.message)
            showToast.error(err.message)
        }
    }

    const handleDownload = (outputUrl: string, id: string, type: 'image' | 'video') => {
        const link = document.createElement('a')
        link.href = outputUrl
        link.download = `ai-fun-meme-${id}.${type === 'video' ? 'mp4' : 'png'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="relative h-full flex flex-col">
            <ResultFeed
                messages={messages}
                onDownload={(msg) => handleDownload(msg.outputUrl!, msg.id, msg.outputType!)}
                onShare={() => showToast.info('Sharing coming soon!')}
            />

            <ChatBar onSend={handleSend} isLoading={isGenerating} />

            <ProcessingOverlay
                isVisible={isGenerating}
                progress={0}
                status="Creating your masterpiece…"
            />
        </div>
    )
}
