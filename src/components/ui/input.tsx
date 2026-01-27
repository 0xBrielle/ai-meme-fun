import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    multiline?: boolean
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, any>(
    ({ className, label, error, multiline, ...props }, ref) => {
        const Component = multiline ? 'textarea' : 'input'
        return (
            <div className="w-full">
                {label && <label className="block text-sm font-medium mb-1">{label}</label>}
                <Component
                    ref={ref as any}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-surface-200 bg-surface-50 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50',
                        multiline && 'h-auto min-h-[80px]',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
