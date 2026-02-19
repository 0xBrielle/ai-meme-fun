'use client'

import Link from 'next/link'
import { Plus, User } from 'lucide-react'
import { Button } from '@/components/ui'
import { TopNav } from './top-nav'

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 safe-top">
            <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center">
                    <span className="text-lg font-semibold tracking-tight text-white">
                        AI FUN MEME
                    </span>
                </Link>

                <TopNav />

                <div className="flex items-center space-x-3">
                    <div className="flex items-center glass rounded-full px-3 py-1 border border-white/5">
                        <span className="text-xs font-semibold text-white/40 mr-1.5">CREDITS</span>
                        <span className="text-sm font-semibold text-white">47</span>
                        <Button variant="ghost" size="sm" className="ml-1.5 p-0 h-auto w-auto hover:bg-transparent">
                            <Plus size={14} className="text-white/60 hover:text-white" />
                        </Button>
                    </div>

                    <Link href="/settings">
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full glass border border-white/10 flex items-center justify-center">
                            <User size={18} className="text-white/60" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
