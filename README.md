# 📚 Interview Prep Library - Static Site

A modern, production-ready static site for interview preparation with progress tracking, bookmarking, search, and more.

**Live Demo:** [https://satishkumar-dhule.github.io/EA-SRE-prep/](https://satishkumar-dhule.github.io/EA-SRE-prep/)

## ✨ Features

- ✅ **Progress Tracking** - Mark questions complete, auto-saved to browser
- ✅ **Bookmarking System** - Star important questions, filter by bookmarks
- ✅ **Real-time Search** - Instant search across all content
- ✅ **Dark Mode** - Toggle theme with preference saved
- ✅ **Statistics Dashboard** - Track completion, bookmarks, time spent
- ✅ **Export Progress** - Download progress as JSON for backup
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **GitHub Actions** - Auto-deploy on push
- ✅ **Auto-Content Processing** - MD files auto-converted to questions
- ✅ **Privacy First** - All data stored locally, no server uploads

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Then enable GitHub Pages in Settings → Pages → Source: GitHub Actions

Your site will be live at: `https://[username].github.io/[repo-name]`

## 📁 Project Structure

```
├── app/                          # Next.js pages
│   ├── page.tsx                 # Home page
│   ├── guides/[slug]/page.tsx   # Guide pages
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components (7)
│   ├── Question.tsx             # Question card
│   ├── SearchBar.tsx            # Search input
│   ├── ProgressBar.tsx          # Progress display
│   ├── Stats.tsx                # Statistics
│   ├── ExportButton.tsx         # Export feature
│   ├── BookmarkedOnly.tsx       # Filter button
│   └── DarkModeToggle.tsx       # Dark mode
├── lib/
│   └── guides.ts                # Guide data
├── scripts/
│   └── generate-site.js         # MD processor
├── .github/workflows/           # GitHub Actions
│   ├── deploy.yml               # Build & deploy
│   └── update-content.yml       # Auto-rebuild on content change
├── docs/                        # Documentation
│   ├── QUICKSTART.md            # 5-minute setup
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── FEATURES.md              # Features list
│   ├── START_HERE.md            # Overview
│   └── ...
├── public/                      # Static assets
├── out/                         # Built site (generated)
├── content/                     # Processed MD (generated)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── next.config.js               # Next.js config
└── postcss.config.js            # PostCSS config
```

## 📊 Performance

- Home page: 2.15 KB
- Guide page: 13.3 KB
- Total gzipped: ~50KB per guide
- Load time: <1 second
- Search: Instant (client-side)
- Works offline after first load

## 🔐 Privacy & Security

✅ All data stored locally in browser
✅ No server uploads
✅ No tracking or analytics
✅ Completely private study sessions
✅ Export anytime for backup

## 📱 Device Support

✅ Desktop - Full features
✅ Tablet - Optimized layout
✅ Mobile - Touch-friendly
✅ Offline - Works without internet

## 🔧 Build Commands

```bash
npm run dev       # Local development
npm run build     # Build for production
npm run generate  # Process MD files
npm run export    # Export static site
```

## 📝 Add New Content

Create `MyTopic_Visual_Interview_Prep.md` in root:

```markdown
### 1. Question Title
Question content...

### 2. Another Question
More content...
```

Push to main - auto-deployed!

## 📚 Documentation

| File | Purpose |
|------|---------|
| [docs/START_HERE.md](docs/START_HERE.md) | Quick overview |
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | 5-minute setup |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guide |
| [docs/FEATURES.md](docs/FEATURES.md) | Complete features |
| [docs/README_SETUP.md](docs/README_SETUP.md) | Technical details |
| [docs/SETUP_COMPLETE.md](docs/SETUP_COMPLETE.md) | Full overview |
| [docs/VERIFICATION_CHECKLIST.md](docs/VERIFICATION_CHECKLIST.md) | Verification |
| [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) | Summary |

## 🎯 Study Workflow

1. Visit home page
2. Select a guide
3. Search for topics
4. Read questions
5. Bookmark important ones
6. Mark as completed
7. Check progress
8. Export when done

## 🚨 Troubleshooting

**Site not deploying?**
- Check GitHub Actions tab
- Verify `.github/workflows/deploy.yml` exists
- Ensure GitHub Pages is enabled

**Content not updating?**
- Check `.github/workflows/update-content.yml`
- Ensure MD files in root directory
- Verify naming: `*_Visual_Interview_Prep.md`

**Local build failing?**
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 💡 Pro Tips

1. Bookmark strategically - Mark questions you struggle with
2. Use search - Find related topics quickly
3. Export regularly - Backup your progress
4. Review bookmarks - Focus on weak areas
5. Track time - Monitor study sessions
6. Dark mode - Study comfortably at night
7. Mobile friendly - Study on the go
8. Share progress - Export and share with others

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **UI:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Storage:** Browser localStorage

## 📄 License

MIT

## 🤝 Contributing

Feel free to fork, modify, and deploy your own version!

---

**Ready to ace your next interview! 🎉**
