import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, ChatMessage } from '@/types/conversation'
import { generateId } from '@/lib/utils'

interface ConversationState {
    conversations: Conversation[]
    activeConversationId: string | null
    sidebarOpen: boolean

    // Actions
    createConversation: () => string
    setActiveConversation: (id: string | null) => void
    addMessage: (conversationId: string, message: ChatMessage) => void
    updateMessage: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void
    deleteConversation: (id: string) => void
    toggleSidebar: () => void
    setSidebar: (open: boolean) => void
    getActiveConversation: () => Conversation | null
}

export const useConversationStore = create<ConversationState>()(
    persist(
        (set, get) => ({
            conversations: [],
            activeConversationId: null,
            sidebarOpen: false,

            createConversation: () => {
                const id = generateId()
                const now = new Date().toISOString()
                const conversation: Conversation = {
                    id,
                    title: 'New Chat',
                    messages: [],
                    createdAt: now,
                    updatedAt: now,
                }
                set((state) => ({
                    conversations: [conversation, ...state.conversations],
                    activeConversationId: id,
                    sidebarOpen: false,
                }))
                return id
            },

            setActiveConversation: (id) =>
                set({ activeConversationId: id, sidebarOpen: false }),

            addMessage: (conversationId, message) =>
                set((state) => ({
                    conversations: state.conversations.map((c) => {
                        if (c.id !== conversationId) return c
                        const messages = [...c.messages, message]
                        // Auto-title from first user message
                        const title = c.title === 'New Chat' && message.role === 'user' && message.content
                            ? message.content.slice(0, 40) + (message.content.length > 40 ? '…' : '')
                            : c.title
                        return { ...c, messages, title, updatedAt: new Date().toISOString() }
                    }),
                })),

            updateMessage: (conversationId, messageId, updates) =>
                set((state) => ({
                    conversations: state.conversations.map((c) => {
                        if (c.id !== conversationId) return c
                        return {
                            ...c,
                            messages: c.messages.map((m) =>
                                m.id === messageId ? { ...m, ...updates } : m
                            ),
                        }
                    }),
                })),

            deleteConversation: (id) =>
                set((state) => ({
                    conversations: state.conversations.filter((c) => c.id !== id),
                    activeConversationId:
                        state.activeConversationId === id ? null : state.activeConversationId,
                })),

            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebar: (open) => set({ sidebarOpen: open }),

            getActiveConversation: () => {
                const { conversations, activeConversationId } = get()
                return conversations.find((c) => c.id === activeConversationId) ?? null
            },
        }),
        {
            name: 'conversations',
            partialize: (state) => ({
                conversations: state.conversations,
                activeConversationId: state.activeConversationId,
            }),
        }
    )
)
