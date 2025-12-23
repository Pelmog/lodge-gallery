# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lodge Gallery is a React-based image gallery for browsing property photos of vacation lodges/apartments. It features a responsive sidebar navigation, thumbnail grids, and a lightbox for full-size image viewing.

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173

# Build
npm run build            # Production build to dist/

# Image Processing (run when images change)
npm run optimize         # Generate thumbnails + compress images
npm run manifest         # Regenerate src/data/lodges.ts from images
npm run prepare          # Run both optimize + manifest

# Preview production build locally
npm run preview
```

## Architecture

### Image Pipeline

1. **Source images** go in `public/images-opt/` (already optimized) - NOT in the project root
2. `scripts/optimize-images.js` - Converts source images to:
   - Full-size: max 1920px, 80% quality JPEG
   - Thumbnails: 400px square crops in `/thumb/` subdirectory
3. `scripts/generate-manifest.js` - Scans image folders, generates typed `src/data/lodges.ts`

### Data Flow

```
public/images-opt/{lodge-id}/         → optimize-images.js →
public/images-opt/{lodge-id}/thumb/   → generate-manifest.js →
src/data/lodges.ts                    → React components
```

### Key Files

- `src/data/lodges.ts` - Auto-generated manifest (DO NOT EDIT MANUALLY)
- `src/components/Sidebar.tsx` - Collapsible category navigation, responsive
- `src/components/Gallery.tsx` - Thumbnail grid using `image.thumb` paths
- `src/components/Lightbox.tsx` - Modal viewer using `image.full` paths
- `src/App.tsx` - Main layout with routing via react-router-dom

### Routing

- URLs map directly to lodge IDs: `/apt-9`, `/highland-lodge-1`, `/osprey`
- Root `/` redirects to first lodge
- Invalid lodge IDs redirect to first lodge
- `public/_redirects` handles SPA routing on Cloudflare Pages

## Deployment (Cloudflare Pages)

1. Connect GitHub repo to Cloudflare Pages
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy

The `_redirects` file ensures client-side routing works for direct URL access.

## Adding/Removing Images

1. Add/remove images in the original source folders (outside this project)
2. Copy updated folders to `public/images-opt/` (normalized names: lowercase, hyphens)
3. Run `npm run prepare` to re-optimize and regenerate manifest
4. Rebuild and deploy
