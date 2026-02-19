'use client'

import Link from 'next/link'
import { Plus, User } from 'lucide-react'
import { Button } from '@/components/ui'
import { TopNav } from './top-nav'

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 safe-top"
            style={{
                background: 'rgba(247,247,245,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            <div className="flex items-center justify-between h-14 px-5 max-w-3xl mx-auto w-full">
                <span className="text-[15px] font-semibold tracking-tight text-[#1A1A1A]">
                    AI Fun Meme
                </span>

                <div className="flex items-center gap-2">
                    {/* Credits pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/8 shadow-sm">
                        <span className="text-[11px] text-[#999] font-medium uppercase tracking-wider">Credits</span>
                        <span className="text-[13px] font-semibold text-[#1A1A1A]">47</span>
                    </div>

                    {/* Profile */}
                    <Link href="/settings">
                        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                            <User size={15} className="text-white" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    )
}
