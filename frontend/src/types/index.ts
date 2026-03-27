// src/types/index.ts
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
  email: string
  password: string
  zipCode: string
  role: 'user' | 'business_owner'
}