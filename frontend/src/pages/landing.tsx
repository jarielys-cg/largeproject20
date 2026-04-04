import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import LoginModal from '../components/forms/loginModal'
import Navbar from '../components/Navbar'
import { UtensilsCrossed, ShoppingBag, Scissors, Car, Home, MoreHorizontal } from 'lucide-react'
import Restaurant from '../assets/images/Restaurant.jpg'
import Barber from '../assets/images/Barber.jpg'
import HomeServices from '../assets/images/HomeServices.jpg'
import Shopping from '../assets/images/Shopping.jpg'
import AutoServices from '../assets/images/AutoServices.jpg'

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


const CATEGORIES = [
  { label: 'Restaurants', icon: UtensilsCrossed },
  { label: 'Shopping', icon: ShoppingBag },
  { label: 'Beauty & Spas', icon: Scissors },
  { label: 'Automotive', icon: Car },
  { label: 'Home Services', icon: Home },
  { label: 'More', icon: MoreHorizontal },
]

function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => setIsModalOpen(true)} />

      {/* Hero section */}
      <div className="relative w-full h-130 overflow-hidden">

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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl">

            {/* Animated label */}
            <div className="mb-6 text-center">
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
            <div className="flex w-full bg-white rounded-lg overflow-hidden shadow-xl">
              <input
                type="text"
                placeholder="things to do, restaurants, nail salons..."
                className="flex-1 px-5 py-4 text-sm focus:outline-none text-gray-700"
              />
              <div className="w-px bg-gray-200 my-3" />
              <input
                type="text"
                placeholder="Location"
                className="w-44 px-5 py-4 text-sm focus:outline-none text-gray-700"
              />
              <button className="bg-bm-coral hover:bg-bm-coral-dark px-6 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>

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
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-bm-dark mb-8 text-center">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.label}
                  onClick={() => navigate(`/search?category=${cat.label}`)}
                  className="flex flex-col items-center gap-4 p-8 border border-gray-200 rounded-xl hover:border-bm-coral hover:text-bm-coral transition-all group bg-white"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                    <Icon
                      size={28}
                      className="text-bm-coral"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-bm-coral">
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>


      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Landing