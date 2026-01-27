'use client'

import * as React from 'react'
import { X, Upload, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import imageCompression from 'browser-image-compression'

interface ImageUploadProps {
    value: string | null
    onChange: (value: string | null) => void
    disabled?: boolean
    className?: string
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image too large. Please use an image under 10MB.')
                return
            }

            // Compress image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 2048,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(file, options)

            // Convert to data URL
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange(reader.result as string)
            }
            reader.readAsDataURL(compressedFile)
        } catch (error) {
            console.error('Image upload error:', error)
        }
    }

    const handleRemove = () => {
        onChange(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // TODO: Add Capacitor Camera integration for native mobile builds
    const triggerUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={cn('w-full', className)}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={disabled}
            />

            {!value ? (
                <div
                    onClick={triggerUpload}
                    className={cn(
                        'flex flex-col items-center justify-center w-full aspect-square md:aspect-video rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 cursor-pointer hover:bg-surface-100 transition-colors',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <div className="p-4 rounded-full bg-surface-200 mb-4">
                        <Upload size={32} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">Tap to upload image (optional)</span>
                </div>
            ) : (
                <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border border-surface-200">
                    <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
                    <Button
                        onClick={handleRemove}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                        <X size={20} />
                    </Button>
                </div>
            )}
        </div>
    )
}
