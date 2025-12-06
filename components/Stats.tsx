'use client'

import { useEffect, useState } from 'react'

interface StatsProps {
  slug: string
  total: number
}

export function Stats({ slug }: StatsProps) {
  const [stats, setStats] = useState({ completed: 0, bookmarked: 0, timeSpent: 0 })

  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem(`completed-${slug}`) || '[]').length
    const bookmarked = JSON.parse(localStorage.getItem(`bookmarked-${slug}`) || '[]').length
    const timeSpent = parseInt(localStorage.getItem(`time-${slug}`) || '0')

    setStats({ completed, bookmarked, timeSpent })
  }, [slug])

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h`
  }

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        <p className="text-sm text-gray-600">Completed</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-2xl font-bold text-yellow-600">{stats.bookmarked}</p>
        <p className="text-sm text-gray-600">Bookmarked</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-2xl font-bold text-blue-600">{formatTime(stats.timeSpent)}</p>
        <p className="text-sm text-gray-600">Time Spent</p>
      </div>
    </div>
  )
}
