import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none',
                    {
                        'bg-primary text-white hover:bg-primary-600': variant === 'primary',
                        'bg-secondary text-white hover:bg-secondary-600': variant === 'secondary',
                        'bg-transparent hover:bg-surface-50': variant === 'ghost',
                        'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-base': size === 'md',
                        'px-6 py-3 text-lg': size === 'lg',
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <span className="mr-2">⌛</span>}
                {props.children}
            </button>
        )
    }
)
Button.displayName = 'Button'

export { Button }
