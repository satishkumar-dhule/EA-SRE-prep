# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` - site is live!

### 2. Deploy to GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Go to repo Settings → Pages → set source to "GitHub Actions"

Your site will be live at: `https://[username].github.io/[repo-name]`

## ✨ Features Ready to Use

### Progress Tracking
- ✅ Mark questions as completed
- 📊 See progress percentage
- 💾 Auto-saved to browser

### Bookmarking
- ⭐ Bookmark important questions
- 🔍 Filter to bookmarked only
- 📌 Quick access to favorites

### Search
- 🔎 Real-time search
- 🏷️ Filter by content
- ⚡ Instant results

### Dark Mode
- 🌙 Toggle in top-right
- 💾 Preference saved
- 👁️ Easy on eyes

### Export Progress
- 📥 Download as JSON
- 💾 Backup your data
- 📋 Share with others

### Statistics
- 📊 Completed count
- ⭐ Bookmarked count
- ⏱️ Time spent tracking

## 📝 Add New Content

### Create New Guide
1. Create file: `MyTopic_Visual_Interview_Prep.md`
2. Format questions:
```markdown
### 1. Question Title
Question content here...

### 2. Another Question
More content...
```
3. Push to main - auto-deployed!

### Update Existing Guide
1. Edit the MD file
2. Push to main
3. Auto-deployed within minutes

## 🎯 Customization

### Change Site Title
Edit `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your description',
}
```

### Add Guide to Sidebar
Edit `lib/guides.ts` - add to `guides` array

### Change Colors
Edit `app/globals.css` and `tailwind.config.js`

## 📊 Project Structure

```
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── guides/[slug]/     # Guide pages
│   └── globals.css        # Styles
├── components/            # React components
│   ├── Question.tsx       # Question card
│   ├── SearchBar.tsx      # Search
│   ├── ProgressBar.tsx    # Progress
│   ├── Stats.tsx          # Statistics
│   ├── ExportButton.tsx   # Export
│   ├── BookmarkedOnly.tsx # Filter
│   └── DarkModeToggle.tsx # Dark mode
├── lib/                   # Utilities
│   └── guides.ts          # Guide data
├── scripts/               # Build scripts
│   └── generate-site.js   # MD processor
├── .github/workflows/     # GitHub Actions
│   ├── deploy.yml         # Deploy
│   └── update-content.yml # Auto-process
└── out/                   # Built site
```

## 🚀 Build Commands

```bash
npm run dev       # Local development
npm run build     # Build for production
npm run generate  # Process MD files
npm run export    # Export static site
```

## 🔧 Troubleshooting

### Site not deploying?
1. Check GitHub Actions tab
2. Verify `.github/workflows/deploy.yml` exists
3. Enable GitHub Pages in Settings

### Content not updating?
1. Ensure MD files in root directory
2. File naming: `*_Visual_Interview_Prep.md`
3. Check GitHub Actions logs

### Local build failing?
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 📱 Features by Device

### Desktop
- Full-featured interface
- Keyboard shortcuts ready
- Large displays optimized

### Mobile
- Touch-friendly buttons
- Responsive layout
- Offline support

### Tablet
- Optimized spacing
- Touch gestures
- Landscape support

## 🎓 Study Tips

1. **Start with basics** - Build foundation
2. **Use bookmarks** - Mark important questions
3. **Track progress** - See improvement
4. **Export regularly** - Backup data
5. **Review bookmarks** - Focus on weak areas
6. **Dark mode** - Study comfortably
7. **Mobile** - Study on the go

## 📈 Performance

- ⚡ ~50KB gzipped per guide
- 🔍 Instant search
- 💾 Instant progress restore
- 🌍 Works offline
- 📦 No server needed

## 🔐 Privacy

- 🔒 All data stored locally
- 🛡️ No server uploads
- 📊 No tracking
- ✅ Completely private

## 🎯 Next Steps

1. ✅ Run `npm run dev`
2. ✅ Test locally
3. ✅ Push to GitHub
4. ✅ Enable GitHub Pages
5. ✅ Share your site!

## 📚 Learn More

- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [FEATURES.md](FEATURES.md) - Complete features list
- [README_SETUP.md](README_SETUP.md) - Technical setup

## 💬 Support

- Check GitHub Actions for build errors
- Review logs in `.github/workflows/`
- Verify file structure matches docs

---

**Ready to go! Start with `npm run dev` and enjoy! 🎉**
