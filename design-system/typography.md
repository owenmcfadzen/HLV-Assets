# Apple Typography System
## For HLV Brand System Development

*Last updated: December 17, 2025*
*Source: Extracted CSS tokens + 53 reference screenshots*

---

# Overview

This document codifies the typographic decisions that create Apple's distinctive clarity. The goal is a system where decisions follow rules, not instinct—enabling consistent results across designers, developers, and AI-generated content.

**Core principle:** Typography does the work that decoration doesn't need to do.

---

# 1. The Type Scale

## 1.1 Scale Values

Apple uses an 8px-influenced scale with optical adjustments:

| Token | Size | Primary Use |
|-------|------|-------------|
| `hero` | 96px | Page titles, product names |
| `display-1` | 80px | Section heroes |
| `display-2` | 56px | Major section headlines |
| `display-3` | 48px | Section headlines |
| `headline-1` | 40px | Feature headlines |
| `headline-2` | 32px | Card headlines, subsections |
| `headline-3` | 28px | Component headlines |
| `title-1` | 24px | Large body, pull quotes |
| `title-2` | 21px | Medium emphasis body |
| `body` | 17px | Standard body copy |
| `callout` | 14px | Secondary text, labels |
| `caption` | 12px | Metadata, footnotes |

## 1.2 Scale Ratios

The scale approximates a 1.2 (minor third) ratio with adjustments for optical balance:

```
12 → 14 → 17 → 21 → 24 → 28 → 32 → 40 → 48 → 56 → 80 → 96
```

**Key insight:** The scale isn't rigid. Optical judgment determines final sizes. But these values are the starting vocabulary.

## 1.3 HLV Translation

| Apple Token | HLV Size | Notes |
|-------------|----------|-------|
| `hero` | 80px | Slightly smaller for educational context |
| `display-1` | 64px | |
| `display-2` | 48px | |
| `display-3` | 40px | |
| `headline-1` | 32px | Primary section headlines |
| `headline-2` | 28px | |
| `headline-3` | 24px | |
| `title-1` | 21px | |
| `title-2` | 18px | |
| `body` | 16px | Standard for readability |
| `callout` | 14px | |
| `caption` | 12px | |

---

# 2. Weight System

## 2.1 Available Weights

| Weight | Value | Name | Primary Use |
|--------|-------|------|-------------|
| 400 | Regular | — | Body copy, continuation text |
| 500 | Medium | — | Subtle emphasis, active states |
| 600 | Semibold | — | Headlines, feature names |
| 700 | Bold | — | Hero headlines, key claims |

**Note:** Apple uses SF Pro which has more weight options. Manrope (HLV) maps cleanly to these four.

## 2.2 Weight Hierarchy Rules

**Rule 1: Headlines use 600-700**
- Hero/display sizes: 700 (Bold)
- Section headlines: 600 (Semibold)
- Never use 400 for headlines at display sizes

**Rule 2: Body uses 400**
- Standard paragraphs: 400 (Regular)
- Never bold entire paragraphs
- Inline emphasis uses 600, sparingly

**Rule 3: UI elements use 500-600**
- Navigation labels: 500 (Medium)
- Active states: 600 (Semibold)
- Buttons: 500-600

**Rule 4: Captions and metadata use 400**
- Small text stays regular weight
- Contrast comes from size and color, not weight

---

# 3. The Weight Transition Technique

This is Apple's signature typographic move. Master this and you've captured 50% of the system's effectiveness.

## 3.1 The Pattern

```
[BOLD CLAIM]. [Regular continuation that provides context...]
```

**Bold portion (600-700):**
- The headline-within-the-headline
- A complete thought (note the period)
- Usually 3-8 words
- Color: primary text (#1D1D1F light, #FFFFFF dark)

**Regular portion (400):**
- Explanation, elaboration, context
- Can be multiple sentences
- Color: secondary text (#6E6E73 light, #86868B dark)

## 3.2 Implementation Examples

### Example 1: Feature Introduction
```
Power to change everything. Say hello to a Mac that is 
extreme in every way. With the greatest performance, 
expansion, and configurability yet.
```

CSS:
```css
.weight-transition {
  font-size: 32px;
  line-height: 1.125;
}

.weight-transition .claim {
  font-weight: 700;
  color: #1D1D1F;
}

.weight-transition .context {
  font-weight: 400;
  color: #6E6E73;
}
```

### Example 2: Technical Explanation
```
LED in a whole new light. True-to-life imagery requires 
having extremely bright areas of the screen right next 
to extremely dark areas.
```

### Example 3: Problem-Solution
```
The GPS dilemma. For most people, a traditional GPS 
solution with just L1 GPS works well most of the time. 
But it can be tricky when tall buildings, trees, or 
dense foliage block satellites.
```

## 3.3 When to Use Weight Transition

**Use when:**
- Introducing a feature or concept
- Making a claim that needs immediate context
- Opening a section that has explanatory content
- Any headline that would otherwise be too long

**Don't use when:**
- Simple labels or navigation
- Very short headlines (under 4 words total)
- Lists or bullet points
- Captions or metadata

## 3.4 Weight Transition Decision Tree

```
Is the headline making a claim? 
  → No: Use single-weight headline
  → Yes: Does it need immediate context?
      → No: Use single-weight headline
      → Yes: Use weight transition
          → Is the claim ≤8 words?
              → Yes: Bold the claim, regular the rest
              → No: Find a shorter claim within it
```

## 3.5 Common Mistakes

**Mistake 1: Too much bold**
```
❌ Power to change everything. Say hello to a Mac that is extreme.
✓ Power to change everything. Say hello to a Mac that is extreme.
```
Only the claim is bold. Everything after the first period is regular.

**Mistake 2: No period after claim**
```
❌ Power to change everything, say hello to a Mac...
✓ Power to change everything. Say hello to a Mac...
```
The period creates the rhythmic break. It's not optional.

**Mistake 3: Claim too long**
```
❌ Power to change everything and transform how you work. Say hello...
✓ Power to change everything. Say hello to a Mac that transforms how you work...
```
Keep the claim punchy. Move elaboration to the continuation.

---

# 4. Line Height Rules

## 4.1 The Principle

**Headlines: Tight. Body: Relaxed.**

Tight line-heights on headlines create visual density and impact. Relaxed line-heights on body copy create readability and breathing room.

## 4.2 Specific Values

| Context | Line-Height | Ratio |
|---------|-------------|-------|
| Hero text (80px+) | 1.05 | Near-solid |
| Display headlines (48-80px) | 1.0625 | Very tight |
| Section headlines (32-48px) | 1.125 | Tight |
| Feature headlines (24-32px) | 1.1875 | Moderate |
| Large body (21-24px) | 1.2381 | Comfortable |
| Body copy (17px) | 1.4706 | Relaxed |
| Small text (12-14px) | 1.4286 | Relaxed |

## 4.3 Implementation

```css
/* Headlines */
.hero { line-height: 1.05; }
.display { line-height: 1.0625; }
.headline { line-height: 1.125; }

/* Body */
.body { line-height: 1.47; }
.caption { line-height: 1.43; }
```

## 4.4 HLV Adjustments

For Manrope, slightly increase line-heights (Manrope has taller x-height than SF Pro):

| Context | Apple | HLV (Manrope) |
|---------|-------|---------------|
| Headlines | 1.05-1.125 | 1.1-1.15 |
| Body | 1.47 | 1.5 |
| Caption | 1.43 | 1.45 |

---

# 5. Letter Spacing

## 5.1 The Principle

**Headlines: Negative tracking. Body: Normal.**

Large text needs tighter letter-spacing to maintain visual cohesion. Body text uses default spacing for readability.

## 5.2 Specific Values

| Size Range | Letter-Spacing |
|------------|----------------|
| 80px+ | -0.015em |
| 48-80px | -0.012em |
| 32-48px | -0.008em |
| 24-32px | -0.003em |
| Under 24px | 0 (normal) |

## 5.3 Implementation

```css
.hero { letter-spacing: -0.015em; }
.display-1 { letter-spacing: -0.012em; }
.display-2 { letter-spacing: -0.008em; }
.headline { letter-spacing: -0.003em; }
.body { letter-spacing: normal; }
```

## 5.4 When to Adjust

**Tighten further when:**
- All caps text (rare—avoid if possible)
- Very bold weights at large sizes

**Loosen when:**
- Light weights at large sizes
- Numerals in headlines (numbers often need more space)

---

# 6. Text Color Hierarchy

## 6.1 Light Mode Palette

| Role | Hex | Usage |
|------|-----|-------|
| Primary | #1D1D1F | Headlines, body copy, key content |
| Secondary | #6E6E73 | Continuation text, supporting content |
| Tertiary | #86868B | Captions, metadata, labels |
| Link | #0066CC | Interactive text |
| Accent | (varies) | Highlighted terms, gradients |

## 6.2 Dark Mode Palette

| Role | Hex | Usage |
|------|-----|-------|
| Primary | #FFFFFF | Headlines, body copy |
| Secondary | #86868B | Continuation text, supporting |
| Tertiary | #6E6E73 | Captions, metadata |
| Link | #2997FF | Interactive text |
| Accent | (varies) | Highlighted terms, gradients |

## 6.3 Color in Weight Transitions

The weight transition uses color AND weight for contrast:

```
Light mode:
  Claim: #1D1D1F + 700 weight
  Context: #6E6E73 + 400 weight

Dark mode:
  Claim: #FFFFFF + 700 weight  
  Context: #86868B + 400 weight
```

Both mechanisms reinforce each other. Don't use weight alone or color alone—use both.

## 6.4 HLV Color Mapping

| Apple Role | HLV Equivalent |
|------------|----------------|
| Primary #1D1D1F | Navy #182D53 |
| Secondary #6E6E73 | Gray #6B7280 |
| Tertiary #86868B | Light Gray #9CA3AF |
| Link #0066CC | Navy #182D53 or Emerald #00D866 |
| Accent | Emerald #00D866 |

---

# 7. Semantic Typography Roles

## 7.1 The Hierarchy

Each text element has a role. The role determines size, weight, and color.

| Role | Size | Weight | Color | Line-Height |
|------|------|--------|-------|-------------|
| Eyebrow | 12-14px | 500-600 | Secondary | 1.4 |
| Headline | 32-96px | 600-700 | Primary | 1.05-1.125 |
| Subhead | 21-28px | 400-600 | Primary/Secondary | 1.2 |
| Body | 17px | 400 | Primary | 1.47 |
| Caption | 12-14px | 400 | Tertiary | 1.4 |
| Label | 12-14px | 500 | Secondary | 1.4 |

## 7.2 Role Definitions

**Eyebrow**
- Appears above headline
- Category label, section identifier
- Often uppercase or small caps
- Example: "Success Story" above case study headline

**Headline**
- The main statement
- What you read first
- May use weight transition
- Example: "Power to change everything."

**Subhead**
- Supports the headline
- Adds context without competing
- Can be part of weight transition (the "continuation")
- Example: "Say hello to a Mac that is extreme in every way."

**Body**
- Extended explanation
- Multiple paragraphs
- Comfortable reading line-length (65-75 characters)
- Example: Feature descriptions, explanatory content

**Caption**
- Image descriptions
- Footnotes
- Technical annotations
- Example: "Mac Pro with M2 Ultra"

**Label**
- UI elements
- Data labels (beneath stats)
- Navigation text
- Example: "threads" under "56"

## 7.3 Role Combinations

Standard patterns:

**Pattern 1: Eyebrow → Headline → Body**
```
Success Story                    [Eyebrow]
BSH                             [Headline]
Custom apps make employees,     [Headline continued]
and customers, happier.
                                
[Body paragraph...]             [Body]
```

**Pattern 2: Headline (with transition) → Body**
```
Power to change everything.     [Headline - bold]
Say hello to a Mac that is     [Headline - regular]
extreme in every way.

[Body paragraph...]             [Body]
```

**Pattern 3: Headline → Subhead → Body**
```
Precision dual-frequency GPS    [Headline]

L1 and L5 GPS for incredible   [Subhead]
accuracy and precise metrics

[Body paragraph...]             [Body]
```

---

# 8. Responsive Typography

## 8.1 Breakpoints

| Breakpoint | Width | Name |
|------------|-------|------|
| Large | 1200px+ | Desktop |
| Medium | 768-1199px | Tablet |
| Small | <768px | Mobile |

## 8.2 Scale Adjustments

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| hero | 96px | 72px | 48px |
| display-1 | 80px | 56px | 40px |
| display-2 | 56px | 40px | 32px |
| headline-1 | 40px | 32px | 28px |
| body | 17px | 17px | 16px |

## 8.3 Line Length Control

**Desktop:** Max-width 692px for body text (narrow), 980px for sections
**Tablet:** Max-width 600px for body text
**Mobile:** Full width with 24px side padding

```css
.body-text {
  max-width: 692px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .body-text {
    max-width: 100%;
    padding: 0 24px;
  }
}
```

---

# 9. Punctuation & Details

## 9.1 Period Usage

**Use periods in:**
- Headlines that are complete sentences
- The "claim" portion of weight transitions
- Taglines that make statements

**Omit periods in:**
- Fragment headlines
- Labels and navigation
- List items (usually)

## 9.2 Quotation Marks

Always curly quotes, never straight:
- " " not " "
- ' ' not ' '

## 9.3 Dashes

- En dash (–) for ranges: "2–4 hours"
- Em dash (—) for breaks: "the result—a breakthrough"
- Hyphen (-) for compound words: "high-performance"

## 9.4 Apostrophes

Curly: It's, don't, Apple's
Never straight: It's, don't, Apple's

---

# 10. Typography Checklist

Before finalizing any design, verify:

**Scale**
- [ ] Sizes come from the defined scale
- [ ] Hierarchy is clear (can you identify 1st, 2nd, 3rd?)
- [ ] No more than 3-4 sizes per composition

**Weight**
- [ ] Headlines use 600-700
- [ ] Body uses 400
- [ ] Weight transitions follow the pattern correctly
- [ ] Not too many weights competing

**Spacing**
- [ ] Line-heights appropriate for size
- [ ] Letter-spacing adjusted for large text
- [ ] Adequate vertical rhythm between elements

**Color**
- [ ] Using semantic color roles
- [ ] Sufficient contrast for readability
- [ ] Dark/light mode considered

**Details**
- [ ] Curly quotes and apostrophes
- [ ] Proper dash usage
- [ ] Periods used intentionally
- [ ] Line length controlled (65-75 chars for body)

---

# 11. Quick Reference Card

## Weight Transition Formula
```
[Bold claim, max 8 words]. [Regular continuation with context.]
```

## Size Quick Picks
- **Hero:** 80-96px (bold, tight)
- **Section headline:** 40-48px (semibold)
- **Feature headline:** 28-32px (semibold)
- **Body:** 17px (regular, relaxed)
- **Caption:** 12-14px (regular)

## Line-Height Quick Picks
- **Large headlines:** 1.05-1.1
- **Small headlines:** 1.125-1.2
- **Body text:** 1.47-1.5

## Color Quick Picks
Light mode:
- Primary: #1D1D1F
- Secondary: #6E6E73
- Tertiary: #86868B

Dark mode:
- Primary: #FFFFFF
- Secondary: #86868B
- Tertiary: #6E6E73

---

# 12. HLV Implementation Notes

## Font Stack
```css
font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, sans-serif;
```

## CSS Custom Properties
```css
:root {
  /* Scale */
  --text-hero: 80px;
  --text-display: 48px;
  --text-headline-1: 32px;
  --text-headline-2: 28px;
  --text-headline-3: 24px;
  --text-body: 16px;
  --text-caption: 12px;
  
  /* Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.2;
  --leading-normal: 1.5;
  
  /* Colors - Light */
  --text-primary: #182D53;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --text-accent: #00D866;
  
  /* Letter Spacing */
  --tracking-tight: -0.01em;
  --tracking-normal: 0;
}
```

## Utility Classes
```css
/* Weight Transition */
.claim { 
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}

.context {
  font-weight: var(--weight-regular);
  color: var(--text-secondary);
}

/* Headlines */
.headline-hero {
  font-size: var(--text-hero);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.headline-section {
  font-size: var(--text-headline-1);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

/* Body */
.body-default {
  font-size: var(--text-body);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  max-width: 65ch;
}
```

---

*This document pairs with the Component Library for full implementation guidance.*

---

**Next deliverable:** Layout System document covering grid logic, section patterns, and information density modes.
