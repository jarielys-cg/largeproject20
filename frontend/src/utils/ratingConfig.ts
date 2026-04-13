export const RATING_CONFIG = [
  { label: 'Not good', color: '#E03B3B' },
  { label: 'Could be better', color: '#E03B3B' },
  { label: 'OK', color: '#E8A030' },
  { label: 'Good', color: '#F2A44A' },
  { label: 'Great!', color: '#F2A44A' },
]

export const getRatingColor = (rating: number): string => {
  return RATING_CONFIG[rating - 1]?.color ?? '#d1d5db'
}

export const getRatingLabel = (rating: number): string => {
  return RATING_CONFIG[rating - 1]?.label ?? ''
}