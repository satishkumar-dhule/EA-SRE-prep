#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const OUTPUT_DIR = path.join(__dirname, '../out');
const CONTENT_DIR = path.join(__dirname, '../content');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read all guides
const guides = [];
const contentFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

contentFiles.forEach((file, index) => {
  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  const questions = parseQuestions(body);
  const slug = file.replace('.md', '');

  guides.push({
    slug,
    title: data.title || file.replace('.md', ''),
    emoji: data.emoji || '📚',
    description: data.description || '',
    questionCount: questions.length,
    topics: data.topics || [],
    questions,
  });
});

// Generate HTML files
generateIndex(guides);
guides.forEach(guide => generateGuidePage(guide));

console.log(`✅ Built ${guides.length} guides with ${guides.reduce((sum, g) => sum + g.questions.length, 0)} questions`);

function parseQuestions(content) {
  const questions = [];
  const lines = content.split('\n');
  let currentQuestion = null;
  let currentContent = [];

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(\d+)\.\s+(.+)$/);

    if (headingMatch) {
      if (currentQuestion) {
        currentQuestion.content = currentContent.join('\n').trim();
        questions.push(currentQuestion);
      }

      currentQuestion = {
        id: `q-${questions.length + 1}`,
        title: headingMatch[2],
      };
      currentContent = [];
    } else if (currentQuestion) {
      currentContent.push(line);
    }
  }

  if (currentQuestion) {
    currentQuestion.content = currentContent.join('\n').trim();
    questions.push(currentQuestion);
  }

  return questions;
}

function generateIndex(guides) {
  const guideLinks = guides
    .map(
      (g) => `
    <div class="guide-card">
      <h2>${g.emoji} ${g.title}</h2>
      <p>${g.description}</p>
      <div class="guide-meta">
        <span>📊 ${g.questionCount}+ questions</span>
        <span>🏷️ ${g.topics.join(', ')}</span>
      </div>
      <a href="guides/${g.slug}.html" class="btn">Start Learning</a>
    </div>
  `
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Prep Library</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 {
      text-align: center;
      color: white;
      margin-bottom: 10px;
      font-size: 3em;
    }
    .subtitle {
      text-align: center;
      color: rgba(255,255,255,0.9);
      margin-bottom: 50px;
      font-size: 1.2em;
    }
    .guides {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }
    .guide-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .guide-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.3);
    }
    .guide-card h2 {
      font-size: 1.5em;
      margin-bottom: 15px;
      color: #333;
    }
    .guide-card p {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    .guide-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 0.9em;
      color: #888;
    }
    .btn {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.3s;
      font-weight: 600;
    }
    .btn:hover { background: #764ba2; }
    .footer {
      background: rgba(255,255,255,0.1);
      color: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
    }
    @media (max-width: 768px) {
      h1 { font-size: 2em; }
      .guides { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📚 Interview Prep Library</h1>
    <p class="subtitle">Comprehensive visual guides for technical interviews</p>
    <div class="guides">
      ${guideLinks}
    </div>
    <div class="footer">
      <p>✨ All progress is saved locally in your browser • No server uploads • Completely private</p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
}

function generateGuidePage(guide) {
  const questionsHtml = guide.questions
    .map(
      (q) => `
    <div class="question-card">
      <div class="question-header" onclick="toggleQuestion(this)">
        <h3>${q.title}</h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="question-content" style="display:none;">
        <div class="question-body">${marked(q.content)}</div>
        <div class="question-actions">
          <button onclick="toggleComplete('${q.id}', this)" class="btn-small">✓ Mark Complete</button>
          <button onclick="toggleBookmark('${q.id}', this)" class="btn-small">⭐ Bookmark</button>
        </div>
      </div>
    </div>
  `
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .back-link {
      display: inline-block;
      color: #667eea;
      text-decoration: none;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .back-link:hover { text-decoration: underline; }
    h1 {
      font-size: 2.5em;
      color: #333;
      margin-bottom: 10px;
    }
    .description {
      color: #666;
      font-size: 1.1em;
      margin-bottom: 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .stat {
      background: #f0f0f0;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value {
      font-size: 1.8em;
      font-weight: bold;
      color: #667eea;
    }
    .stat-label {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .search-box {
      margin-bottom: 30px;
    }
    .search-box input {
      width: 100%;
      padding: 15px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1em;
      transition: border-color 0.3s;
    }
    .search-box input:focus {
      outline: none;
      border-color: #667eea;
    }
    .questions {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .question-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s;
    }
    .question-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .question-header {
      padding: 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9f9f9;
      transition: background 0.3s;
    }
    .question-header:hover {
      background: #f0f0f0;
    }
    .question-header h3 {
      color: #333;
      font-size: 1.1em;
      flex: 1;
    }
    .toggle-icon {
      color: #999;
      transition: transform 0.3s;
    }
    .question-card.open .toggle-icon {
      transform: rotate(180deg);
    }
    .question-content {
      padding: 20px;
      border-top: 1px solid #eee;
    }
    .question-body {
      color: #555;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .question-body code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
    .question-body pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 10px 0;
    }
    .question-body pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    .question-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    .btn-small {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #667eea;
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }
    .btn-small:hover {
      background: #764ba2;
    }
    .btn-small.completed {
      background: #4caf50;
    }
    .btn-small.bookmarked {
      background: #ff9800;
    }
    @media (max-width: 768px) {
      h1 { font-size: 1.8em; }
      .stats { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="index.html" class="back-link">← Back to guides</a>
      <h1>${guide.emoji} ${guide.title}</h1>
      <p class="description">${guide.description}</p>
      <div class="stats">
        <div class="stat">
          <div class="stat-value" id="completed-count">0</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat">
          <div class="stat-value" id="bookmarked-count">0</div>
          <div class="stat-label">Bookmarked</div>
        </div>
        <div class="stat">
          <div class="stat-value" id="progress-percent">0%</div>
          <div class="stat-label">Progress</div>
        </div>
      </div>
    </div>

    <div class="search-box">
      <input type="text" id="search" placeholder="🔍 Search questions..." onkeyup="filterQuestions()">
    </div>

    <div class="questions" id="questions">
      ${questionsHtml}
    </div>
  </div>

  <script>
    const GUIDE_SLUG = '${guide.slug}';
    const TOTAL_QUESTIONS = ${guide.questions.length};

    function toggleQuestion(header) {
      const card = header.parentElement;
      card.classList.toggle('open');
      const content = card.querySelector('.question-content');
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }

    function toggleComplete(id, btn) {
      const completed = JSON.parse(localStorage.getItem(\`completed-\${GUIDE_SLUG}\`) || '[]');
      const index = completed.indexOf(id);
      if (index > -1) {
        completed.splice(index, 1);
        btn.classList.remove('completed');
      } else {
        completed.push(id);
        btn.classList.add('completed');
      }
      localStorage.setItem(\`completed-\${GUIDE_SLUG}\`, JSON.stringify(completed));
      updateStats();
    }

    function toggleBookmark(id, btn) {
      const bookmarked = JSON.parse(localStorage.getItem(\`bookmarked-\${GUIDE_SLUG}\`) || '[]');
      const index = bookmarked.indexOf(id);
      if (index > -1) {
        bookmarked.splice(index, 1);
        btn.classList.remove('bookmarked');
      } else {
        bookmarked.push(id);
        btn.classList.add('bookmarked');
      }
      localStorage.setItem(\`bookmarked-\${GUIDE_SLUG}\`, JSON.stringify(bookmarked));
      updateStats();
    }

    function updateStats() {
      const completed = JSON.parse(localStorage.getItem(\`completed-\${GUIDE_SLUG}\`) || '[]');
      const bookmarked = JSON.parse(localStorage.getItem(\`bookmarked-\${GUIDE_SLUG}\`) || '[]');
      document.getElementById('completed-count').textContent = completed.length;
      document.getElementById('bookmarked-count').textContent = bookmarked.length;
      document.getElementById('progress-percent').textContent = Math.round((completed.length / TOTAL_QUESTIONS) * 100) + '%';

      // Update button states
      completed.forEach(id => {
        const btn = document.querySelector(\`button[onclick*="\${id}"]\`);
        if (btn && btn.textContent.includes('Complete')) btn.classList.add('completed');
      });
      bookmarked.forEach(id => {
        const btn = document.querySelector(\`button[onclick*="\${id}"]\`);
        if (btn && btn.textContent.includes('Bookmark')) btn.classList.add('bookmarked');
      });
    }

    function filterQuestions() {
      const search = document.getElementById('search').value.toLowerCase();
      const cards = document.querySelectorAll('.question-card');
      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const body = card.querySelector('.question-body').textContent.toLowerCase();
        card.style.display = title.includes(search) || body.includes(search) ? 'block' : 'none';
      });
    }

    // Initialize on load
    window.addEventListener('load', updateStats);
  </script>
</body>
</html>`;

  const guideDir = path.join(OUTPUT_DIR, 'guides');
  if (!fs.existsSync(guideDir)) {
    fs.mkdirSync(guideDir, { recursive: true });
  }

  fs.writeFileSync(path.join(guideDir, `${guide.slug}.html`), html);
}
