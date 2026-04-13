import { useState } from 'react'
import { MapPin, Phone, Globe, Pencil, Plus } from 'lucide-react'

interface Props {
  address?: string
  phone?: string
  websiteLink?: string
  onSaveWebsite: (url: string) => void
  onSavePhone: (phone: string) => void
  onSaveAddress: (address: string) => void
}

const BusinessInfo = ({ address, phone, websiteLink, onSaveWebsite, onSavePhone, onSaveAddress }: Props) => {
  const [editingWebsite, setEditingWebsite] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [tempWebsite, setTempWebsite] = useState(websiteLink ?? '')
  const [tempPhone, setTempPhone] = useState(phone ?? '')
  const [tempAddress, setTempAddress] = useState(address ?? '')

  return (
    <div className="w-72 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Business Info</h2>

        <div className="space-y-4">

          {/* Address */}
          <div className="pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1">
                <MapPin size={18} className="text-bm-coral shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Address</p>
                  {address ? (
                    <p className="text-sm text-gray-500">{address}</p>
                    ) : (
                    <p className="text-sm text-bm-coral">Add your address</p>
                    )}
                </div>
              </div>
              <button
                onClick={() => { setTempAddress(address ?? ''); setEditingAddress(true) }}
                className="text-gray-400 hover:text-bm-coral transition-colors shrink-0"
              >
                <Pencil size={14} />
              </button>
            </div>
            {editingAddress && (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  value={tempAddress}
                  onChange={e => setTempAddress(e.target.value)}
                  placeholder="123 Main St, Orlando, FL"
                  className="w-full border border-bm-coral rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { onSaveAddress(tempAddress); setEditingAddress(false) }}
                    className="flex-1 bg-bm-coral text-white text-xs px-3 py-1.5 rounded-lg hover:bg-bm-coral-dark transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingAddress(false)}
                    className="flex-1 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1">
                <Phone size={18} className="text-bm-coral shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Call</p>
                  {phone ? (
                    <a href={`tel:${phone}`} className="text-sm text-bm-coral hover:underline">{phone}</a>
                  ) : (
                    <p className="text-sm text-bm-coral">Add your phone number</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setTempPhone(phone ?? ''); setEditingPhone(true) }}
                className="text-gray-400 hover:text-bm-coral transition-colors shrink-0"
              >
                <Pencil size={14} />
              </button>
            </div>
            {editingPhone && (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  value={tempPhone}
                  onChange={e => setTempPhone(e.target.value)}
                  placeholder="(407) 555-0100"
                  className="w-full border border-bm-coral rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { onSavePhone(tempPhone); setEditingPhone(false) }}
                    className="flex-1 bg-bm-coral text-white text-xs px-3 py-1.5 rounded-lg hover:bg-bm-coral-dark transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPhone(false)}
                    className="flex-1 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1">
                <Globe size={18} className="text-bm-coral shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Website</p>
                  {websiteLink ? (
                    <a
                      href={websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-bm-coral hover:underline break-all"
                    >
                      {websiteLink}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">Add a link to your business website</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setTempWebsite(websiteLink ?? ''); setEditingWebsite(true) }}
                className="text-gray-400 hover:text-bm-coral transition-colors shrink-0"
              >
                {websiteLink ? <Pencil size={14} /> : <Plus size={14} />}
              </button>
            </div>
            {editingWebsite && (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  value={tempWebsite}
                  onChange={e => setTempWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  type="url"
                  className="w-full border border-bm-coral rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { onSaveWebsite(tempWebsite); setEditingWebsite(false) }}
                    className="flex-1 bg-bm-coral text-white text-xs px-3 py-1.5 rounded-lg hover:bg-bm-coral-dark transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingWebsite(false)}
                    className="flex-1 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default BusinessInfo