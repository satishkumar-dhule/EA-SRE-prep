interface ProgressBarProps {
  total: number
  completed: number
  bookmarked: number
}

export function ProgressBar({ total, completed, bookmarked }: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress: {completed}/{total} completed</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-500">⭐ {bookmarked} bookmarked</p>
    </div>
  )
}
