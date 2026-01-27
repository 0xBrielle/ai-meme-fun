'use client'

import { Button } from '@/components/ui'
import { CREDIT_COSTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface GenerateButtonProps {
    onClick: () => void
    isLoading: boolean
    disabled?: boolean
    creditCost?: number
}

export function GenerateButton({
    onClick,
    isLoading,
    disabled,
    creditCost = CREDIT_COSTS.IMAGE_GENERATION,
}: GenerateButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            isLoading={isLoading}
            className={cn(
                'w-full h-14 rounded-xl text-lg font-bold transition-all',
                'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:after:duration-200 active:scale-[0.98]'
            )}
        >
            <span className="mr-2">✨</span>
            {isLoading ? 'Generating...' : `Generate (${creditCost} credits)`}
        </Button>
    )
}
