export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'business_owner'
  isVerified: boolean
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface SignUpForm {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  zipCode: string
  isBusinessOwner: boolean
}

export interface BusinessForm {
  // Step 1
  businessName: string
  category: string
  phone: string
  // Step 2
  address: string
  city: string
  state: string
  zipCode: string
  // Step 3
  ownerName: string
  email: string
  password: string
}

export interface BusinessSignUpModalProps {
  isOpen: boolean
  onClose: () => void
  skipAccountStep?: boolean 
  onSuccess?: () => void
}

export interface LoginForm {
  email: string
  password: string
  isBusinessOwner: boolean
}

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  defaultBusinessOwner?: boolean
  onBusinessSignUp?: () => void 
}

export interface Business {
  _id: string
  name: string
  phone?: string        
  address?: string      
  city?: string         
  state?: string        
  zipCode?: string      
  category: string[]
  description?: string  
  image?: string[]     
  websiteLink?: string 
  averageReviewScore?: number 
}

export interface Review {
  _id: string
  businessId: string
  userId: string
  rating: number
  review: string
  createdAt: string
}

export interface Owner {
  _id: string
  firstName: string
  lastName: string
  username: string
}