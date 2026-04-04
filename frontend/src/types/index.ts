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
  zipCode: string
  // Step 3
  ownerName: string
  email: string
  password: string
}

export interface BusinessSignUpModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface LoginForm {
  email: string
  password: string
}

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}