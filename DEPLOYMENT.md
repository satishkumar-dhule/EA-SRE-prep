# Deployment Guide

## 🚀 GitHub Pages Deployment (Recommended)

### Step 1: Enable GitHub Pages
1. Go to repo Settings → Pages
2. Set "Source" to "GitHub Actions"
3. Save

### Step 2: Push to Main
```bash
git add .
git commit -m "Initial commit: Interview prep site"
git push origin main
```

The GitHub Actions workflow will automatically:
- Install dependencies
- Process all MD files
- Build the static site
- Deploy to GitHub Pages

### Step 3: Access Your Site
Your site will be available at: `https://[username].github.io/[repo-name]`

## 📝 Adding New Content

### Add a New Interview Guide
1. Create a new MD file in the root: `MyTopic_Visual_Interview_Prep.md`
2. Format questions as:
```markdown
### 1. Question Title
Question content here with **bold**, *italic*, code blocks, etc.

### 2. Another Question
More content...
```

3. Push to main - GitHub Actions auto-processes it!

### Update Existing Guide
1. Edit the MD file
2. Push to main
3. Auto-deployed within minutes

## 🎨 Customization

### Change Site Title
Edit `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: 'Your Custom Title',
  description: 'Your description',
}
```

### Add New Guide to Sidebar
Edit `lib/guides.ts` and add to the `guides` array:
```ts
{
  slug: 'my-guide',
  title: 'My Guide Title',
  emoji: '🎯',
  description: 'Description here',
  questionCount: 100,
  topics: ['Topic1', 'Topic2'],
  questions: [],
}
```

### Customize Colors
Edit `tailwind.config.js` and `app/globals.css`

## 🔧 Local Development

### Setup
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run export
```

Output will be in `out/` directory

## 📊 Features Included

### ✅ Implemented
- Local progress tracking (localStorage)
- Bookmark system
- Search functionality
- Dark mode toggle
- Progress statistics
- Export progress as JSON
- Responsive design
- Auto-deploy to GitHub Pages
- Auto-content processing

### 🎯 Easy Additions
- Difficulty levels per question
- Time tracking per question
- Share progress via URL
- Statistics dashboard
- Spaced repetition algorithm
- Quiz mode
- Collaborative features

## 🚨 Troubleshooting

### Site not deploying?
1. Check GitHub Actions tab for errors
2. Ensure `.github/workflows/deploy.yml` exists
3. Verify GitHub Pages is enabled in Settings

### Content not updating?
1. Check `.github/workflows/update-content.yml`
2. Ensure MD files are in root directory
3. Verify file naming: `*_Visual_Interview_Prep.md`

### Local build failing?
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 📈 Performance

- Static export: ~50KB gzipped per guide
- Instant search with client-side filtering
- localStorage for instant progress restore
- No server needed - pure static files
- CDN-friendly for fast global delivery

## 🔐 Privacy

All progress is stored locally in browser localStorage:
- No data sent to servers
- No tracking or analytics
- Completely private study sessions
- Export anytime for backup

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly buttons
- Mobile-optimized search
- Works offline (after first load)

## 🎓 Study Tips

1. **Start with basics** - Build foundation first
2. **Use bookmarks** - Mark important questions
3. **Track progress** - See your improvement
4. **Export regularly** - Backup your progress
5. **Review bookmarks** - Focus on weak areas
