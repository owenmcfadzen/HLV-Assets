# Apple Design Component Library
## For HLV Brand System Development

*Last updated: December 17, 2025*
*Source: 53 reference screenshots from Apple.com*

---

# Overview

This document catalogs reusable design patterns extracted from Apple's web design system. Each component includes:
- **What it is** — the pattern's structure and purpose
- **When to use it** — the communication job it performs
- **How it works** — the specific decisions that make it effective
- **HLV Application** — how to adapt for Hudson Lab Ventures

The goal is replicable logic, not Apple mimicry.

---

# 1. Typography Components

## 1.1 Weight Transition Headline

**What it is**
A headline where the opening statement appears in bold/black weight, followed by continuation text in lighter weight (usually gray or lighter black).

**Pattern structure:**
```
[BOLD CLAIM]. [lighter continuation that provides context]...
```

**Examples from reference:**
- "**Power to change everything.** Say hello to a Mac that is extreme in every way..."
- "**LED in a whole new light.** True-to-life imagery requires having extremely bright areas..."
- "**The GPS dilemma.** For most people, a traditional GPS solution with just L1 GPS works..."
- "**Minimal glare for maximum focus.** Studio Display comes standard with..."

**How it works:**
- Bold portion is the *claim*—the headline-within-the-headline
- Light portion is *context*—explanation that doesn't compete for attention
- Creates reading rhythm: **punch**, breathe, explain
- Period after bold portion is intentional—it's a complete thought

**When to use:**
- Feature introductions
- Section headers that need explanation
- Any place you need to make a claim and immediately contextualize it

**Specifications:**
- Bold portion: font-weight 700 (Semibold) or 800 (Bold), color #1D1D1F
- Light portion: font-weight 400 (Regular), color #6E6E73 or #86868B
- Same font size for both portions
- Typically 28-48px depending on hierarchy level

**HLV Application:**
Use for introducing curriculum concepts. Bold = the principle name or key insight. Light = the explanation or application context.

---

## 1.2 Gradient Text Marker

**What it is**
A word or phrase rendered with a gradient fill, used to mark the "news"—the thing Apple wants you to remember.

**Pattern structure:**
```
[headline with one] [GRADIENT WORD/PHRASE] [completing the thought]
```

**Examples from reference:**
- "Great powers come with great **privacy**." (privacy in purple gradient)
- "**65% larger sensor**" (full phrase in purple gradient)
- "**computational algorithms**" (highlighted within body text)

**How it works:**
- Appears maximum 1-2 times per page/section
- Reserved for: product names (M1, H2), key metrics, new features
- Functions like a highlighter pen used with extreme discipline
- The gradient is *deictic*—it points to what matters

**When to use:**
- New feature announcements
- Key differentiating metrics
- Product/technology names that need emphasis

**Specifications:**
- Gradient direction: typically left-to-right or slight diagonal
- Colors: brand-appropriate (Apple uses purple-pink, blue-cyan depending on product)
- Apply to display text only, never body copy
- One gradient per composition maximum

**HLV Application:**
Reserve for program names, key frameworks, or breakthrough concepts. Use emerald-to-teal gradient aligned with HLV brand. Example: "Learn to build ventures with **Design Thinking**."

---

## 1.3 Inline Color Highlight

**What it is**
A key term within body text rendered in a semantic color (often green) while surrounding text remains gray.

**Pattern structure:**
```
[gray text...] [GREEN KEY TERM] [gray text continues...]
```

**Examples from reference:**
- "...using **computational algorithms** to deliver even smarter noise cancellation..."
- Private Cloud Compute bullets: "**Your data is never stored**"

**How it works:**
- Breaks the monotony of long explanatory text
- Creates scannable anchors within paragraphs
- Color choice often matches section accent or product color
- More subtle than gradient—used for technical terms, benefits

**When to use:**
- Technical explanations where terms need emphasis
- Feature lists where benefits need to stand out
- Any dense text block that needs visual relief

**Specifications:**
- Text: same weight as surrounding text (usually 400)
- Color: semantic accent (green for eco/positive, blue for links, orange for pro features)
- Surrounding text: #86868B or similar gray

**HLV Application:**
Use in facilitator guides to highlight key terms students should remember. Use emerald (#00D866) for HLV concepts.

---

# 2. Stat Components

## 2.1 Massive Stat Callout

**What it is**
An enormous number with a tiny label beneath, creating extreme scale contrast.

**Pattern structure:**
```
[MASSIVE NUMBER]
[tiny label]
```

**Examples from reference:**
- "**2x** / faster GPU performance"
- "**33%** / of the power"
- "**80%** / less administrative work per job"
- "**6M** / appliances repaired each year"
- "**800+** / Engineers and specialists collaborating solely on camera technologies"

**How it works:**
- Number is 3-5x larger than label text
- Number can include unit (%, x, M, +) at same or slightly smaller size
- Label is tiny, gray, often 2-3 lines max
- Confidence through restraint—the number speaks for itself

**When to use:**
- Impact metrics
- Performance comparisons
- Scale/quantity claims
- Any impressive number worth featuring

**Specifications:**
- Number: 56-96px, font-weight 600-700, color varies (white on dark, black on light, or accent color)
- Unit suffix: same font, often 60-70% of number size
- Label: 12-14px, font-weight 400, color #86868B or white at 70% opacity
- Vertical spacing: tight (8-16px between number and label)

**HLV Application:**
Use for program outcomes: "**500+** / ventures launched by alumni" or impact metrics in pitch materials.

---

## 2.2 Stat Pair

**What it is**
Two stat callouts placed side-by-side, creating comparison or complementary impact.

**Pattern structure:**
```
[STAT 1]    [STAT 2]
[label 1]   [label 2]
```

**Examples from reference:**
- "**80%** less admin work" + "**6M** appliances repaired"
- "**2x** faster GPU" + "**33%** of the power"

**How it works:**
- Stats relate to each other (cause/effect, comparison, complementary angles)
- Equal visual weight—neither dominates
- Separated by generous whitespace or subtle divider
- Often used below quotes or as section anchors

**When to use:**
- Before/after comparisons
- Multi-dimensional impact (speed + efficiency)
- When one number alone doesn't tell the full story

**Specifications:**
- Same sizing as single stat callouts
- Horizontal gap: 48-80px
- Optional thin vertical divider (1px, 20% opacity)
- Align baselines of numbers

**HLV Application:**
Pair complementary outcomes: "**2 weeks** / intensive learning" + "**12 months** / mentorship access"

---

## 2.3 Spec Grid

**What it is**
A horizontal row of specs/metrics, each with large value and small label.

**Pattern structure:**
```
[VALUE 1]    [VALUE 2]    [VALUE 3]    [VALUE 4]
[label]      [label]      [label]      [label]
```

**Examples from reference:**
- "**56** threads / **2.5GHz** base / **4.4GHz** turbo boost / **66.5MB** cache"

**How it works:**
- 3-5 metrics in a row
- Values large and bold, labels small and gray
- Often appears below tab navigation showing different configurations
- Dense information made scannable through consistent structure

**When to use:**
- Technical specifications
- Product configurations
- Comparison tables (simplified)
- Any multi-dimensional data set

**Specifications:**
- Values: 32-48px, font-weight 600
- Labels: 12-14px, font-weight 400, #86868B
- Horizontal spacing: equal columns or auto-fit
- Often sits on light gray background (#F5F5F7)

**HLV Application:**
Program details: "**10** days / **8** modules / **50** exercises / **1** venture"

---

# 3. Card Components

## 3.1 Feature Card

**What it is**
A contained unit with image above, headline + body below, on subtle background.

**Pattern structure:**
```
┌─────────────────────────────┐
│                             │
│      [PRODUCT IMAGE]        │
│                             │
├─────────────────────────────┤
│ [Headline.]                 │
│ [Body copy explaining       │
│  the feature in detail.]    │
└─────────────────────────────┘
```

**Examples from reference:**
- "Detach. Move. Attach." with Pro Stand magnetic connector image
- "Available VESA Mount Adapter." with mount hardware image

**How it works:**
- Image area on subtle gray (#F5F5F7) or full bleed
- Headline uses period punctuation intentionally
- Body copy is explanatory, not promotional
- Card structure provides implicit grouping without visible borders

**When to use:**
- Feature comparison grids (2-3 cards per row)
- Product accessories/options
- Related concept groupings

**Specifications:**
- Card background: #F5F5F7 or transparent on #F5F5F7 section
- Border-radius: 0 (Apple) or subtle (16-24px for softer feel)
- Internal padding: 32-48px
- Image: centered, adequate breathing room
- Headline: 21-28px, font-weight 600
- Body: 14-17px, font-weight 400, #6E6E73

**HLV Application:**
Curriculum module cards. Image = diagram or icon. Headline = module name. Body = learning outcomes.

---

## 3.2 Quote Card

**What it is**
A testimonial or pull quote with attribution, often on contrasting background.

**Pattern structure:**
```
"[Quote text that captures the key insight
or endorsement in the speaker's voice.]"

[Name]
[Title/Role]
```

**Examples from reference:**
- BSH case study: "By integrating custom apps with our core systems we created powerful tools engineers love to use." — Martina Krenn, Head of Business Solutions Customer Service

**How it works:**
- Quote marks present (curly quotes, not straight)
- Quote text larger than attribution
- Name bold, title/role lighter weight
- Often paired with stat callouts below
- Dark background creates authority and focus

**When to use:**
- Case studies
- Testimonial sections
- Expert endorsements
- Partner/customer stories

**Specifications:**
- Quote: 21-28px, font-weight 400-500, primary text color
- Name: 14-17px, font-weight 600
- Title: 14px, font-weight 400, secondary text color
- Vertical spacing: 16-24px between quote and attribution

**HLV Application:**
Student testimonials, mentor quotes, partner endorsements in marketing materials.

---

## 3.3 Split Panel Card

**What it is**
A two-column layout within a section: visual element on one side, text content on the other, often with vertical divider.

**Pattern structure:**
```
┌─────────────────┬─────────────────┐
│                 │                 │
│   [VISUAL]      │   [TEXT]        │
│   chip badge    │   Weight        │
│   or product    │   transition    │
│                 │   headline +    │
│                 │   body          │
│                 │                 │
└─────────────────┴─────────────────┘
```

**Examples from reference:**
- H2 chip badge left, feature description right (with vertical line divider)

**How it works:**
- Subtle vertical divider (1px, low opacity) separates zones
- Visual element is simple: logo, badge, minimal product shot
- Text follows weight transition pattern
- Creates editorial rhythm—left anchors, right explains

**When to use:**
- Technology/chip introductions
- Platform feature highlights
- Any feature needing both symbolic and explanatory representation

**Specifications:**
- Divider: 1px, #6E6E73 at 20-30% opacity
- Column ratio: 40:60 or 50:50
- Vertical alignment: center
- Dark background for tech/performance content

**HLV Application:**
Framework introductions. Left = framework icon/diagram. Right = explanation + key insight.

---

# 4. Navigation & UI Components

## 4.1 Tab Menu

**What it is**
A horizontal row of text labels with underline indicating active state, controlling content below.

**Pattern structure:**
```
[Option 1]    Option 2    Option 3    Option 4
─────────
```

**Examples from reference:**
- "**28-core**    24-core    16-core    12-core    8-core" (processor configurations)
- "True Tone    **Anti-reflective coating**    Nano-texture glass" (display features)

**How it works:**
- Active state: darker text + underline (2-3px, brand color or black)
- Inactive: gray text (#6E6E73), no underline
- Clicking changes content below without page navigation
- Creates "UI scaffolding"—structure without button-ness

**When to use:**
- Configuration options
- Feature comparison within a product
- Content that varies by selection
- Dense information requiring user-directed exploration

**Specifications:**
- Text: 14-17px, font-weight 400 (inactive), 500-600 (active)
- Underline: 2px, positioned 8-12px below text baseline
- Spacing: 32-48px between options
- Color: #1D1D1F active, #6E6E73 inactive

**HLV Application:**
Program selection (Beginner / Advanced), day selection in curriculum viewer, module navigation.

---

## 4.2 Text Link CTA

**What it is**
An inline text link with chevron, used for navigation without button styling.

**Pattern structure:**
```
[Link text] >
```

or

```
[Link text] →
```

**Examples from reference:**
- "Learn more about Apple and the environment >"
- "See how Roadside Assistance works >"
- "View the Mac Pro Technology White Paper (PDF)"

**How it works:**
- Blue color (#0066CC light mode, #2997FF dark mode) or contextual accent
- Chevron/arrow indicates navigation or expansion
- No underline by default (appears on hover)
- Often appears below body copy as section closer

**When to use:**
- "Learn more" patterns
- PDF/resource links
- Navigation to related content
- Any non-primary action

**Specifications:**
- Text: 14-17px, font-weight 400
- Color: #0066CC (light), #2997FF (dark), or accent color
- Chevron: same color, sized to match text (often SVG or Unicode ›)
- Spacing: 4-8px between text and chevron

**HLV Application:**
Links to detailed resources: "Download the facilitator guide >" or "Explore the framework in depth >"

---

## 4.3 Button CTA with Icon

**What it is**
A text CTA paired with an icon (play button, arrow, etc.) for actions.

**Pattern structure:**
```
[Action text] [●▶]
```

**Examples from reference:**
- "Watch the film ⊙" (play icon in circle)
- "See how iPhone does more with every megapixel →" (arrow in gradient circle)

**How it works:**
- Icon reinforces action type (play = video, arrow = navigation)
- Often circular icon with gradient fill for primary actions
- Text + icon read as unified element
- Gradient circle is the "semantic marker" treatment applied to interaction

**When to use:**
- Video CTAs
- Primary section actions
- High-value navigation moments

**Specifications:**
- Text: 14-17px, font-weight 500
- Icon: 24-32px circle diameter
- Gradient: product-appropriate accent colors
- Spacing: 8-12px between text and icon

**HLV Application:**
Video introductions: "Watch the program overview ⊙" or module CTAs.

---

## 4.4 Carousel Navigation

**What it is**
Simple previous/next arrows for navigating through content sequences.

**Pattern structure:**
```
[content area]

        ‹  ›
```

**Examples from reference:**
- Display layer exploded diagram with left/right arrows below

**How it works:**
- Arrows are minimal: often just ‹ › characters or thin line arrows
- Positioned below content, right-aligned or centered
- Low visual weight—doesn't compete with content
- Sometimes dots indicate position in sequence

**When to use:**
- Image galleries
- Feature sequences
- Any content too wide for single view

**Specifications:**
- Arrow size: 24-32px
- Color: #86868B or #6E6E73
- Touch target: larger than visual (44px minimum)
- Optional dot indicators: 8px diameter, current filled, others outline

**HLV Application:**
Student project showcases, step-by-step process walkthroughs.

---

# 5. Media-Text Components

## 5.1 Hero Split

**What it is**
The classic hero layout: text block on one side, product image on the other.

**Pattern structure:**
```
┌───────────────────────────────────────────┐
│                                           │
│  [Eyebrow]              [PRODUCT IMAGE]   │
│  [HEADLINE]                               │
│  [body text]                              │
│  [cta]                                    │
│                                           │
└───────────────────────────────────────────┘
```

**Examples from reference:**
- Privacy page: "Great powers come with great privacy." + iPhone image
- Various product pages

**How it works:**
- Text occupies roughly 40% width, image 60%
- Text is left-aligned on left side
- Image bleeds to edge or has generous padding
- Eyebrow (small caps label) anchors the category
- Hierarchy: Eyebrow → Headline → Body → CTA

**When to use:**
- Page openings
- Section introductions
- Product launches
- Any high-impact feature announcement

**Specifications:**
- Text column: max-width 500-600px
- Image: scale to fit, maintain aspect ratio
- Vertical alignment: centered or top-aligned
- Background: light (#FFFFFF) or dark (#000000) depending on content

**HLV Application:**
Program landing pages: "Summer School 2025" with program imagery or featured student work.

---

## 5.2 Stacked Text + Image

**What it is**
Text block above, full-width image below (or vice versa).

**Pattern structure:**
```
┌─────────────────────────────────────────┐
│                                         │
│  [HEADLINE]                             │
│  [body text...]                         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│            [FULL IMAGE]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Examples from reference:**
- Feature explanations followed by product photography

**How it works:**
- Clear content zones: read first, see second (or vice versa)
- Image can be full-bleed or contained
- Works well for detailed explanations that need visual proof
- Allows more text than side-by-side layouts

**When to use:**
- Detailed feature explanations
- Technical content with visual demonstration
- Any content needing longer text treatment

**Specifications:**
- Text: centered or left-aligned, constrained width (692px typical)
- Image: full section width or constrained with padding
- Vertical spacing: 48-80px between text and image blocks

**HLV Application:**
Methodology explanations: describe the concept, show it in action.

---

## 5.3 Image Pair

**What it is**
Two related images side-by-side, often showing different perspectives or contexts.

**Pattern structure:**
```
┌─────────────────┬─────────────────┐
│                 │                 │
│    [IMAGE 1]    │    [IMAGE 2]    │
│                 │                 │
└─────────────────┴─────────────────┘
```

**Examples from reference:**
- Environmental section: solar farm + person by waterfall
- Behind-the-scenes: two workplace photography angles

**How it works:**
- Images are related but show different perspectives
- Equal sizing creates balanced composition
- Gap between (16-24px) creates distinct units
- Often used for lifestyle/values content

**When to use:**
- Environmental/values messaging
- Multiple contexts for same concept
- Before/after or comparison
- Human-centered storytelling

**Specifications:**
- Gap: 16-24px
- Images: equal width (50/50) or slight variation (45/55)
- Aspect ratios: consistent between pair
- Corner radius: 0 (Apple) or subtle (16-24px) if rounded

**HLV Application:**
Cohort photos, venue images, before/after project documentation.

---

## 5.4 Product Reveal (Partial Crop)

**What it is**
A product image cropped to show only a portion, creating intrigue or focusing on a specific detail.

**Pattern structure:**
```
[PARTIAL PRODUCT IMAGE - cropped at edge]

[text content below]
```

**Examples from reference:**
- Mac Pro grille cropped at top of frame
- Mac Studio bottom/speaker detail emerging from top

**How it works:**
- Product "enters" the frame rather than sitting complete within it
- Creates depth and dynamism
- Focuses attention on specific detail
- The crop is intentional, not arbitrary—reveals what matters

**When to use:**
- Section transitions (product peeks in from previous section)
- Detail emphasis (showing specific component)
- Creating visual interest without full product shot

**Specifications:**
- Crop: typically 30-60% of product visible
- Edge alignment: product touches or nearly touches frame edge
- Shadow/lighting: appropriate for dark/light mode

**HLV Application:**
Partial views of student work, tools being used, workshop environments.

---

# 6. Data Visualization Components

## 6.1 Performance Chart

**What it is**
A simple chart showing performance comparison, often with gradient line treatment.

**Pattern structure:**
```
        [Chart title]
  │
  │           ⬆ Apple product
  │        ╱
  │      ╱
  │    ╱ - - competitor
  │  ╱
  └────────────────────
        [axis label]
```

**Examples from reference:**
- GPU performance vs. power chart (M1 vs. PC laptop chip)
- Gradient purple-to-pink line for Apple, gray for competitor

**How it works:**
- Apple line uses gradient (reinforces brand, draws eye)
- Competitor line is gray/neutral
- Minimal axis labels—chart is illustrative, not data-dense
- Stat callouts alongside explain the key takeaway
- Dark background for performance content

**When to use:**
- Performance comparisons
- Efficiency claims
- Any metric that benefits from visual trajectory

**Specifications:**
- Chart area: ~60% of composition
- Stat callouts: adjacent, right side
- Grid lines: minimal or none
- Gradient: brand-appropriate colors

**HLV Application:**
Program outcomes visualization (learning progression, venture milestones).

---

## 6.2 Benchmark Bar Chart

**What it is**
Horizontal bars showing relative performance across multiple products/configurations.

**Pattern structure:**
```
[App name]     ━━━━━━━━━━━━━━━━ [Value]
               ━━━━━━━━━━━ [Value]
               ━━━━━ [Baseline]
```

**Examples from reference:**
- Logic Pro X benchmark: full bar, 3.7x bar, baseline bar

**How it works:**
- Current/featured product has longest bar (full or near-full)
- Previous generations shown shorter
- Baseline explicitly labeled
- Bar thickness consistent, length varies
- Color: dark for featured, gray for comparison

**When to use:**
- Multi-generation comparisons
- Application-specific benchmarks
- Any relative performance data

**Specifications:**
- Bar height: 8-12px
- Bar color: #1D1D1F (featured), #86868B (comparison)
- Spacing: 24-32px between bars
- Value labels: right-aligned at end of bar

**HLV Application:**
Could adapt for showing relative skill progression or comparative program outcomes.

---

## 6.3 Exploded Diagram

**What it is**
Product layers separated horizontally or vertically to reveal internal structure.

**Pattern structure:**
```
[Layer 1] [Layer 2] [Layer 3] [Layer 4] [Layer 5]
     ↔        ↔         ↔        ↔
```

**Examples from reference:**
- Pro Display XDR layer stack (backlight, LED array, diffuser, glass, image)

**How it works:**
- Layers separated by consistent gap
- Perspective creates depth (often slight angle)
- Each layer is distinct and identifiable
- Often paired with navigation arrows to step through layers
- Light mode for educational content

**When to use:**
- Technology explanations
- Process visualization
- Multi-component systems
- Educational breakdowns

**Specifications:**
- Layer gap: 16-24px
- Perspective: subtle 3D rotation or flat
- Background: light (#FFFFFF or #F5F5F7)
- Navigation: ‹ › arrows if interactive

**HLV Application:**
Process methodology breakdowns: "The 5 stages of Design Thinking" as visual layers.

---

# 7. Section Patterns

## 7.1 Dark Section (Performance/Tech)

**When to use:**
- Hardware revelations (chips, internals)
- Performance data and comparisons
- Professional/pro-user content
- Cinematic drama, premium positioning

**Specifications:**
- Background: #000000 or near-black (#1D1D1F)
- Text: #FFFFFF primary, #86868B secondary
- Link blue: #2997FF
- Accent: gradient for emphasis

---

## 7.2 Light Section (Values/Education)

**When to use:**
- Values and mission content
- Environmental messaging
- Text-heavy explanations
- Human/lifestyle contexts
- Educational technical content

**Specifications:**
- Background: #FFFFFF or #F5F5F7
- Text: #1D1D1F primary, #6E6E73 secondary
- Link blue: #0066CC
- Accent: green for environmental, brand color for features

---

## 7.3 Colored Section (Brand/Category)

**When to use:**
- Environmental content (green)
- Product category differentiation
- Values statements requiring warmth
- Special campaign content

**Specifications:**
- Background: brand-appropriate color (e.g., #4A7C4E for environment)
- Text: white or near-white
- Maintained readability contrast
- Complementary accent colors

---

# 8. What's Deliberately Absent

Understanding Apple's system requires noting what they *never* do:

**Never present:**
- Decorative elements (swooshes, abstract shapes, background patterns)
- Drop shadows on text
- Borders or boxes around content
- More than one gradient per composition
- Competing visual hierarchies
- Anything existing purely for "visual interest"
- Underlines on headlines
- All-caps body text
- Italics in headlines (rare exception: continuation text)

**The principle:**
Every element has a job. If it doesn't have a job, it's not there.

---

# 9. Decision Framework Summary

| If you need to... | Use this component |
|---|---|
| Make a claim and explain it | Weight Transition Headline |
| Highlight the "news" | Gradient Text Marker |
| Show impressive numbers | Massive Stat Callout (or Pair) |
| Display technical specs | Spec Grid |
| Group related features | Feature Cards |
| Show social proof | Quote Card |
| Let users choose content | Tab Menu |
| Link to more info | Text Link CTA |
| Open a page/section | Hero Split |
| Show performance | Performance Chart |
| Explain technology | Exploded Diagram |
| Create premium focus | Dark Section |
| Create approachability | Light Section |

---

# 10. HLV Translation Notes

When adapting these patterns for Hudson Lab Ventures:

**Typography:**
- Replace SF Pro with Manrope
- Maintain weight transition logic (Bold → Regular)
- Keep tight headline line-heights (1.05-1.15)

**Color:**
- Primary: Navy (#182D53) replaces Apple black
- Accent: Emerald (#00D866) for highlights
- Secondary text: appropriate grays from HLV palette

**Spacing:**
- Maintain 8px base unit
- Generous whitespace remains essential

**Components:**
- Adapt card patterns for curriculum modules
- Use stat callouts for program outcomes
- Tab menus for program/day navigation

**What to keep:**
- Weight transition technique
- Extreme scale contrast for stats
- Restraint in accent usage
- Dark/light mode logic for content types
- "UI scaffolding" for structure without decoration

**What to adapt:**
- Gradient colors (emerald-based)
- Photography style (educational context)
- Content density (more text-appropriate for curriculum)

---

*This document pairs with the extracted design tokens in `apple-design-research/extracted/` for implementation.*

---

**Next deliverable:** Typography System document codifying weight transition rules and scale hierarchy.
