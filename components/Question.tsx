'use client'

import { useState } from 'react'
import { marked } from 'marked'

interface QuestionProps {
  question: {
    id: string
    title: string
    content: string
  }
  isCompleted: boolean
  isBookmarked: boolean
  onToggleCompleted: () => void
  onToggleBookmarked: () => void
}

export function Question({
  question,
  isCompleted,
  isBookmarked,
  onToggleCompleted,
  onToggleBookmarked,
}: QuestionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`bg-white rounded-lg shadow p-6 transition-all ${
      isCompleted ? 'border-l-4 border-green-500' : ''
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            {question.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleBookmarked}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isBookmarked
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isBookmarked ? '⭐' : '☆'}
          </button>
          <button
            onClick={onToggleCompleted}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isCompleted ? '✓' : '○'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: marked(question.content),
            }}
          />
        </div>
      )}
    </div>
  )
}
