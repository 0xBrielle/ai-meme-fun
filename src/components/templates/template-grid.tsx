'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Template } from '@/types'
import { TemplateCard } from './template-card'
import { TEMPLATE_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TemplateGridProps {
    templates: Template[]
    onTemplateClick: (template: Template) => void
}

export function TemplateGrid({ templates, onTemplateClick }: TemplateGridProps) {
    const [activeCategory, setActiveCategory] = React.useState('trending')
    const [searchQuery, setSearchQuery] = React.useState('')

    const filteredTemplates = templates.filter((t) => {
        const matchesCategory = activeCategory === 'trending' || t.category === activeCategory
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="space-y-6">
            {/* Search & Filters */}
            <div className="space-y-4 sticky top-16 z-30 bg-background/80 backdrop-blur-md py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>

                <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
                    {TEMPLATE_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.value)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0',
                                activeCategory === cat.value
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-surface-50 border-surface-200 text-gray-400 hover:border-primary-400'
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        onClick={onTemplateClick}
                    />
                ))}

                {filteredTemplates.length === 0 && (
                    <div className="col-span-full py-12 text-center space-y-2">
                        <p className="text-gray-400">No templates found for "{searchQuery}"</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('trending') }}
                            className="text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
