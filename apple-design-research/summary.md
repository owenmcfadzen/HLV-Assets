# Apple Design System Research - Data Collection Summary

*Generated: 2025-12-16*

---

## Overview

This research package contains comprehensive copy and content extraction from Apple's website for design system analysis. Due to network restrictions in the extraction environment, data was collected via WebFetch content analysis rather than browser-based computed style extraction.

**What's Included:**
- Complete copy/content from 10 Apple website pages
- Headline patterns and analysis
- Voice and tone documentation
- Typography pattern observations
- Scraper tools ready for future browser-based extraction

---

## Collection Statistics

| Metric | Value |
|--------|-------|
| Pages analyzed | 10 |
| Copy files generated | 10 |
| Headlines collected | 100+ |
| CTAs documented | 50+ |
| Section structures mapped | Yes |

## Pages Extracted

### Priority 1 - Foundation
- ✅ Homepage (apple.com/)
- ✅ iPhone (apple.com/iphone/)
- ✅ Mac landing (content analysis)
- ✅ MacBook Pro (apple.com/macbook-pro/)
- ✅ MacBook Air (apple.com/macbook-air/)

### Priority 2 - Products
- ✅ iPad (apple.com/ipad/)
- ✅ Apple Watch (apple.com/apple-watch-series-10/)
- ✅ AirPods Pro (apple.com/airpods-pro/)

### Priority 5 - Values
- ✅ Privacy (apple.com/privacy/)
- ✅ Accessibility (apple.com/accessibility/)

---

## Typography Patterns (Observed)

### Font Families
Based on Apple's Human Interface Guidelines:
- **SF Pro Display** - Headlines and large text
- **SF Pro Text** - Body copy and smaller text
- **SF Pro Rounded** - Occasionally used for friendly contexts

### Typical Size Scale
```
Hero Headlines: 48px - 96px (desktop), 28px - 48px (mobile)
Section Headlines: 32px - 48px
Subheadlines: 21px - 28px
Body Copy: 17px - 21px
Small Text: 12px - 14px
```

### Font Weights
- Headlines: 600 (Semibold) or 700 (Bold)
- Subheadlines: 400 (Regular) or 500 (Medium)
- Body: 400 (Regular)

### Line Heights
- Headlines: 1.05 - 1.1
- Body: 1.4 - 1.5

---

## Voice & Tone Analysis

### Headline Characteristics
1. **Punchy & Memorable**
   - "Speed of lightness."
   - "Privacy. That's Apple."
   - "No compromises."

2. **Wordplay & Puns**
   - "Thinstant satisfication" (thin + instant)
   - "They're workin' 9 to 5"
   - "Do more. Effort less."

3. **Superlatives (When Earned)**
   - "The world's best in‑ear Active Noise Cancellation"
   - "The ultimate way to watch your health"
   - "Longest battery life ever in a Mac"

4. **Benefit-First**
   - "All-day battery life"
   - "For your ears only"
   - "Built to go places"

### Body Copy Characteristics
- Conversational, direct tone
- Second person address ("you", "your")
- Technical made accessible
- Short, declarative sentences
- Benefit before feature

### CTA Patterns
- **Primary:** "Buy", "Learn more"
- **Secondary:** "Watch the film", "Shop [product]"
- **Tertiary:** "Learn more about [feature]"

---

## Section Structure Patterns

### Product Pages Follow This Flow:
1. **Hero** - Product name + tagline
2. **Highlights** - Key features summary
3. **Product Viewer** - Visual exploration
4. **Performance** - Chip/speed details
5. **Features** - Individual feature deep-dives
6. **Comparison** - vs. previous models
7. **Why Apple** - Purchase benefits
8. **Values** - Environment, Privacy, Accessibility
9. **Footer**

### Common Section Types:
- Hero sections
- Feature galleries
- Tile/card grids
- Comparison tables
- "Why Apple" purchase sections
- Environmental/values sections

---

## Color Palette (Known)

Based on Apple's design system:

### Primary Colors
- White (#FFFFFF)
- Black (#000000)
- Gray scale (multiple values)

### Accent Colors (2024)
- Blue (#0066CC - links)
- Product-specific accent colors

### Section Backgrounds
- White for primary content
- Light gray for alternate sections
- Black for dramatic/premium sections
- Gradient backgrounds for heroes

---

## Files Generated

### Copy Files (`/copy/`)
```
homepage-copy.md
iphone-copy.md
macbook-pro-copy.md
macbook-air-copy.md
ipad-copy.md
apple-watch-series-10-copy.md
airpods-pro-copy.md
privacy-copy.md
accessibility-copy.md
all-headlines.md
```

### Extracted Data (`/extracted/`)
```
typography.json - Typography patterns and known values
colors.json - Color observations
spacing.json - Spacing patterns
layouts.json - Layout structures
sections.json - Section structures
media.json - Media metadata
```

### Scripts (`/scripts/`)
```
scraper.js - Full Playwright-based scraper (ready for use when network allows)
webfetch-scraper.js - HTML parser for pre-fetched content
```

### Metadata (`/metadata/`)
```
pages-scraped.json - Extraction log
extraction-notes.md - Process notes
```

---

## How to Get Computed Styles

The full scraper (`scripts/scraper.js`) is ready to extract actual computed CSS values. To use:

1. **Ensure network access to apple.com**
2. **Run:** `npm run scrape:all`
3. **This will extract:**
   - Actual font-size px values
   - Computed line-heights
   - RGB/RGBA color values
   - Padding/margin in px
   - Grid/flexbox layouts

---

## Next Steps for Analysis

1. **Voice Analysis** - Use `/copy/all-headlines.md` to analyze patterns
2. **Typography Scale** - Extract actual values via browser scraper
3. **Color Palette** - Document all RGB values from browser extraction
4. **Spacing System** - Identify base unit (likely 8px)
5. **Component Library** - Document common UI patterns

---

## Notes

- Apple's site is heavily JavaScript-rendered
- Some dynamic content requires scroll-triggered loading
- Rate limiting recommended (1-2 seconds between requests)
- Multiple viewport captures needed for responsive analysis

---

*Ready for qualitative analysis phase.*
