import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['Restaurants', 'Shopping', 'Automotive', 'Home Services', 'Beauty & Spas']

interface Props {
  categories: string[]
  onAdd: (cat: string) => void
  onRemove: (cat: string) => void
}

const BusinessCategories = ({ categories, onAdd, onRemove }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Categories & Services</h2>
      <div className="space-y-3 mb-4">
        {categories.map(cat => (
          <div key={cat} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <span className="text-sm font-medium text-gray-700">{cat}</span>
            <button
              onClick={() => onRemove(cat)}
              className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(prev => !prev)}
          className="flex items-center gap-2 text-sm text-bm-coral border border-dashed border-bm-coral px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {CATEGORIES.filter(c => !categories.includes(c)).map(cat => (
              <button
                key={cat}
                onClick={() => { onAdd(cat); setShowDropdown(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors"
              >
                {cat}
              </button>
            ))}
            {CATEGORIES.filter(c => !categories.includes(c)).length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">All categories added</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessCategories