'use client'

import { useCallback } from 'react'

export function useVideoPicker() {
    const pickVideo = useCallback(async (): Promise<string | null> => {
        return new Promise((resolve) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'video/*'
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (!file) return resolve(null)
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = () => resolve(null)
                reader.readAsDataURL(file)
            }
            // Reset value so the same file can be re-picked
            input.value = ''
            input.click()
        })
    }, [])

    return { pickVideo }
}
