# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lodge Gallery is a React-based image gallery for browsing property photos of vacation lodges/apartments. It features a responsive sidebar navigation, thumbnail grids, and a lightbox for full-size image viewing.

**Live site**: https://lochrannochhighlandclub.co.uk/gallery/

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173/gallery/

# Build
npm run build            # Production build to dist/

# Image Processing (run locally when images change)
npm run images:optimize  # Generate thumbnails + compress images
npm run images:manifest  # Regenerate src/data/lodges.ts from images
npm run images:process   # Run both optimize + manifest

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
   - Uses **relative paths** (no leading `/`) so Vite's base path is respected

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

- URLs map directly to lodge IDs: `/gallery/apt-9`, `/gallery/highland-lodge-1`
- Root `/gallery/` redirects to first lodge
- Invalid lodge IDs redirect to first lodge
- SPA routing handled by:
  - `public/_redirects` for Cloudflare Pages
  - `public/.htaccess` for Apache (IONOS, etc.)

## Subdirectory Configuration

Currently configured for `/gallery/` subdirectory. Three files control this:

| File | Setting | Purpose |
|------|---------|---------|
| `vite.config.ts` | `base: '/gallery/'` | Asset paths in built HTML/JS |
| `src/main.tsx` | `basename="/gallery"` | React Router path matching |
| `public/.htaccess` | `RewriteBase /gallery/` | Apache SPA routing |

**To change subdirectory**: Update all three files, regenerate manifest, rebuild.

## Deployment

### Current: IONOS (lochrannochhighlandclub.co.uk/gallery/)

1. Build locally:
   ```bash
   npm run build
   ```

2. Upload `dist/` folder contents to IONOS `gallery/` folder via:
   - IONOS Webspace Explorer, or
   - FTP/SFTP client

3. The `.htaccess` file handles SPA routing automatically

**IONOS FTP credentials**: IONOS Control Panel → Hosting → SFTP & SSH

### Alternative: Cloudflare Pages

Note: Would need base path changed to `/` for root deployment.

## Adding/Removing Images

1. Add/remove images in the original source folders (outside this project)
2. Copy updated folders to `public/images-opt/` (normalized names: lowercase, hyphens)
3. Run `npm run images:process` to re-optimize and regenerate manifest
4. Rebuild and deploy
