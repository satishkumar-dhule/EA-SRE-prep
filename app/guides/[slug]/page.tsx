'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getGuideBySlug } from '../../../lib/guides'
import { Question } from '../../../components/Question'
import { SearchBar } from '../../../components/SearchBar'
import { ProgressBar } from '../../../components/ProgressBar'
import { Stats } from '../../../components/Stats'
import { ExportButton } from '../../../components/ExportButton'
import { BookmarkedOnly } from '../../../components/BookmarkedOnly'

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug)
  const [searchTerm, setSearchTerm] = useState('')
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)

  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed-${params.slug}`)
    const savedBookmarked = localStorage.getItem(`bookmarked-${params.slug}`)
    
    if (savedCompleted) setCompleted(new Set(JSON.parse(savedCompleted)))
    if (savedBookmarked) setBookmarked(new Set(JSON.parse(savedBookmarked)))
  }, [params.slug])

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Guide not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  let filteredQuestions = guide.questions.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showBookmarkedOnly) {
    filteredQuestions = filteredQuestions.filter(q => bookmarked.has(q.id))
  }

  const toggleCompleted = (id: string) => {
    const newCompleted = new Set(completed)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
    }
    setCompleted(newCompleted)
    localStorage.setItem(`completed-${params.slug}`, JSON.stringify(Array.from(newCompleted)))
  }

  const toggleBookmarked = (id: string) => {
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id)
    } else {
      newBookmarked.add(id)
    }
    setBookmarked(newBookmarked)
    localStorage.setItem(`bookmarked-${params.slug}`, JSON.stringify(Array.from(newBookmarked)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to guides
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">{guide.emoji} {guide.title}</h1>
          <p className="text-gray-600 mb-6">{guide.description}</p>
          
          <ProgressBar 
            total={guide.questions.length}
            completed={completed.size}
            bookmarked={bookmarked.size}
          />

          <div className="mt-8">
            <Stats slug={params.slug} total={guide.questions.length} />
          </div>

          <div className="mt-8 flex gap-4">
            <ExportButton slug={params.slug} guideName={guide.title} />
            <BookmarkedOnly value={showBookmarkedOnly} onChange={setShowBookmarkedOnly} />
          </div>
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Question
              key={question.id}
              question={question}
              isCompleted={completed.has(question.id)}
              isBookmarked={bookmarked.has(question.id)}
              onToggleCompleted={() => toggleCompleted(question.id)}
              onToggleBookmarked={() => toggleBookmarked(question.id)}
            />
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
