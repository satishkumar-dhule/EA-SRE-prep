# Local Development Guide

## Quick Start

### 1. Build and Serve Locally
```bash
npm run dev
```

This will:
- Generate content from MD files
- Build static HTML files
- Start a local server at `http://localhost:3000`

### 2. Just Serve (if already built)
```bash
npm run serve
```

### 3. Just Build (without serving)
```bash
npm run build
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Build + serve locally (recommended) |
| `npm run build` | Generate content and build HTML |
| `npm run generate` | Only generate content from MD files |
| `npm run serve` | Start local server on port 3000 |

## Development Workflow

### 1. Add New Interview Guide
Create a new MD file in the root directory:
```bash
# Example: MyTopic_Visual_Interview_Prep.md
### 1. Question Title
Question content here...

### 2. Another Question
More content...
```

### 2. Build and Test Locally
```bash
npm run dev
```

### 3. Open in Browser
Visit: `http://localhost:3000`

### 4. Test Features
- ✅ Click on questions to expand/collapse
- ✅ Search for questions
- ✅ Mark questions as complete
- ✅ Bookmark important questions
- ✅ Check progress stats

### 5. Push to GitHub
```bash
git add .
git commit -m "Add new interview guide"
git push origin main
```

## Customization

### Change Port
```bash
PORT=3001 npm run serve
```

### Change Output Directory
Edit `scripts/build-site.js`:
```javascript
const OUTPUT_DIR = path.join(__dirname, '../out');
```

### Modify Styling
Edit the CSS in `scripts/build-site.js` in the HTML template sections.

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
PORT=3001 npm run serve

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Fails
```bash
# Clean and rebuild
rm -rf out/
npm run build
```

### Dependencies Missing
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## File Structure During Development

```
project/
├── out/                    # Generated static files
│   ├── index.html         # Home page
│   └── guides/
│       ├── guide1.html
│       ├── guide2.html
│       └── ...
├── content/               # Generated from MD files
│   ├── guide1.md
│   ├── guide2.md
│   └── ...
├── scripts/
│   ├── generate-site.js   # MD processor
│   ├── build-site.js      # HTML generator
│   └── serve.js           # Local server
└── *.md                   # Source interview guides
```

## Performance Tips

1. **First build is slower** - Subsequent builds are faster
2. **Large guides** - May take a few seconds to process
3. **Search is instant** - Client-side filtering, no server calls
4. **Progress is instant** - Saved to localStorage immediately

## Testing Checklist

Before pushing to GitHub:

- [ ] `npm run dev` builds without errors
- [ ] Server starts on `http://localhost:3000`
- [ ] Home page loads with all guides
- [ ] Can click on a guide
- [ ] Questions expand/collapse
- [ ] Search works
- [ ] Can mark questions complete
- [ ] Can bookmark questions
- [ ] Progress updates
- [ ] Refresh page - progress persists

## Browser DevTools

### Check localStorage
```javascript
// In browser console
localStorage.getItem('completed-guide-slug')
localStorage.getItem('bookmarked-guide-slug')
```

### Clear All Progress
```javascript
// In browser console
localStorage.clear()
```

## Common Issues

### Questions Not Showing
- Check MD file format: `### N. Title`
- Ensure MD file is in root directory
- Run `npm run build` again

### Search Not Working
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Progress Not Saving
- Check if localStorage is enabled
- Check browser console for errors
- Try a different browser

## Next Steps

1. ✅ Run `npm run dev`
2. ✅ Test locally
3. ✅ Add your content
4. ✅ Push to GitHub
5. ✅ Site auto-deploys!

---

**Happy developing! 🚀**
