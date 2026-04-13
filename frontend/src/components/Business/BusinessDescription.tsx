import { useState } from 'react'
import { Pencil } from 'lucide-react'

interface Props {
  description?: string
  onSave: (description: string) => void
}

const BusinessDescription = ({ description, onSave }: Props) => {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(description ?? '')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">About this Business</h2>
        <button
          onClick={() => { setTemp(description ?? ''); setEditing(true) }}
          className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-600 hover:border-bm-coral hover:text-bm-coral px-3 py-1.5 rounded-lg transition-colors"
        >
          <Pencil size={13} />
          {description ? 'Edit' : 'Add'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={temp}
            onChange={e => setTemp(e.target.value)}
            placeholder="Tell customers about your business..."
            rows={4}
            className="w-full px-3 py-2 border border-bm-coral rounded-lg text-sm focus:outline-none resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => { onSave(temp); setEditing(false) }}
              className="flex-1 bg-bm-coral text-white text-sm px-3 py-2 rounded-lg hover:bg-bm-coral-dark transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 border border-gray-200 text-gray-600 text-sm px-3 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 leading-relaxed">
          {description || 'No description yet. Add one to tell customers about your business.'}
        </p>
      )}
    </div>
  )
}

export default BusinessDescription