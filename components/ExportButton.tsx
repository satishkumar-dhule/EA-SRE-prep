'use client'

interface ExportButtonProps {
  slug: string
  guideName: string
}

export function ExportButton({ slug, guideName }: ExportButtonProps) {
  const handleExport = () => {
    const completed = JSON.parse(localStorage.getItem(`completed-${slug}`) || '[]')
    const bookmarked = JSON.parse(localStorage.getItem(`bookmarked-${slug}`) || '[]')

    const data = {
      guide: guideName,
      exportedAt: new Date().toISOString(),
      completed,
      bookmarked,
      completionRate: `${Math.round((completed.length / 100) * 100)}%`,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}-progress.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      📥 Export Progress
    </button>
  )
}
