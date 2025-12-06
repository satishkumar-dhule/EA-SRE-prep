'use client'

interface BookmarkedOnlyProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function BookmarkedOnly({ value, onChange }: BookmarkedOnlyProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        value
          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      ⭐ Bookmarked Only {value && '✓'}
    </button>
  )
}
