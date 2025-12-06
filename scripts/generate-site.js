const fs = require('fs')
const path = require('path')

// Create content directory if it doesn't exist
const contentDir = path.join(process.cwd(), 'content')
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}

// Copy all MD files from root to content directory
const rootDir = process.cwd()
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.md') && f !== 'README.md')

files.forEach(file => {
  const source = path.join(rootDir, file)
  const dest = path.join(contentDir, file)
  
  // Read the file and add frontmatter if not present
  let content = fs.readFileSync(source, 'utf-8')
  
  if (!content.startsWith('---')) {
    const title = file.replace('.md', '').replace(/_/g, ' ')
    const emoji = getEmojiForFile(file)
    const topics = extractTopics(content)
    
    const frontmatter = `---
title: "${title}"
emoji: "${emoji}"
description: "Interview preparation guide for ${title}"
topics: [${topics.map(t => `"${t}"`).join(', ')}]
---

`
    content = frontmatter + content
  }
  
  fs.writeFileSync(dest, content)
  console.log(`✓ Processed ${file}`)
})

function getEmojiForFile(filename) {
  const emojiMap = {
    'EA_SRE_3': '🚀',
    'Terraform': '🏗️',
    'Kubernetes': '☸️',
    'Networking': '🌐',
    'Observability': '📊',
    'Operating_System': '💻',
    'Python_DevOps': '🐍',
    'System_Design': '🎨',
  }
  
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (filename.includes(key)) return emoji
  }
  return '📚'
}

function extractTopics(content) {
  const topics = new Set()
  const lines = content.split('\n')
  
  for (const line of lines) {
    if (line.match(/^##\s+/)) {
      const topic = line.replace(/^##\s+/, '').trim()
      if (topic && !topic.includes('###')) {
        topics.add(topic.substring(0, 30))
      }
    }
  }
  
  return Array.from(topics).slice(0, 5)
}

console.log('✅ Site generation complete!')
