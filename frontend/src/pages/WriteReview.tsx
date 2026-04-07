import { useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import { Search, Store } from 'lucide-react'
import api from '../lib/axios'
import review from '../assets/images/OnlineReview.png'
import type { Business } from "../types"

interface WriteReviewProps {
  onLoginClick?: () => void
}

const WriteReview = ({ onLoginClick }: WriteReviewProps) => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [results, setResults] = useState<Business[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    try {
      const res = await api.get(`/businesses/search?q=${search}&location=${location}`)
      setResults(res.data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={onLoginClick} />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-start justify-between gap-12">

          {/* Left side */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a business to review</h1>
            <p className="text-gray-500 mb-6">Turn your everyday spots into standout reviews.</p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-lg overflow-hidden mb-10">
              <input
                type="text"
                placeholder="Try lunch, yoga studio, plumber"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 text-sm focus:outline-none"
              />
              <div className="w-px bg-gray-200 my-2" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-36 px-4 py-3 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-bm-coral hover:bg-bm-coral-dark px-4 flex items-center justify-center transition-colors"
              >
                <Search size={16} color="white" strokeWidth={2.5} />
              </button>
            </form>

            {/* Results */}
            <div>
              {!searched ? (
                // Initial empty state
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-bm-gray rounded-full flex items-center justify-center mb-4">
                    <Store size={32} className="text-bm-coral" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Find a business to review</h2>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Search for a business above to get started.
                  </p>
                </div>
              ) : loading ? (
                // Loading state
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-bm-coral border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gray-400 text-sm">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                // Results
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Results for "{search}"
                  </h2>
                  <div className="space-y-3">
                    {results.map(biz => (
                      <div
                        key={biz._id}
                        onClick={() => navigate(`/review/${biz._id}`)}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-bm-coral hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Business image or fallback */}
                          {biz.photo ? (
                            <img
                              src={biz.photo}
                              alt={biz.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-bm-gray rounded-lg flex items-center justify-center shrink-0">
                              <Store size={24} className="text-bm-coral" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-bm-coral">{biz.name}</p>
                            <p className="text-sm text-gray-500">{biz.category} · {biz.city}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-sm font-medium text-bm-coral border border-bm-coral px-4 py-1.5 rounded-lg hover:bg-bm-coral hover:text-white transition-colors shrink-0"
                        >
                          Write a Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // No results
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl mb-4">👍⭐</div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">No results found</h2>
                  <p className="text-gray-400 text-sm max-w-xs">
                    We couldn't find any businesses matching "{search}". Try a different search.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side illustration */}
          <div className="hidden lg:block w-72 shrink-0">
            <img
              src= {review}
              alt="Write a review"
              className="w-full"
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default WriteReview