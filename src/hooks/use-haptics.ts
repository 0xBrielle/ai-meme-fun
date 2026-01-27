'use client'

import { useCallback } from 'react'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { usePlatform } from './use-platform'

export function useHaptics() {
    const { isNative } = usePlatform()

    const impact = useCallback(
        async (style: 'light' | 'medium' | 'heavy' = 'light') => {
            if (!isNative) return

            const styleMap = {
                light: ImpactStyle.Light,
                medium: ImpactStyle.Medium,
                heavy: ImpactStyle.Heavy,
            }

            await Haptics.impact({ style: styleMap[style] })
        },
        [isNative]
    )

    const notification = useCallback(
        async (type: 'success' | 'warning' | 'error') => {
            if (!isNative) return

            const typeMap = {
                success: NotificationType.Success,
                warning: NotificationType.Warning,
                error: NotificationType.Error,
            }

            await Haptics.notification({ type: typeMap[type] })
        },
        [isNative]
    )

    const selection = useCallback(async () => {
        if (!isNative) return
        await Haptics.selectionStart()
    }, [isNative])

    return { impact, notification, selection }
}
