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
const renderer = new marked.Renderer();

// Override code block rendering to preserve mermaid blocks
renderer.codeblock = function(code, language) {
  if (language === 'mermaid') {
    return `<div class="mermaid">\n${code}\n</div>`;
  }
  return `<pre><code class="language-${language}">${code}</code></pre>`;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer,
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
  // Create questions data as JSON for JavaScript
  const questionsData = guide.questions.map((q, idx) => ({
    id: q.id,
    number: idx + 1,
    title: q.title,
    content: marked(q.content),
  }));
  
  const questionsJson = JSON.stringify(questionsData).replace(/"/g, '&quot;');

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
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    
    /* Header */
    .header {
      background: white;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .header-left {
      flex: 1;
      min-width: 200px;
    }
    .back-link {
      display: inline-block;
      color: #667eea;
      text-decoration: none;
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 0.9em;
    }
    .back-link:hover { color: #764ba2; }
    h1 {
      font-size: 2em;
      color: #1a1a1a;
      margin-bottom: 5px;
      font-weight: 800;
    }
    .guide-info {
      color: #666;
      font-size: 0.9em;
    }
    
    /* Stats */
    .header-stats {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    .stat-badge {
      background: linear-gradient(135deg, #667eea15, #764ba215);
      padding: 12px 18px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #667eea30;
      min-width: 100px;
    }
    .stat-value {
      font-size: 1.5em;
      font-weight: 800;
      color: #667eea;
    }
    .stat-label {
      color: #666;
      font-size: 0.75em;
      margin-top: 4px;
      font-weight: 600;
    }
    
    /* Main Content */
    .main-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 20px;
    }
    
    /* Sidebar */
    .sidebar {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      height: fit-content;
      position: sticky;
      top: 20px;
      max-height: calc(100vh - 40px);
      overflow-y: auto;
    }
    .sidebar h3 {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 15px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .question-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .question-item {
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85em;
      transition: all 0.2s;
      border-left: 3px solid transparent;
      background: #f9f9f9;
      color: #666;
    }
    .question-item:hover {
      background: #f0f0f0;
      color: #333;
    }
    .question-item.active {
      background: #667eea;
      color: white;
      border-left-color: #764ba2;
      font-weight: 600;
    }
    .question-item.completed::before {
      content: '✓ ';
      color: #4caf50;
      font-weight: bold;
    }
    .question-item.bookmarked::after {
      content: ' ⭐';
      color: #ff9800;
    }
    
    /* Question Display */
    .question-display {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      min-height: 500px;
    }
    .question-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .question-number-badge {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 700;
      margin-bottom: 15px;
    }
    .question-title {
      font-size: 1.8em;
      color: #1a1a1a;
      font-weight: 700;
      line-height: 1.4;
    }
    
    /* Question Content */
    .question-content {
      margin-bottom: 30px;
    }
    .question-body {
      color: #444;
      line-height: 1.9;
      font-size: 1em;
    }
    .question-body h4, .question-body h5, .question-body h6 {
      margin-top: 20px;
      margin-bottom: 12px;
      color: #1a1a1a;
      font-weight: 700;
    }
    .question-body p {
      margin-bottom: 15px;
    }
    .question-body ul, .question-body ol {
      margin-left: 25px;
      margin-bottom: 15px;
    }
    .question-body li {
      margin-bottom: 8px;
    }
    .question-body code {
      background: #f5f5f5;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
      color: #d63384;
    }
    .question-body pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
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
      margin: 25px 0;
      background: #f9f9f9;
      padding: 25px;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    
    /* Actions */
    .question-actions {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
    }
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background: #667eea;
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95em;
      transition: all 0.3s;
      border: 2px solid #667eea;
    }
    .btn:hover {
      background: #764ba2;
      border-color: #764ba2;
      transform: translateY(-2px);
    }
    .btn.completed {
      background: #4caf50;
      border-color: #4caf50;
    }
    .btn.bookmarked {
      background: #ff9800;
      border-color: #ff9800;
    }
    
    /* Navigation */
    .navigation {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
    }
    .nav-btn {
      flex: 1;
      padding: 12px 20px;
      border: 2px solid #ddd;
      background: white;
      color: #667eea;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .nav-btn:hover:not(:disabled) {
      border-color: #667eea;
      background: #f9f9f9;
    }
    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: static;
        max-height: none;
      }
    }
    @media (max-width: 768px) {
      h1 { font-size: 1.5em; }
      .header { flex-direction: column; align-items: flex-start; }
      .question-display { padding: 25px; }
      .question-title { font-size: 1.4em; }
      .question-actions, .navigation { flex-direction: column; }
      .nav-btn { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <a href="index.html" class="back-link">← Back to guides</a>
        <h1>${guide.emoji} ${guide.title}</h1>
        <p class="guide-info">${guide.description}</p>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <div class="stat-value" id="completed-count">0</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-badge">
          <div class="stat-value" id="bookmarked-count">0</div>
          <div class="stat-label">Bookmarked</div>
        </div>
        <div class="stat-badge">
          <div class="stat-value" id="progress-percent">0%</div>
          <div class="stat-label">Progress</div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="sidebar">
        <h3>Questions</h3>
        <div class="question-list" id="question-list"></div>
      </div>

      <div class="question-display">
        <div class="question-header">
          <span class="question-number-badge" id="question-badge">Q 1 / ${guide.questions.length}</span>
          <h2 class="question-title" id="question-title"></h2>
        </div>
        <div class="question-content">
          <div class="question-body" id="question-body"></div>
        </div>
        <div class="question-actions">
          <button class="btn btn-complete" id="btn-complete" onclick="toggleComplete()">✓ Mark Complete</button>
          <button class="btn btn-bookmark" id="btn-bookmark" onclick="toggleBookmark()">⭐ Bookmark</button>
        </div>
        <div class="navigation">
          <button class="nav-btn" id="btn-prev" onclick="previousQuestion()">← Previous</button>
          <button class="nav-btn" id="btn-next" onclick="nextQuestion()">Next →</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const GUIDE_SLUG = '${guide.slug}';
    const QUESTIONS = ${JSON.stringify(questionsData)};
    let currentQuestion = 0;

    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: true, theme: 'default' });

    function loadQuestion(index) {
      if (index < 0 || index >= QUESTIONS.length) return;
      
      currentQuestion = index;
      const q = QUESTIONS[index];
      
      document.getElementById('question-badge').textContent = \`Q \${index + 1} / \${QUESTIONS.length}\`;
      document.getElementById('question-title').textContent = q.title;
      document.getElementById('question-body').innerHTML = q.content;
      
      // Update navigation buttons
      document.getElementById('btn-prev').disabled = index === 0;
      document.getElementById('btn-next').disabled = index === QUESTIONS.length - 1;
      
      // Update action buttons
      updateActionButtons();
      
      // Render mermaid diagrams
      setTimeout(() => mermaid.contentLoaded(), 100);
      
      // Highlight current question in sidebar
      document.querySelectorAll('.question-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }

    function nextQuestion() {
      if (currentQuestion < QUESTIONS.length - 1) {
        loadQuestion(currentQuestion + 1);
      }
    }

    function previousQuestion() {
      if (currentQuestion > 0) {
        loadQuestion(currentQuestion - 1);
      }
    }

    function toggleComplete() {
      const completed = JSON.parse(localStorage.getItem(\`completed-\${GUIDE_SLUG}\`) || '[]');
      const qId = QUESTIONS[currentQuestion].id;
      const index = completed.indexOf(qId);
      
      if (index > -1) {
        completed.splice(index, 1);
      } else {
        completed.push(qId);
      }
      
      localStorage.setItem(\`completed-\${GUIDE_SLUG}\`, JSON.stringify(completed));
      updateActionButtons();
      updateStats();
      updateSidebar();
    }

    function toggleBookmark() {
      const bookmarked = JSON.parse(localStorage.getItem(\`bookmarked-\${GUIDE_SLUG}\`) || '[]');
      const qId = QUESTIONS[currentQuestion].id;
      const index = bookmarked.indexOf(qId);
      
      if (index > -1) {
        bookmarked.splice(index, 1);
      } else {
        bookmarked.push(qId);
      }
      
      localStorage.setItem(\`bookmarked-\${GUIDE_SLUG}\`, JSON.stringify(bookmarked));
      updateActionButtons();
      updateStats();
      updateSidebar();
    }

    function updateActionButtons() {
      const completed = JSON.parse(localStorage.getItem(\`completed-\${GUIDE_SLUG}\`) || '[]');
      const bookmarked = JSON.parse(localStorage.getItem(\`bookmarked-\${GUIDE_SLUG}\`) || '[]');
      const qId = QUESTIONS[currentQuestion].id;
      
      const btnComplete = document.getElementById('btn-complete');
      const btnBookmark = document.getElementById('btn-bookmark');
      
      if (completed.includes(qId)) {
        btnComplete.classList.add('completed');
      } else {
        btnComplete.classList.remove('completed');
      }
      
      if (bookmarked.includes(qId)) {
        btnBookmark.classList.add('bookmarked');
      } else {
        btnBookmark.classList.remove('bookmarked');
      }
    }

    function updateStats() {
      const completed = JSON.parse(localStorage.getItem(\`completed-\${GUIDE_SLUG}\`) || '[]');
      const bookmarked = JSON.parse(localStorage.getItem(\`bookmarked-\${GUIDE_SLUG}\`) || '[]');
      const percent = Math.round((completed.length / QUESTIONS.length) * 100);
      
      document.getElementById('completed-count').textContent = completed.length;
      document.getElementById('bookmarked-count').textContent = bookmarked.length;
      document.getElementById('progress-percent').textContent = percent + '%';
    }

    function updateSidebar() {
      const completed = JSON.parse(localStorage.getItem(\`completed-\${GUIDE_SLUG}\`) || '[]');
      const bookmarked = JSON.parse(localStorage.getItem(\`bookmarked-\${GUIDE_SLUG}\`) || '[]');
      
      document.querySelectorAll('.question-item').forEach((item, i) => {
        const qId = QUESTIONS[i].id;
        item.classList.toggle('completed', completed.includes(qId));
        item.classList.toggle('bookmarked', bookmarked.includes(qId));
      });
    }

    function initSidebar() {
      const list = document.getElementById('question-list');
      QUESTIONS.forEach((q, i) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = \`Q\${i + 1}: \${q.title.substring(0, 30)}...\`;
        item.onclick = () => loadQuestion(i);
        list.appendChild(item);
      });
      updateSidebar();
    }

    // Initialize on load
    window.addEventListener('load', () => {
      initSidebar();
      loadQuestion(0);
      updateStats();
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
