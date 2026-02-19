'use client'

import * as React from 'react'
import { Header } from './header'
import { BottomTabs } from './bottom-tabs'

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-[#F7F7F5] text-[#1A1A1A] overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto pt-14 pb-0 w-full max-w-3xl mx-auto px-0">
                {children}
            </main>
            <BottomTabs />
        </div>
    )
}
