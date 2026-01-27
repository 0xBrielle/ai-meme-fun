'use client'

import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export interface PlatformInfo {
    isWeb: boolean
    isIOS: boolean
    isAndroid: boolean
    isNative: boolean // true if running in Capacitor
    isMobile: boolean // true if mobile viewport (even on web)
    platform: 'web' | 'ios' | 'android'
}

export function usePlatform(): PlatformInfo {
    const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
        isWeb: true,
        isIOS: false,
        isAndroid: false,
        isNative: false,
        isMobile: false,
        platform: 'web',
    })

    useEffect(() => {
        const isNative = Capacitor.isNativePlatform()
        const platform = Capacitor.getPlatform() as 'web' | 'ios' | 'android'
        const isMobile =
            window.innerWidth < 640 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        setPlatformInfo({
            isWeb: platform === 'web',
            isIOS: platform === 'ios',
            isAndroid: platform === 'android',
            isNative,
            isMobile,
            platform,
        })

        // Update on resize
        const handleResize = () => {
            setPlatformInfo((prev) => ({
                ...prev,
                isMobile: window.innerWidth < 640,
            }))
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return platformInfo
}

// For server components or initial render
export function getInitialPlatform(): PlatformInfo {
    return {
        isWeb: true,
        isIOS: false,
        isAndroid: false,
        isNative: false,
        isMobile: false,
        platform: 'web',
    }
}
