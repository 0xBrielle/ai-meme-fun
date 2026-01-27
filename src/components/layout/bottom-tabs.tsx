'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon, Wand2, LayoutGrid, Image as ImageIcon, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
    { id: 'create', label: 'Create', href: '/', icon: Wand2 },
    { id: 'templates', label: 'Templates', href: '/templates', icon: LayoutGrid },
    { id: 'gallery', label: 'Gallery', href: '/gallery', icon: ImageIcon },
]

export function BottomTabs() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-200 border-t border-surface-50 safe-bottom md:hidden">
            <div className="flex justify-around items-center h-16">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
                            )}
                        >
                            <Icon size={20} />
                            <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
