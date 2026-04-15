import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import { getImageUrl } from '../../utils/imageUrl'

interface Props {
  photos: string[]
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (url: string) => void
}

const BusinessPhotos = ({ photos, uploading, onUpload, onRemove }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Photos</h2>
        <label className="flex items-center gap-2 text-sm text-bm-coral border border-bm-coral px-3 py-1.5 rounded-lg hover:bg-bm-coral hover:text-white transition-colors cursor-pointer">
          <Plus size={14} />
          {uploading ? 'Uploading...' : 'Add Photo'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
        </label>
      </div>
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={getImageUrl(photo)} alt="" className="w-full h-full object-cover rounded-xl" />
              <button
                onClick={() => onRemove(photo)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl hover:border-bm-coral hover:bg-red-50 transition-colors cursor-pointer group">
          <ImagePlus size={28} className="text-gray-300 group-hover:text-bm-coral mb-2" />
          <p className="text-sm text-gray-400 group-hover:text-bm-coral">Click to add photos</p>
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onUpload} />
        </label>
      )}
    </div>
  )
}

export default BusinessPhotos