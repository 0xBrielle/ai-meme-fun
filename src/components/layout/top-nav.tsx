'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wand2, LayoutGrid, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
    { id: 'create', label: 'Create', href: '/', icon: Wand2 },
    { id: 'templates', label: 'Templates', href: '/templates', icon: LayoutGrid },
    { id: 'gallery', label: 'Gallery', href: '/gallery', icon: ImageIcon },
]

export function TopNav() {
    const pathname = usePathname()

    return (
        <nav className="hidden md:flex items-center space-x-6 ml-8">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                            'text-sm font-medium transition-colors hover:text-primary',
                            isActive ? 'text-primary' : 'text-gray-400'
                        )}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
