'use client'

import Link from 'next/link'
import { Plus, User } from 'lucide-react'
import { Button } from '@/components/ui'
import { TopNav } from './top-nav'

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-surface-200/80 backdrop-blur-md border-b border-surface-50 safe-top">
            <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        AI MEME
                    </span>
                </Link>

                <TopNav />

                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-surface-50 rounded-full px-3 py-1 border border-surface-200">
                        <span className="text-sm font-medium text-yellow-500 mr-2">⭐</span>
                        <span className="text-sm font-bold">47</span>
                        <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto w-auto hover:bg-transparent">
                            <Plus size={16} className="text-primary hover:text-primary-400" />
                        </Button>
                    </div>

                    <Link href="/settings">
                        <Button variant="ghost" size="sm" className="p-2 rounded-full bg-surface-50 border border-surface-200">
                            <User size={18} />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
