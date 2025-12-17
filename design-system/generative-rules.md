# Generative Design Rules

The format-agnostic layer that transforms content into properly structured layouts. Feed it content + target format, get correct spacing, hierarchy, and rhythm.

---

## Core Principle

**Every design decision flows from content relationships, not arbitrary values.**

These rules define *how* content relates to other content. Format-specific adaptations (slides, docs, web) then scale these relationships appropriately.

---

## 1. Content Density

How much of the canvas should contain content vs. whitespace.

| Format | Target Density | Rationale |
|--------|---------------|-----------|
| **Universal** | 30-40% | Confident minimalism; space is the design |
| Slides | 30-35% | Audience scans quickly; less = more |
| Documents | 50-60% | Reading flow; sustained attention |
| Web | 40-50% | Scroll-based; breathing room between folds |
| Worksheets | 60-70% | Functional; students need writing space |

**Rule:** If a layout feels cramped, reduce content before reducing spacing.

---

## 2. One Idea Per Container

Content should be chunked so each container holds exactly one idea.

| Format | Container | Max Ideas |
|--------|-----------|-----------|
| Slides | Slide | 1 |
| Documents | Section | 1 major + 2-3 supporting |
| Web | Viewport | 1 |
| Cards | Card | 1 |

**Indicators you have too many ideas:**
- Need to reduce font size to fit
- Competing visual hierarchies
- Reader doesn't know where to look first

**Solution:** Split into multiple containers.

---

## 3. Hierarchy Depth

Maximum levels of visual hierarchy before confusion.

| Level | Role | Typical Treatment |
|-------|------|-------------------|
| 1 | Category/Context | Eyebrow (small, caps, accent color) |
| 2 | Primary Message | Display/Headline (large, bold) |
| 3 | Supporting Detail | Body (regular weight, muted color) |

**Rule:** Never exceed 3 levels per container. If you need more, you have too many ideas.

### Hierarchy Patterns

**Standard (most content):**
```
[Eyebrow]
[Headline]
[Body]
```

**Statement (single powerful idea):**
```
[Headline with weight transition]
```

**Data (numbers that matter):**
```
[Massive Stat]
[Label]
[Context]
```

---

## 4. Weight Transitions

Bold claim followed by lighter continuation. The signature HLV/Apple pattern.

### Structure
```
[BOLD CLAIM]. [lighter continuation that extends the thought]
```

### Rules

| Constraint | Slides | Documents | Web |
|------------|--------|-----------|-----|
| Bold portion | Complete sentence | Complete sentence | Complete sentence |
| Max continuation words | 15 | 30 | 20 |
| Same line? | Yes | Yes | Yes |
| Color shift | Bold: primary, Light: gray | Same | Same |

**Good:**
```
Problems get locked in. The frame becomes invisible.
[Bold, dark]            [Regular, gray]
```

**Bad (continuation too long):**
```
Problems get locked in. The frame becomes invisible and we forget there are 
other ways to see the same situation which limits our ability to find solutions.
```

**Bad (no period after bold):**
```
Problems get locked in and the frame becomes invisible.
```

---

## 5. Spacing Relationships

Spacing communicates relationship. Tighter = more related. Looser = less related.

### Relationship Scale

| Relationship | Multiplier | Example |
|--------------|------------|---------|
| **Atomic** | 0.25x | Eyebrow to headline |
| **Tight** | 0.5x | Items in same group |
| **Related** | 1x (base) | Headline to body |
| **Distinct** | 2x | Section to section |
| **Separate** | 4x | Major divisions |

### Base Unit by Format

| Format | Base Unit | Atomic | Tight | Related | Distinct | Separate |
|--------|-----------|--------|-------|---------|----------|----------|
| Slides | 24px | 6px | 12px | 24px | 48px | 96px (new slide) |
| Documents | 16px | 4px | 8px | 16px | 32px | 64px |
| Web | 24px | 6px | 12px | 24px | 48px | 96px |

### Application

**Eyebrow → Headline:** Atomic to Tight (0.25x–0.5x base)
```
FOUNDATION CHAPTER     ← Eyebrow
                       ← 6-12px gap (slides)
Problem Reframing      ← Headline
```

**Headline → Body:** Related (1x base)
```
Problem Reframing      ← Headline
                       ← 24px gap (slides)
The way you frame...   ← Body
```

**List items (same group):** Tight (0.5x base)
```
"Agency model is broken"
                       ← 12px gap (slides)
"Healthcare too expensive"
                       ← 12px gap (slides)
"Education doesn't prepare"
```

**Sections:** Distinct (2x base) or new container
```
[Section A content]
                       ← 48px gap OR new slide
[Section B content]
```

---

## 6. Gap vs Line Height

**Critical distinction:** 

- **Line height** = space within a text block (between lines of the same paragraph)
- **Gap** = space between text blocks (between separate elements)

### Rules

| Scenario | Use | Value |
|----------|-----|-------|
| Multi-line paragraph | Line height | 1.4–1.5 |
| Stacked text blocks (same thought) | Gap | Tight (0.5x base) |
| Stacked text blocks (related) | Gap | Related (1x base) |
| List items | Gap | Tight (0.5x base) |

**Wrong:**
```jsx
<h2>Same problem.</h2>
<h2>Different solutions.</h2>  // Separate elements = unpredictable margin
```

**Right:**
```jsx
<h2>
  <span style="display: block">Same problem.</span>
  <span style="display: block">Different solutions.</span>
</h2>
// OR
<div style="display: flex; flex-direction: column; gap: 12px">
```

---

## 7. Alignment Patterns

### Text + Decorative Element

When large decorative elements (numbers, icons) sit beside text:

```
┌──────┬────────────────────┐
│  01  │ Title              │  ← Top-align, not baseline
│      │ Description text   │
└──────┴────────────────────┘
```

**Rules:**
- Use `align-items: flex-start` (not baseline)
- Add small optical adjustment (`margin-top: 2-4px`) to decorative element
- Fixed width on decorative element column
- Gap between columns: Related (1x base)

### Spec Grid (horizontal data)

```
┌─────────┬─────────┬─────────┬─────────┐
│   01    │   02    │   03    │   04    │  ← Large value
│  Label  │  Label  │  Label  │  Label  │  ← Small label
│  Desc   │  Desc   │  Desc   │  Desc   │  ← Optional description
└─────────┴─────────┴─────────┴─────────┘
```

**Rules:**
- Center-aligned within each column
- Equal column widths (or content-driven)
- Gap between items: Distinct (2x base)
- Vertical gap within item: Tight (0.5x base)

---

## 8. Typography Scale

### Scale Ratios

Base size adapts to format; ratios stay consistent.

| Level | Ratio | Slides (base 18) | Docs (base 16) | Web (base 18) |
|-------|-------|------------------|----------------|---------------|
| Display Large | 3.5x | 63px → 64px | 56px | 63px → 64px |
| Display | 2.75x | 50px → 48px | 44px | 50px → 48px |
| Headline | 2x | 36px | 32px | 36px |
| Title | 1.5x | 27px → 28px | 24px | 27px → 28px |
| Body | 1x | 18px | 16px | 18px |
| Body Small | 0.875x | 16px | 14px | 16px |
| Caption/Eyebrow | 0.67x | 12px | 11px | 12px |

### Weight Assignments

| Level | Weight | Usage |
|-------|--------|-------|
| Display/Headline | 700 | Primary message |
| Title | 600 | Section headers, labels |
| Body | 400 | Running text |
| Eyebrow | 600 | Category markers |

### Line Heights

| Level | Line Height | Rationale |
|-------|-------------|-----------|
| Display | 1.0–1.1 | Tight; one line only |
| Headline | 1.15–1.2 | Tight; max 2 lines |
| Title | 1.2–1.25 | Moderate |
| Body | 1.4–1.5 | Readable for paragraphs |
| Caption | 1.3–1.4 | Compact |

---

## 9. Color Application

### Hierarchy through Color

| Element | Color | Opacity |
|---------|-------|---------|
| Primary text | gray900 (light bg) / white (dark bg) | 100% |
| Secondary text | gray600 (light bg) / gray500 (dark bg) | 100% |
| Tertiary/disabled | gray500 | 60% |
| Decorative numbers | emerald | 20-25% |
| Accent elements | emerald | 100% |
| Interactive | navy | 100% |

### Background Sequencing

| Content Type | Background |
|--------------|------------|
| Opening/Hero | Dark (navy) |
| Statement/Insight | Light (white) |
| Examples/Quotes | Gray (gray100) |
| Data/Stats | Dark (navy) |
| Process/Framework | Light (white) |
| Close/Takeaway | Dark (navy) |

**Pattern:** Alternate to create rhythm, but with semantic meaning—dark for emphasis, light for detail, gray for examples.

---

## 10. Content Width Constraints

Full-width text is harder to read and looks less refined.

| Element | Max Width | Rationale |
|---------|-----------|-----------|
| Headline | 70% of container | Prevent orphans, improve scannability |
| Body | 65ch (~600px) | Optimal reading line length |
| Caption | 50% of container | Subordinate to main content |

### Slides Specific

| Element | Max Width |
|---------|-----------|
| Display headline | 700px |
| Body text | 500px |
| Quote | 580px |

---

## 11. Format Adaptation Matrix

When generating for a specific format, apply these multipliers to base rules:

| Rule | Slides | Documents | Web | Worksheets |
|------|--------|-----------|-----|------------|
| Content density | 0.7x | 1.0x | 0.85x | 1.2x |
| Spacing base unit | 24px | 16px | 24px | 12px |
| Typography base | 18px | 16px | 18px | 14px |
| Weight transition max | 15 words | 30 words | 20 words | 25 words |
| Ideas per container | 1 | 1-3 | 1 | varies |
| Padding (container) | 6-8% | 4-6% | 5-7% | 3-4% |

---

## 12. Quality Validation

Before finalizing any output, check:

### Universal Checks
- [ ] Maximum 3 hierarchy levels?
- [ ] One idea per container?
- [ ] Weight transitions have complete bold sentence + short continuation?
- [ ] Spacing reflects content relationships (tight within, loose between)?
- [ ] Text width constrained (not spanning full container)?
- [ ] Color hierarchy correct (primary → secondary → accent)?

### Format-Specific Checks

**Slides:**
- [ ] 30-35% content density?
- [ ] Would splitting improve clarity?
- [ ] Eyebrow → Headline → Body pattern consistent?
- [ ] Dark/light sequence purposeful?

**Documents:**
- [ ] 50-60% content density?
- [ ] Section breaks at idea boundaries?
- [ ] Headers create scannable structure?

**Web:**
- [ ] Above-fold content complete?
- [ ] Scroll reveals, doesn't hide?
- [ ] Touch targets adequate (44px min)?

---

## 13. Generation Workflow

When creating any HLV content:

```
1. IDENTIFY
   - What is the content?
   - What format is needed?
   - Who is the audience?

2. CHUNK
   - Break into single ideas
   - Assign hierarchy level to each
   - Identify relationships (atomic/tight/related/distinct)

3. STRUCTURE
   - Apply container rule (one idea per)
   - Apply spacing relationships
   - Apply typography scale

4. ADAPT
   - Apply format multipliers
   - Constrain widths
   - Sequence backgrounds (if applicable)

5. VALIDATE
   - Run quality checks
   - Reduce before cramming
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-17 | Initial creation from slide production learnings |

---

## Integration

This document is the **generative core**. Other documents reference it:

- `SKILL.md` → Orchestration, hands off to this for layout decisions
- `hlv-slide-design.skill` → Slide-specific application of these rules
- `hlv-slides-generator` → Script reads format multipliers from here
- `typography.md` → Detailed type specs, this doc references scale ratios
- `layout.md` → Detailed spacing specs, this doc defines relationships

When rules conflict, this document wins. When this document is silent, defer to format-specific docs.
