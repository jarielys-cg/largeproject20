import { UtensilsCrossed, ShoppingBag, Scissors, Car, Home } from 'lucide-react'
import { useNavigate } from 'react-router'

const CATEGORIES = [
  { label: 'Restaurants', icon: UtensilsCrossed },
  { label: 'Shopping', icon: ShoppingBag },
  { label: 'Beauty & Spas', icon: Scissors },
  { label: 'Automotive', icon: Car },
  { label: 'Home Services', icon: Home },
]

const Categories = () => {
    const navigate = useNavigate()
    return(
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-bm-dark mb-8 text-center">Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.label}
                  onClick={() => navigate(`/search?category=${cat.label}`)}
                  className="flex basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)] flex-col items-center gap-4 p-8 border border-gray-200 rounded-xl hover:border-bm-coral hover:text-bm-coral transition-all group bg-white"
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
    )
}

export default Categories