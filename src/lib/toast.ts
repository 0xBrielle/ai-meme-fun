import { toast } from 'sonner'

export const showToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast(message),
    loading: (message: string) => toast.loading(message),
}

export const showError = (message: string) => toast.error(message)
