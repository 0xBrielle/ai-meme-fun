'use client'

import * as React from 'react'
import { Header } from './header'
import { BottomTabs } from './bottom-tabs'

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />

            <main className="flex-1 pt-16 pb-20 md:pb-0 px-4 max-w-7xl mx-auto w-full">
                {children}
            </main>

            <BottomTabs />
        </div>
    )
}
