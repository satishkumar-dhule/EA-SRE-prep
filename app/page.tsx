'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { guides } from '../lib/guides'
import { DarkModeToggle } from '../components/DarkModeToggle'

export default function Home() {
  const [lastVisited, setLastVisited] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    setLastVisited(localStorage.getItem('lastVisited'))
    
    // Calculate progress for each guide
    const progressMap: Record<string, number> = {}
    guides.forEach(guide => {
      const completed = JSON.parse(localStorage.getItem(`completed-${guide.slug}`) || '[]')
      progressMap[guide.slug] = Math.round((completed.length / guide.questionCount) * 100)
    })
    setProgress(progressMap)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <DarkModeToggle />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📚 Interview Prep Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Comprehensive visual guides for technical interviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className={`p-6 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 ${
                lastVisited === guide.slug
                  ? 'bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-600'
                  : 'bg-white dark:bg-gray-800'
              }`}
              onClick={() => localStorage.setItem('lastVisited', guide.slug)}
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{guide.emoji} {guide.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{guide.description}</p>
              
              {progress[guide.slug] > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{progress[guide.slug]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${progress[guide.slug]}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>📊 {guide.questionCount}+ questions</p>
                <p>🏷️ {guide.topics.join(', ')}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎯 Quick Start</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✅ Select a guide from above</li>
            <li>✅ Your progress is automatically saved locally</li>
            <li>✅ Use the search to find specific topics</li>
            <li>✅ Bookmark questions for later review</li>
            <li>✅ Export your progress as JSON</li>
            <li>✅ Toggle dark mode with the moon icon</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
