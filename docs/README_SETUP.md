# Interview Prep Site - Setup Guide

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`

### Build & Deploy
```bash
npm run build
npm run export
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with guide listing
│   ├── guides/[slug]/     # Dynamic guide pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Question.tsx       # Question card with expand/collapse
│   ├── SearchBar.tsx      # Search functionality
│   └── ProgressBar.tsx    # Progress tracking display
├── lib/                   # Utilities
│   └── guides.ts          # Guide parsing & data
├── scripts/               # Build scripts
│   └── generate-site.js   # MD file processor
├── content/               # Generated content (auto-created)
├── .github/workflows/     # GitHub Actions
│   ├── deploy.yml         # Build & deploy to Pages
│   └── update-content.yml # Auto-process MD changes
└── public/                # Static assets
```

## ✨ Features

### Local Progress Tracking
- Completion status saved per guide
- Bookmarks for important questions
- Automatic localStorage persistence
- Last visited guide remembered

### Automatic Content Processing
- All `.md` files auto-converted to questions
- Frontmatter extraction (title, emoji, topics)
- Questions parsed from `### N. Title` format
- Content directory auto-generated

### GitHub Actions
- **Deploy workflow**: Builds & deploys to GitHub Pages on push
- **Update workflow**: Auto-processes new/modified MD files
- Static export for fast CDN delivery

### Search & Filter
- Real-time search across questions
- Filter by title or content
- Instant results

## 🔧 Configuration

### Add New Guide
1. Create `YourGuide_Visual_Interview_Prep.md` in root
2. Format questions as:
```markdown
### 1. Question Title
Question content here...

### 2. Another Question
More content...
```
3. Push to main - GitHub Actions auto-processes it

### Customize Emoji
Edit `scripts/generate-site.js` `getEmojiForFile()` function

### Customize Styling
Edit `app/globals.css` and `tailwind.config.js`

## 📊 Low-Hanging Fruits

### Already Implemented
✅ Local progress tracking (localStorage)
✅ Bookmark system
✅ Search functionality
✅ Responsive design
✅ Auto-deploy to GitHub Pages
✅ Auto-content processing

### Easy Additions
- Dark mode toggle
- Export progress as JSON
- Share bookmarks via URL
- Statistics dashboard
- Difficulty levels
- Time tracking per question

## 🚀 Deploy to GitHub Pages

1. Enable GitHub Pages in repo settings
2. Set source to "GitHub Actions"
3. Push to main - auto-deploys!

## 📝 Environment Variables

Optional for custom base path:
```bash
BASE_PATH=/interview-prep  # For non-root deployment
```

## 🎯 Performance

- Static export (no server needed)
- ~50KB gzipped per guide
- Instant search with client-side filtering
- localStorage for instant progress restore
