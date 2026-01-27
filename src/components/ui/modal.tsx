'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
}) => {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-surface-50 p-6 shadow-lg rounded-xl transition-all mobile:bottom-0 mobile:top-auto mobile:translate-y-0 mobile:rounded-b-none mobile:max-w-none">
                    {title && (
                        <DialogPrimitive.Title className="text-lg font-semibold mb-4">
                            {title}
                        </DialogPrimitive.Title>
                    )}
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
