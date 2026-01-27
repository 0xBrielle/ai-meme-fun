import { supabaseAdmin } from './supabase'

const BUCKET_NAME = 'generations'

export interface UploadResult {
    success: boolean
    url?: string
    path?: string
    error?: string
}

/**
 * Upload an image to Supabase Storage
 * @param imageData - Base64 string or Blob
 * @param folder - Optional folder path (e.g., 'user-123')
 */
export async function uploadImage(
    imageData: string | Blob,
    folder?: string
): Promise<UploadResult> {
    try {
        // Generate unique filename
        const filename = `${Math.random().toString(36).substring(7)}-${Date.now()}.png`
        const path = folder ? `${folder}/${filename}` : filename

        // Convert base64 to blob if needed
        let blob: Blob
        if (typeof imageData === 'string') {
            // Remove data URL prefix if present
            const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')
            const binaryString = atob(base64)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }
            blob = new Blob([bytes], { type: 'image/png' })
        } else {
            blob = imageData
        }

        // Upload to Supabase
        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(path, blob, {
                contentType: 'image/png',
                upsert: false,
            })

        if (error) {
            throw error
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path)

        return {
            success: true,
            url: urlData.publicUrl,
            path: data.path,
        }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        }
    }
}

/**
 * Delete an image from storage
 */
export async function deleteImage(path: string): Promise<boolean> {
    try {
        const { error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .remove([path])

        return !error
    } catch {
        return false
    }
}
