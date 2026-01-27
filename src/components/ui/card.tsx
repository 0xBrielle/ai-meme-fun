import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    interactive?: boolean
}

export function Card({ className, interactive, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-surface-50 rounded-lg border border-surface-200 overflow-hidden',
                interactive && 'hover:border-primary transition-colors cursor-pointer',
                className
            )}
            {...props}
        />
    )
}
