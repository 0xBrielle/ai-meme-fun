'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { TemplateGrid, TemplatePreview } from '@/components/templates'
import { mockTemplates } from '@/data/mock-templates'
import { Template } from '@/types'
import { showToast } from '@/lib/toast'

export default function TemplatesPage() {
    const router = useRouter()
    const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)

    const handleTemplateClick = (template: Template) => {
        setSelectedTemplate(template)
    }

    const handleUseTemplate = (template: Template) => {
        showToast.success(`Starting generation with ${template.name}`)
        setSelectedTemplate(null)
        router.push('/') // Redirect to Create with template (logic for this in later phases)
    }

    return (
        <div className="py-8 space-y-8">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold">Templates</h1>
                <p className="text-gray-400">Choose a style or face-swap effect to get started.</p>
            </div>

            <TemplateGrid
                templates={mockTemplates}
                onTemplateClick={handleTemplateClick}
            />

            <TemplatePreview
                template={selectedTemplate}
                isOpen={!!selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
                onUse={handleUseTemplate}
            />
        </div>
    )
}
