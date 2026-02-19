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
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
            <div
                className="flex items-center gap-1 px-2 py-2 rounded-full shadow-xl"
                style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                }}
            >
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all gap-0.5',
                                isActive
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'text-[#999] hover:text-[#1A1A1A]'
                            )}
                        >
                            <Icon size={18} />
                            <span className="text-[9px] uppercase tracking-widest font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
