'use client'

import * as React from 'react'
import { Plus, Send, X, Image as ImageIcon, Film } from 'lucide-react'
import { useImagePicker } from '@/hooks/use-image-picker'
import { cn } from '@/lib/utils'

interface ChatBarProps {
    onSend: (prompt: string, attachment: string | null) => void
    isLoading?: boolean
    placeholder?: string
}

export function ChatBar({ onSend, isLoading, placeholder = "Type a prompt..." }: ChatBarProps) {
    const [input, setInput] = React.useState('')
    const [attachment, setAttachment] = React.useState<string | null>(null)
    const { pickImage } = useImagePicker()

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if ((!input.trim() && !attachment) || isLoading) return

        onSend(input, attachment)
        setInput('')
        setAttachment(null)

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleAttach = async () => {
        try {
            const result = await pickImage()
            if (result) {
                setAttachment(result)
            }
        } catch (error) {
            console.error('Failed to pick image:', error)
        }
    }

    // Auto-resize textarea
    React.useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
        }
    }, [input])

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-background via-background/80 to-transparent z-50">
            <div className="max-w-3xl mx-auto space-y-4">
                {/* Attachment Preview */}
                {attachment && (
                    <div className="flex animate-in px-2">
                        <div className="relative group">
                            <img
                                src={attachment}
                                alt="Attachment"
                                className="w-16 h-16 object-cover rounded-xl border border-white/10 glass"
                            />
                            <button
                                onClick={() => setAttachment(null)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Bar */}
                <form
                    onSubmit={handleSend}
                    className="glass rounded-[28px] p-1.5 flex items-end gap-2 shadow-2xl transition-all focus-within:border-white/20"
                >
                    <button
                        type="button"
                        onClick={handleAttach}
                        disabled={isLoading}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        <Plus size={22} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent border-none focus:ring-0 py-2.5 px-1 resize-none text-[15px] max-h-[120px] scrollbar-hide text-white placeholder:text-white/40 font-light"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={(!input.trim() && !attachment) || isLoading}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all scale-100 active:scale-95 disabled:opacity-0 disabled:scale-90",
                            (input.trim() || attachment) ? "bg-white text-black" : "bg-transparent text-white/20"
                        )}
                    >
                        <Send size={18} fill="currentColor" />
                    </button>
                </form>
            </div>
        </div>
    )
}
