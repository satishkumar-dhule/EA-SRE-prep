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

// Configure marked to handle code blocks properly
marked.setOptions({
  breaks: true,
  gfm: true,
});

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
    <a href="guides/${g.slug}.html" class="guide-card">
      <div class="guide-emoji">${g.emoji}</div>
      <h2>${g.title}</h2>
      <p>${g.description}</p>
      <div class="guide-stats">
        <span class="stat">📊 ${g.questionCount}+ Q</span>
        <span class="stat">🏷️ ${g.topics.length} topics</span>
      </div>
      <div class="guide-topics">${g.topics.slice(0, 3).map(t => `<span class="topic">${t}</span>`).join('')}</div>
    </a>
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
    html { scroll-behavior: smooth; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 60px 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      text-align: center;
      margin-bottom: 80px;
      animation: fadeInDown 0.8s ease;
    }
    h1 {
      color: white;
      font-size: 4em;
      margin-bottom: 15px;
      font-weight: 800;
      letter-spacing: -1px;
    }
    .subtitle {
      color: rgba(255,255,255,0.95);
      font-size: 1.3em;
      font-weight: 300;
      margin-bottom: 10px;
    }
    .tagline {
      color: rgba(255,255,255,0.8);
      font-size: 0.95em;
    }
    .guides {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 25px;
      margin-bottom: 60px;
    }
    .guide-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255,255,255,0.1);
      position: relative;
      overflow: hidden;
    }
    .guide-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    .guide-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
    }
    .guide-emoji {
      font-size: 3em;
      margin-bottom: 15px;
    }
    .guide-card h2 {
      font-size: 1.6em;
      margin-bottom: 12px;
      color: #1a1a1a;
      font-weight: 700;
    }
    .guide-card p {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
      font-size: 0.95em;
      flex-grow: 1;
    }
    .guide-stats {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 0.85em;
    }
    .stat {
      background: #f5f5f5;
      padding: 6px 12px;
      border-radius: 20px;
      color: #666;
      font-weight: 500;
    }
    .guide-topics {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .topic {
      background: linear-gradient(135deg, #667eea15, #764ba215);
      color: #667eea;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 600;
      border: 1px solid #667eea30;
    }
    .footer {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      color: white;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .footer p {
      font-size: 0.95em;
      line-height: 1.8;
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 768px) {
      h1 { font-size: 2.5em; }
      .subtitle { font-size: 1.1em; }
      .guides { grid-template-columns: 1fr; }
      body { padding: 40px 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 Interview Prep Library</h1>
      <p class="subtitle">Master technical interviews with comprehensive guides</p>
      <p class="tagline">✨ All progress saved locally • No tracking • Completely private</p>
    </div>
    <div class="guides">
      ${guideLinks}
    </div>
    <div class="footer">
      <p>🎯 <strong>${guides.length} Guides</strong> • <strong>${guides.reduce((sum, g) => sum + g.questionCount, 0)}+ Questions</strong> • <strong>100% Private</strong></p>
      <p style="margin-top: 15px; font-size: 0.9em; opacity: 0.9;">Built with ❤️ for interview preparation</p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
}

function generateGuidePage(guide) {
  const questionsHtml = guide.questions
    .map(
      (q, idx) => `
    <div class="question-card" data-id="${q.id}">
      <div class="question-header" onclick="toggleQuestion(this)">
        <div class="question-number">${idx + 1}</div>
        <h3>${q.title}</h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="question-content" style="display:none;">
        <div class="question-body">${marked(q.content)}</div>
        <div class="question-actions">
          <button onclick="toggleComplete('${q.id}', this)" class="btn-small btn-complete">✓ Mark Complete</button>
          <button onclick="toggleBookmark('${q.id}', this)" class="btn-small btn-bookmark">⭐ Bookmark</button>
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
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    .header {
      background: white;
      padding: 40px;
      border-radius: 16px;
      margin-bottom: 40px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      border-left: 5px solid #667eea;
    }
    .back-link {
      display: inline-block;
      color: #667eea;
      text-decoration: none;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 0.95em;
      transition: color 0.3s;
    }
    .back-link:hover { color: #764ba2; }
    h1 {
      font-size: 2.8em;
      color: #1a1a1a;
      margin-bottom: 12px;
      font-weight: 800;
    }
    .description {
      color: #666;
      font-size: 1.05em;
      margin-bottom: 25px;
      line-height: 1.6;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 25px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      width: 0%;
      transition: width 0.3s ease;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 20px;
    }
    .stat {
      background: linear-gradient(135deg, #667eea15, #764ba215);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #667eea30;
    }
    .stat-value {
      font-size: 2em;
      font-weight: 800;
      color: #667eea;
    }
    .stat-label {
      color: #666;
      font-size: 0.85em;
      margin-top: 8px;
      font-weight: 600;
    }
    .search-box {
      margin-bottom: 35px;
    }
    .search-box input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #ddd;
      border-radius: 12px;
      font-size: 1em;
      transition: all 0.3s;
      background: white;
    }
    .search-box input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .questions {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .question-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 4px solid #667eea;
    }
    .question-card:hover {
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
      transform: translateX(4px);
    }
    .question-card.open {
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }
    .question-header {
      padding: 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafafa;
      transition: background 0.3s;
      gap: 15px;
    }
    .question-header:hover {
      background: #f0f0f0;
    }
    .question-number {
      background: #667eea;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9em;
      flex-shrink: 0;
    }
    .question-header h3 {
      color: #1a1a1a;
      font-size: 1.1em;
      flex: 1;
      font-weight: 600;
    }
    .toggle-icon {
      color: #999;
      transition: transform 0.3s;
      font-size: 0.8em;
    }
    .question-card.open .toggle-icon {
      transform: rotate(180deg);
    }
    .question-content {
      padding: 25px;
      border-top: 1px solid #eee;
      background: #fafafa;
    }
    .question-body {
      color: #444;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .question-body h4, .question-body h5, .question-body h6 {
      margin-top: 15px;
      margin-bottom: 10px;
      color: #1a1a1a;
      font-weight: 600;
    }
    .question-body p {
      margin-bottom: 12px;
    }
    .question-body ul, .question-body ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    .question-body li {
      margin-bottom: 6px;
    }
    .question-body code {
      background: #f0f0f0;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
      color: #d63384;
    }
    .question-body pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 15px 0;
      border-left: 4px solid #667eea;
    }
    .question-body pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: 0.9em;
    }
    .mermaid {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    .question-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .btn-small {
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      background: #667eea;
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9em;
      transition: all 0.3s;
      border: 2px solid #667eea;
    }
    .btn-small:hover {
      background: #764ba2;
      border-color: #764ba2;
      transform: translateY(-2px);
    }
    .btn-small.completed {
      background: #4caf50;
      border-color: #4caf50;
    }
    .btn-small.bookmarked {
      background: #ff9800;
      border-color: #ff9800;
    }
    @media (max-width: 768px) {
      h1 { font-size: 2em; }
      .header { padding: 25px; }
      .stats { grid-template-columns: 1fr; }
      .question-header { flex-wrap: wrap; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="index.html" class="back-link">← Back to guides</a>
      <h1>${guide.emoji} ${guide.title}</h1>
      <p class="description">${guide.description}</p>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
      </div>
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

    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: true, theme: 'default' });

    function toggleQuestion(header) {
      const card = header.parentElement;
      card.classList.toggle('open');
      const content = card.querySelector('.question-content');
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
      
      // Re-render mermaid diagrams when content is shown
      if (content.style.display !== 'none') {
        setTimeout(() => mermaid.contentLoaded(), 100);
      }
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
      const percent = Math.round((completed.length / TOTAL_QUESTIONS) * 100);
      
      document.getElementById('completed-count').textContent = completed.length;
      document.getElementById('bookmarked-count').textContent = bookmarked.length;
      document.getElementById('progress-percent').textContent = percent + '%';
      document.getElementById('progress-fill').style.width = percent + '%';

      // Update button states
      completed.forEach(id => {
        const card = document.querySelector(\`[data-id="\${id}"]\`);
        if (card) {
          const btn = card.querySelector('.btn-complete');
          if (btn) btn.classList.add('completed');
        }
      });
      bookmarked.forEach(id => {
        const card = document.querySelector(\`[data-id="\${id}"]\`);
        if (card) {
          const btn = card.querySelector('.btn-bookmark');
          if (btn) btn.classList.add('bookmarked');
        }
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
    window.addEventListener('load', () => {
      updateStats();
      mermaid.contentLoaded();
    });
  </script>
</body>
</html>`;

  const guideDir = path.join(OUTPUT_DIR, 'guides');
  if (!fs.existsSync(guideDir)) {
    fs.mkdirSync(guideDir, { recursive: true });
  }

  fs.writeFileSync(path.join(guideDir, `${guide.slug}.html`), html);
}
