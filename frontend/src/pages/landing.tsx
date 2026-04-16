import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import Restaurant from '../assets/images/Restaurant.jpg'
import Barber from '../assets/images/Barber.jpg'
import HomeServices from '../assets/images/HomeServices.jpg'
import Shopping from '../assets/images/Shopping.jpg'
import AutoServices from '../assets/images/AutoServices.jpg'
import Categories from '../components/Categories'

const HERO_IMAGES = [
  Restaurant,
  Barber,
  HomeServices,
  Shopping,
 AutoServices,
]

const HERO_LABELS = [
  { title: 'Grab some grub', tag: 'Restaurants' },
  { title: 'Look your best', tag: 'Beauty & Spas' },
  { title: 'Find a contractor', tag: 'Home Services' },
  { title: 'Shop local', tag: 'Shopping' },
  { title: 'Smooth shifting again', tag: 'Auto Services' },
]

interface LandingProps{
  onLoginClick?: () => void
}

function Landing({ onLoginClick}: LandingProps) {
  const [current, setCurrent] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedSearch = searchQuery.trim()
    const trimmedLocation = locationQuery.trim()

    if (!trimmedSearch && !trimmedLocation) {
      navigate('/dashboard')
      return
    }

    const params = new URLSearchParams()
    if (trimmedSearch) {
      params.set('q', trimmedSearch)
    }
    if (trimmedLocation) {
      params.set('location', trimmedLocation)
    }
    navigate(`/search?${params.toString()}`)
  }

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={onLoginClick} />

      {/* Hero section */}
      <div className="relative w-full h-130 overflow-hidden z-0">

        {/* Sliding images */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
          <div className="w-full max-w-3xl">

            {/* Animated label */}
            <div className="mb-6 text-center pointer-events-none">
              {HERO_LABELS.map((label, i) => (
                <h1
                  key={i}
                  className="text-5xl font-bold text-white transition-all duration-700 absolute"
                  style={{
                    opacity: i === current ? 1 : 0,
                    transform: i === current ? 'translateY(0)' : 'translateY(10px)',
                    position: i === current ? 'relative' : 'absolute',
                  }}
                >
                  {label.title}
                </h1>
              ))}
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative z-10 flex w-full bg-white rounded-lg overflow-hidden shadow-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="things to do, restaurants, nail salons..."
                className="flex-1 px-5 py-4 text-sm focus:outline-none text-gray-700"
              />
              <div className="w-px bg-gray-200 my-3" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Location"
                className="w-44 px-5 py-4 text-sm focus:outline-none text-gray-700"
              />
              <button type="submit" className="bg-bm-coral hover:bg-bm-coral-dark px-6 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>

            {/* Animated tag pill */}
            <div className="mt-4 flex justify-start">
              {HERO_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/search?category=${label.tag}`)}
                  className="flex items-center gap-2 bg-bm-coral text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-700"
                  style={{
                    opacity: i === current ? 1 : 0,
                    position: i === current ? 'relative' : 'absolute',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  {label.tag}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>

      </div>

      {/* Categories section */}
        <Categories />
    </div>
  )
}

export default Landing