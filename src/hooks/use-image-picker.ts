'use client'

import { useCallback } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { usePlatform } from './use-platform'
import imageCompression from 'browser-image-compression'
import { IMAGE_CONFIG } from '@/lib/constants'

export function useImagePicker() {
    const { isNative } = usePlatform()

    const compressImage = async (file: File): Promise<string> => {
        const compressed = await imageCompression(file, {
            maxSizeMB: IMAGE_CONFIG.MAX_FILE_SIZE_MB,
            maxWidthOrHeight: IMAGE_CONFIG.MAX_DIMENSION,
            useWebWorker: true,
        })

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(compressed)
        })
    }

    const pickImage = useCallback(async (): Promise<string | null> => {
        if (isNative) {
            try {
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.DataUrl,
                    source: CameraSource.Photos,
                })
                return image.dataUrl || null
            } catch (error: any) {
                if (error.message !== 'User cancelled photos app') {
                    throw error
                }
                return null
            }
        } else {
            // Web fallback
            return new Promise((resolve) => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                        const dataUrl = await compressImage(file)
                        resolve(dataUrl)
                    } else {
                        resolve(null)
                    }
                }
                input.click()
            })
        }
    }, [isNative])

    return { pickImage }
}
