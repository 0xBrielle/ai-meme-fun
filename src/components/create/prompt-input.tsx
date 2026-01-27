'use client'

import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { UI_CONFIG } from '@/lib/constants'

interface PromptInputProps {
    value: string
    onChange: (value: string) => void
    onSave?: () => void
    maxLength?: number
    disabled?: boolean
    placeholder?: string
}

export function PromptInput({
    value,
    onChange,
    onSave,
    maxLength = UI_CONFIG.PROMPT_MAX_LENGTH,
    disabled,
    placeholder = 'Describe what you want to create...',
}: PromptInputProps) {
    const charactersLeft = maxLength - value.length
    const isNearLimit = charactersLeft < 50

    return (
        <div className="w-full space-y-2">
            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={3}
                    className={cn(
                        'w-full p-4 rounded-xl bg-surface-50 border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-base',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                />

                <div className="absolute top-4 right-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-gray-400 hover:text-yellow-500"
                        onClick={onSave}
                        title="Save prompt (Coming soon)"
                    >
                        <Star size={20} />
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center px-1">
                <span className="text-sm text-gray-500 hover:text-primary cursor-pointer transition-colors">
                    Saved Prompts ▼
                </span>
                <span className={cn('text-xs font-medium', isNearLimit ? 'text-yellow-500' : 'text-gray-500')}>
                    {value.length} / {maxLength}
                </span>
            </div>
        </div>
    )
}
