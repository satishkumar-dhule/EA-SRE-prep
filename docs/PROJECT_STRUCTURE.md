# Project Structure Guide

## Directory Organization

```
interview-prep-site/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page (/)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── guides/
│       └── [slug]/
│           ├── page.tsx         # Dynamic guide page (/guides/[slug])
│           └── layout.tsx       # Guide layout with static generation
│
├── components/                   # Reusable React Components
│   ├── Question.tsx             # Question card with expand/collapse
│   ├── SearchBar.tsx            # Search input component
│   ├── ProgressBar.tsx          # Progress visualization
│   ├── Stats.tsx                # Statistics dashboard
│   ├── ExportButton.tsx         # Export progress button
│   ├── BookmarkedOnly.tsx       # Bookmarked filter button
│   └── DarkModeToggle.tsx       # Dark mode toggle
│
├── lib/                          # Utilities & Data
│   └── guides.ts                # Guide data and helper functions
│
├── scripts/                      # Build Scripts
│   └── generate-site.js         # MD file processor
│
├── .github/
│   └── workflows/               # GitHub Actions
│       ├── deploy.yml           # Build & deploy to GitHub Pages
│       └── update-content.yml   # Auto-rebuild on content change
│
├── docs/                         # Documentation
│   ├── START_HERE.md            # Quick overview
│   ├── QUICKSTART.md            # 5-minute setup
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── FEATURES.md              # Features list
│   ├── README_SETUP.md          # Technical setup
│   ├── SETUP_COMPLETE.md        # Full overview
│   ├── VERIFICATION_CHECKLIST.md # Verification
│   ├── IMPLEMENTATION_SUMMARY.md # Summary
│   └── PROJECT_STRUCTURE.md     # This file
│
├── public/                       # Static Assets
│   └── .gitkeep                 # Placeholder
│
├── out/                          # Built Site (Generated)
│   ├── index.html               # Home page
│   ├── guides/                  # Guide pages
│   ├── _next/                   # Next.js assets
│   └── 404.html                 # 404 page
│
├── content/                      # Processed MD (Generated)
│   └── *.md                     # Auto-generated from root MD files
│
├── Configuration Files
│   ├── package.json             # Dependencies & scripts
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── next.config.js           # Next.js config
│   ├── postcss.config.js        # PostCSS config
│   ├── .gitignore               # Git ignore rules
│   └── .eslintrc.json           # ESLint config (optional)
│
└── Root Files
    ├── README.md                # Main project README
    ├── package-lock.json        # Dependency lock file
    └── next-env.d.ts            # Next.js TypeScript definitions
```

## Key Directories Explained

### `/app` - Next.js App Router
- Contains all page components and layouts
- Uses file-based routing
- `page.tsx` = route component
- `layout.tsx` = shared layout for route segment
- `globals.css` = global styles applied to all pages

### `/components` - Reusable Components
- 7 React components for UI
- All use `'use client'` for client-side features
- Handles progress tracking, bookmarks, search, etc.

### `/lib` - Utilities & Data
- `guides.ts` - Guide data structure and helpers
- Exported functions used by pages and components

### `/scripts` - Build Scripts
- `generate-site.js` - Processes MD files into structured data
- Runs during build process
- Extracts frontmatter and parses questions

### `/.github/workflows` - CI/CD
- `deploy.yml` - Main deployment workflow
  - Triggers on push to main
  - Builds and deploys to GitHub Pages
- `update-content.yml` - Content update workflow
  - Triggers on MD file changes
  - Auto-rebuilds and deploys

### `/docs` - Documentation
- 8 comprehensive guides
- Setup, deployment, features, troubleshooting
- Start with `START_HERE.md`

### `/public` - Static Assets
- Images, fonts, etc.
- Served at root path
- Currently empty (placeholder)

### `/out` - Built Site (Generated)
- Created by `npm run build`
- Static HTML/CSS/JS files
- Ready for deployment
- Don't commit to git

### `/content` - Processed MD (Generated)
- Created by `npm run generate`
- Processed MD files with frontmatter
- Used by build process
- Don't commit to git

## File Naming Conventions

### Pages
- `page.tsx` - Route component
- `layout.tsx` - Shared layout
- `[slug]` - Dynamic route segment

### Components
- `ComponentName.tsx` - PascalCase
- Exported as named exports
- Include TypeScript interfaces

### Utilities
- `functionName.ts` - camelCase
- Exported functions and types
- Include JSDoc comments

### Markdown Files
- `*_Visual_Interview_Prep.md` - Interview guides
- `*.md` - Documentation files
- Placed in root directory

## Build Process

1. **Generate** (`npm run generate`)
   - Reads MD files from root
   - Processes with `scripts/generate-site.js`
   - Creates `content/` directory
   - Extracts frontmatter and questions

2. **Build** (`npm run build`)
   - Runs Next.js build
   - Generates static pages
   - Creates `out/` directory
   - Optimizes assets

3. **Export** (`npm run export`)
   - Exports static site
   - Creates standalone HTML/CSS/JS
   - Ready for any static host

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   # Hot reload on file changes
   ```

2. **Add Content**
   ```bash
   # Create MyTopic_Visual_Interview_Prep.md
   # Format with ### N. Title
   # Push to main
   # Auto-deployed by GitHub Actions
   ```

3. **Customize**
   - Edit components in `/components`
   - Update styles in `app/globals.css`
   - Modify config in `tailwind.config.js`
   - Update guides in `lib/guides.ts`

## Important Notes

- ✅ `/out` and `/content` are generated - don't edit manually
- ✅ All components use TypeScript for type safety
- ✅ Tailwind CSS for styling (no CSS files needed)
- ✅ localStorage for progress tracking (no backend needed)
- ✅ GitHub Actions for CI/CD (no manual deployment)

## Next Steps

1. Read [START_HERE.md](START_HERE.md) for quick overview
2. Follow [QUICKSTART.md](QUICKSTART.md) for setup
3. Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
4. Review [FEATURES.md](FEATURES.md) for all features
