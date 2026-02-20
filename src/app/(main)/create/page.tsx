'use client'

import * as React from 'react'
import { ChatBar } from '@/components/create/chat-bar'
import { ResultFeed } from '@/components/create/result-feed'
import { useConversationStore } from '@/stores/conversation-store'
import { useGenerationStore } from '@/stores/generation-store'
import { generateImage, generateVideo } from '@/services/ai'
import { ChatMessage, GenerationType, AspectRatio, Resolution } from '@/types/conversation'
import { showToast } from '@/lib/toast'
import { generateId } from '@/lib/utils'

// ── Error message classifier ───────────────────────────────────────────────
function getFriendlyError(raw: string): string {
    const msg = (raw ?? '').toLowerCase()

    if (
        msg.includes('flagged') ||
        msg.includes('content checker') ||
        (msg.includes('safety') && msg.includes('filter')) ||
        msg.includes('content policy') ||
        msg.includes('could not be processed')
    ) {
        return "This content was flagged by our safety system 💙 This sometimes happens with certain images or subjects. Please try a different image or adjust your prompt!"
    }

    if (msg.includes('timeout') || msg.includes('timed out') || msg.includes('408')) {
        return "Generation took a bit too long this time ⏱️ VEO3 videos can take up to 4 minutes — please try again!"
    }

    if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('429')) {
        return "We're a bit busy right now 🙏 Take a short breather and try again in a moment."
    }

    if (msg.includes('unexpected value') || msg.includes('permitted:') || msg.includes('invalid')) {
        return "One of the settings wasn't supported by the model. Try adjusting your options and sending again."
    }

    // Return the raw message if it looks readable (not a serialized object)
    if (raw && raw.length < 200 && !raw.includes('[object')) {
        return raw
    }

    return "Something went wrong — please try again."
}

export default function CreatePage() {
    // ── Reactive selectors ─────────────────────────────────────────────────────
    // Individual selectors guarantee precise re-renders when specific values change
    const activeConversationId = useConversationStore((s) => s.activeConversationId)

    // Derived messages — selector re-runs when conversations OR activeId changes
    const messages = useConversationStore((s) => {
        const conv = s.conversations.find((c) => c.id === s.activeConversationId)
        return conv?.messages ?? []
    })

    // Last generated image URL — used for image-to-video auto-reference
    const lastGeneratedImageUrl = React.useMemo(() => {
        const successMsgs = [...messages].reverse()
        const lastImg = successMsgs.find(
            (m) => m.role === 'assistant' && m.status === 'success' && m.outputType === 'image' && m.outputUrl
        )
        return lastImg?.outputUrl ?? null
    }, [messages])

    // Stable actions
    const createConversation = useConversationStore((s) => s.createConversation)
    const addMessage = useConversationStore((s) => s.addMessage)
    const updateMessage = useConversationStore((s) => s.updateMessage)

    const { isGenerating, startGeneration, setResult, setError } = useGenerationStore()

    // ── Ensure active conversation always exists ───────────────────────────────
    React.useEffect(() => {
        const { activeConversationId: id, conversations } = useConversationStore.getState()
        if (!id || !conversations.some((c) => c.id === id)) {
            createConversation()
        }
    }, [createConversation])

    // ── Send handler — always reads FRESH state ────────────────────────────────
    const handleSend = React.useCallback(async (
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
    ) => {
        // IMPORTANT: Read CURRENT store state at call time to avoid stale closure values
        const { activeConversationId: currentId, conversations, createConversation: create } =
            useConversationStore.getState()

        // Get a valid conversation ID — create one if missing or stale
        let conversationId = currentId
        if (!conversationId || !conversations.some((c) => c.id === conversationId)) {
            conversationId = create()
        }

        // ── Add user message ──────────────────────────────────────────────────
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

        // ── Add assistant loading placeholder ─────────────────────────────────
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
                const res = await generateVideo({
                    prompt,
                    inputImage: attachment || undefined,
                    videoUrl,
                    durationSeconds: duration,
                    generateAudio,
                    keepOriginalSound,
                    characterOrientation,
                    type,
                    aspectRatio,
                })
                if (!res.success || !res.outputUrls?.[0]) throw new Error(res.error ?? 'Video generation failed')
                outputUrl = res.outputUrls[0]
                processingTimeMs = res.processingTimeMs ?? 0
            } else {
                const res = await generateImage({
                    prompt,
                    inputImage: attachment || undefined,
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

            showToast.success(isVideoType ? 'Video ready!' : 'Image ready!')
        } catch (err: any) {
            const friendlyMessage = getFriendlyError(err.message ?? '')
            updateMessage(conversationId, assistantMsgId, {
                status: 'error',
                errorMessage: friendlyMessage,
            })
            setError(err.message)
            showToast.error(friendlyMessage)
        }
    }, [addMessage, updateMessage, startGeneration, setResult, setError])

    // ── Download / Share ───────────────────────────────────────────────────────
    const handleDownload = React.useCallback((message: ChatMessage) => {
        if (!message.outputUrl) return
        const link = document.createElement('a')
        link.href = message.outputUrl
        link.download = `elle-ai-${message.id}.${message.outputType === 'video' ? 'mp4' : 'png'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, [])

    const handleShare = React.useCallback((message: ChatMessage) => {
        if (!message.outputUrl) return
        if (navigator.share) {
            navigator.share({
                title: 'Created with Elle AI',
                text: message.content || 'Check out my creation',
                url: message.outputUrl,
            }).catch(() => showToast.info('Sharing cancelled'))
        } else {
            navigator.clipboard.writeText(message.outputUrl)
                .then(() => showToast.success('Link copied!'))
                .catch(() => showToast.error('Could not copy link'))
        }
    }, [])

    return (
        <div className="relative h-full flex flex-col">
            <ResultFeed
                messages={messages}
                isGenerating={isGenerating}
                onDownload={handleDownload}
                onShare={handleShare}
            />
            <ChatBar onSend={handleSend} isLoading={isGenerating} lastGeneratedImageUrl={lastGeneratedImageUrl} />
        </div>
    )
}
