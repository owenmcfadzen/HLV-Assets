# HLV Slides Generator v2

Generate presentations using values derived from Generative Design Rules.

**Source of Truth:** `design-system/generative-rules.md`

---

## Computed Tokens

All values derive from generative rules. Change the rules, values update.

### From Generative Rules → Slide Values

```python
# ============================================================
# GENERATIVE RULES (source of truth)
# ============================================================

GENERATIVE = {
    # Format Adaptation Matrix (generative-rules.md §11)
    'slides': {
        'content_density': 0.7,      # 30-35% content
        'spacing_base': 24,          # px
        'typography_base': 18,       # px
        'weight_transition_max': 15, # words
        'ideas_per_container': 1,
        'padding_percent': 0.07,     # 6-8% → 7%
    },
    
    # Spacing Relationships (generative-rules.md §5)
    'spacing_multipliers': {
        'atomic': 0.25,    # Eyebrow → Headline
        'tight': 0.5,      # Items in same group
        'related': 1.0,    # Headline → Body (base)
        'distinct': 2.0,   # Section → Section
        'separate': 4.0,   # Major divisions
    },
    
    # Typography Scale Ratios (generative-rules.md §8)
    'type_ratios': {
        'display_large': 3.5,
        'display': 2.75,
        'headline': 2.0,
        'title': 1.5,
        'body': 1.0,
        'body_small': 0.875,
        'caption': 0.67,
    },
    
    # Line Heights (generative-rules.md §8)
    'line_heights': {
        'display': 1.05,
        'headline': 1.15,
        'title': 1.2,
        'body': 1.5,
        'caption': 1.4,
    },
    
    # Weights (generative-rules.md §8)
    'weights': {
        'display': 700,
        'headline': 700,
        'title': 600,
        'body': 400,
        'eyebrow': 600,
    },
}

# ============================================================
# COMPUTED SLIDE VALUES
# ============================================================

def compute_slide_tokens():
    """Derive all slide values from generative rules."""
    
    g = GENERATIVE
    s = g['slides']
    base_spacing = s['spacing_base']
    base_type = s['typography_base']
    
    return {
        # Canvas (16:9 at 1920x1080, scaled to points)
        'canvas': {
            'width': 720,   # pt (10 inches)
            'height': 405,  # pt (5.625 inches)
        },
        
        # Padding from percentage
        'padding': {
            'x': round(720 * s['padding_percent']),   # ~50pt
            'y': round(405 * s['padding_percent']),   # ~28pt
        },
        
        # Spacing (base unit × multipliers)
        'spacing': {
            'atomic': round(base_spacing * g['spacing_multipliers']['atomic']),     # 6
            'tight': round(base_spacing * g['spacing_multipliers']['tight']),       # 12
            'related': round(base_spacing * g['spacing_multipliers']['related']),   # 24
            'distinct': round(base_spacing * g['spacing_multipliers']['distinct']), # 48
        },
        
        # Typography (base × ratios, converted to pt)
        # 18px ≈ 13.5pt, so we use 14pt as base
        'type': {
            'display_large': round(14 * g['type_ratios']['display_large']),  # 49 → 48pt
            'display': round(14 * g['type_ratios']['display']),              # 38.5 → 40pt
            'headline': round(14 * g['type_ratios']['headline']),            # 28pt
            'title': round(14 * g['type_ratios']['title']),                  # 21pt
            'body': round(14 * g['type_ratios']['body']),                    # 14pt
            'body_small': round(14 * g['type_ratios']['body_small']),        # 12pt
            'caption': round(14 * g['type_ratios']['caption']),              # 9pt → 10pt
        },
        
        # Line heights
        'line_height': g['line_heights'],
        
        # Weights
        'weight': g['weights'],
        
        # Content constraints
        'max_width': {
            'headline': round(720 * 0.70),  # 504pt
            'body': round(720 * 0.65),      # 468pt
            'quote': round(720 * 0.80),     # 576pt
        },
        
        # Content density target
        'density_target': s['content_density'],
        
        # Weight transition
        'weight_transition_max_words': s['weight_transition_max'],
    }

TOKENS = compute_slide_tokens()
```

### Color Tokens

From `design-system/tokens.json` (unchanged):

```python
COLORS = {
    'navy': '182D53',
    'emerald': '00D866',
    'white': 'FFFFFF',
    'gray100': 'F5F5F7',
    'gray500': '86868B',
    'gray600': '6E6E73',
    'gray900': '1D1D1F',
}
```

---

## Spacing Quick Reference

Derived from generative rules spacing relationships:

| Relationship | Multiplier | Computed (24px base) | Use Case |
|--------------|------------|----------------------|----------|
| Atomic | 0.25× | 6pt | Eyebrow → Headline |
| Tight | 0.5× | 12pt | List items, related text blocks |
| Related | 1× | 24pt | Headline → Body |
| Distinct | 2× | 48pt | Section breaks |
| Separate | 4× | 96pt | New slide |

---

## Typography Quick Reference

Derived from generative rules type scale:

| Level | Ratio | Computed | Weight | Line Height |
|-------|-------|----------|--------|-------------|
| Display Large | 3.5× | 48pt | 700 | 1.05 |
| Display | 2.75× | 40pt | 700 | 1.05 |
| Headline | 2× | 28pt | 700 | 1.15 |
| Title | 1.5× | 21pt | 600 | 1.2 |
| Body | 1× | 14pt | 400 | 1.5 |
| Body Small | 0.875× | 12pt | 400 | 1.5 |
| Caption/Eyebrow | 0.67× | 10pt | 600 | 1.4 |

---

## Slide Templates

### Template Structure

Each template follows generative rules hierarchy (max 3 levels):

```
Level 1: Eyebrow (context/category)
Level 2: Headline (primary message)  
Level 3: Body (supporting detail)
```

### Core Templates

#### 1. Hero (Dark)

```python
def create_hero(prs, eyebrow: str, headline: str, subtext: str = None):
    """
    Opening slide. Dark background, centered content.
    Spacing: Eyebrow → Headline = atomic (6pt)
             Headline → Subtext = related (24pt)
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank
    
    # Dark background
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor.from_string(COLORS['navy'])
    
    # Eyebrow
    add_text(slide,
        text=eyebrow.upper(),
        x=center_x(TOKENS['max_width']['headline']),
        y=Pt(160),
        width=TOKENS['max_width']['headline'],
        font_size=TOKENS['type']['caption'],
        font_weight=TOKENS['weight']['eyebrow'],
        color=COLORS['emerald'],
        align='center',
        letter_spacing=0.15,
    )
    
    # Headline
    add_text(slide,
        text=headline,
        x=center_x(TOKENS['max_width']['headline']),
        y=Pt(160 + TOKENS['type']['caption'] + TOKENS['spacing']['atomic']),
        width=TOKENS['max_width']['headline'],
        font_size=TOKENS['type']['display_large'],
        font_weight=TOKENS['weight']['display'],
        color=COLORS['white'],
        align='center',
    )
    
    # Subtext (if provided)
    if subtext:
        add_text(slide,
            text=subtext,
            x=center_x(TOKENS['max_width']['body']),
            y=Pt(160 + TOKENS['type']['caption'] + TOKENS['spacing']['atomic'] + 
                 TOKENS['type']['display_large'] + TOKENS['spacing']['related']),
            width=TOKENS['max_width']['body'],
            font_size=TOKENS['type']['body'],
            font_weight=TOKENS['weight']['body'],
            color=COLORS['gray500'],
            align='center',
        )
    
    return slide
```

#### 2. Statement (Light)

```python
def create_statement(prs, headline: str, continuation: str = None):
    """
    Single powerful idea. Weight transition pattern.
    Max continuation: 15 words (from generative rules).
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Validate weight transition
    if continuation and len(continuation.split()) > TOKENS['weight_transition_max_words']:
        raise ValueError(f"Continuation exceeds {TOKENS['weight_transition_max_words']} words")
    
    # Build combined text with weight transition
    y_pos = (TOKENS['canvas']['height'] - TOKENS['type']['display']) / 2
    
    # Bold headline
    tf = add_text(slide,
        text=headline,
        x=TOKENS['padding']['x'],
        y=y_pos,
        width=TOKENS['max_width']['headline'],
        font_size=TOKENS['type']['display'],
        font_weight=TOKENS['weight']['headline'],
        color=COLORS['gray900'],
    )
    
    # Lighter continuation (same text frame, different run)
    if continuation:
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = f" {continuation}"
        run.font.size = Pt(TOKENS['type']['display'])
        run.font.bold = False
        run.font.color.rgb = RGBColor.from_string(COLORS['gray600'])
    
    return slide
```

#### 3. Stat (Dark, Split)

```python
def create_stat(prs, number: str, label: str, context_bold: str, context_light: str = None):
    """
    Massive stat left, context right.
    Number: Display Large (48pt) at 4× scale = 192pt effective
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Dark background
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor.from_string(COLORS['navy'])
    
    # Left side: Number
    add_text(slide,
        text=number,
        x=TOKENS['padding']['x'],
        y=Pt(120),
        width=Pt(300),
        font_size=Pt(140),  # Massive
        font_weight=700,
        color=COLORS['white'],
    )
    
    # Label below number
    add_text(slide,
        text=label,
        x=TOKENS['padding']['x'],
        y=Pt(270),
        width=Pt(300),
        font_size=TOKENS['type']['body'],
        font_weight=TOKENS['weight']['body'],
        color=COLORS['gray500'],
    )
    
    # Right side: Context with weight transition
    right_x = TOKENS['canvas']['width'] / 2 + TOKENS['spacing']['distinct']
    
    tf = add_text(slide,
        text=context_bold,
        x=right_x,
        y=Pt(160),
        width=Pt(280),
        font_size=TOKENS['type']['title'],
        font_weight=600,
        color=COLORS['white'],
    )
    
    if context_light:
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = f" {context_light}"
        run.font.size = Pt(TOKENS['type']['title'])
        run.font.bold = False
        run.font.color.rgb = RGBColor.from_string(COLORS['gray500'])
    
    return slide
```

#### 4. List (Light)

```python
def create_list(prs, items: list, eyebrow: str = None):
    """
    Numbered list with decorative numbers.
    Spacing between items: tight (12pt)
    Number opacity: 25% (from generative rules §9)
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    y_pos = TOKENS['padding']['y']
    
    # Eyebrow (optional)
    if eyebrow:
        add_text(slide,
            text=eyebrow.upper(),
            x=TOKENS['padding']['x'],
            y=y_pos,
            width=TOKENS['max_width']['headline'],
            font_size=TOKENS['type']['caption'],
            font_weight=TOKENS['weight']['eyebrow'],
            color=COLORS['emerald'],
            letter_spacing=0.15,
        )
        y_pos += TOKENS['type']['caption'] + TOKENS['spacing']['distinct']
    
    # Items
    for i, item in enumerate(items):
        num = f"{i+1:02d}"
        
        # Decorative number (25% opacity emerald)
        add_text(slide,
            text=num,
            x=TOKENS['padding']['x'],
            y=y_pos,
            width=Pt(50),
            font_size=TOKENS['type']['headline'],
            font_weight=700,
            color=COLORS['emerald'],
            opacity=0.25,
        )
        
        # Item title
        add_text(slide,
            text=item['title'],
            x=TOKENS['padding']['x'] + Pt(60),
            y=y_pos,
            width=TOKENS['max_width']['body'],
            font_size=TOKENS['type']['title'],
            font_weight=TOKENS['weight']['title'],
            color=COLORS['gray900'],
        )
        
        # Item description (if provided)
        if 'desc' in item:
            add_text(slide,
                text=item['desc'],
                x=TOKENS['padding']['x'] + Pt(60),
                y=y_pos + TOKENS['type']['title'] + TOKENS['spacing']['atomic'],
                width=TOKENS['max_width']['body'],
                font_size=TOKENS['type']['body_small'],
                font_weight=TOKENS['weight']['body'],
                color=COLORS['gray600'],
            )
            y_pos += TOKENS['type']['title'] + TOKENS['spacing']['atomic'] + TOKENS['type']['body_small']
        else:
            y_pos += TOKENS['type']['title']
        
        y_pos += TOKENS['spacing']['tight']  # 12pt between items
    
    return slide
```

#### 5. Process (Horizontal Steps)

```python
def create_process(prs, steps: list, eyebrow: str = None, headline: str = None):
    """
    Horizontal step flow with numbered circles.
    Gap between steps: distinct (48pt)
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    y_pos = TOKENS['padding']['y']
    
    # Eyebrow
    if eyebrow:
        add_text(slide, text=eyebrow.upper(), x=TOKENS['padding']['x'], y=y_pos,
                 width=TOKENS['max_width']['headline'], font_size=TOKENS['type']['caption'],
                 font_weight=TOKENS['weight']['eyebrow'], color=COLORS['emerald'],
                 letter_spacing=0.15)
        y_pos += TOKENS['type']['caption'] + TOKENS['spacing']['atomic']
    
    # Headline
    if headline:
        add_text(slide, text=headline, x=TOKENS['padding']['x'], y=y_pos,
                 width=TOKENS['max_width']['headline'], font_size=TOKENS['type']['headline'],
                 font_weight=TOKENS['weight']['headline'], color=COLORS['gray900'])
        y_pos += TOKENS['type']['headline'] + TOKENS['spacing']['distinct']
    
    # Calculate step positions
    content_width = TOKENS['canvas']['width'] - (2 * TOKENS['padding']['x'])
    step_width = content_width / len(steps)
    
    for i, step in enumerate(steps):
        x_center = TOKENS['padding']['x'] + (i * step_width) + (step_width / 2)
        
        # Number circle
        circle_size = 40
        add_circle(slide,
            x=x_center - (circle_size / 2),
            y=y_pos,
            size=circle_size,
            fill=COLORS['navy'],
        )
        add_text(slide,
            text=str(i + 1),
            x=x_center - (circle_size / 2),
            y=y_pos + 8,
            width=circle_size,
            font_size=TOKENS['type']['body'],
            font_weight=700,
            color=COLORS['white'],
            align='center',
        )
        
        # Step title
        add_text(slide,
            text=step['title'],
            x=x_center - (step_width / 2) + 10,
            y=y_pos + circle_size + TOKENS['spacing']['tight'],
            width=step_width - 20,
            font_size=TOKENS['type']['body'],
            font_weight=TOKENS['weight']['title'],
            color=COLORS['gray900'],
            align='center',
        )
        
        # Step description
        if 'desc' in step:
            add_text(slide,
                text=step['desc'],
                x=x_center - (step_width / 2) + 10,
                y=y_pos + circle_size + TOKENS['spacing']['tight'] + TOKENS['type']['body'] + TOKENS['spacing']['atomic'],
                width=step_width - 20,
                font_size=TOKENS['type']['body_small'],
                font_weight=TOKENS['weight']['body'],
                color=COLORS['gray600'],
                align='center',
            )
    
    return slide
```

---

## Helper Functions

```python
from pptx import Presentation
from pptx.util import Pt, Inches, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

def add_text(slide, text, x, y, width, font_size, font_weight=400, 
             color='1D1D1F', align='left', letter_spacing=None, opacity=1.0):
    """Add a text box with generative-rules-derived styling."""
    
    shape = slide.shapes.add_textbox(Pt(x), Pt(y), Pt(width), Pt(font_size * 2))
    tf = shape.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.name = 'Manrope'
    p.font.bold = font_weight >= 600
    p.font.color.rgb = RGBColor.from_string(color)
    
    if align == 'center':
        p.alignment = PP_ALIGN.CENTER
    elif align == 'right':
        p.alignment = PP_ALIGN.RIGHT
    
    # Letter spacing for eyebrows
    if letter_spacing:
        p.font._element.set(qn('a:spc'), str(int(letter_spacing * 100)))
    
    return tf

def add_circle(slide, x, y, size, fill):
    """Add a filled circle."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.OVAL, Pt(x), Pt(y), Pt(size), Pt(size)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor.from_string(fill)
    shape.line.fill.background()
    return shape

def center_x(width):
    """Calculate x position to center element of given width."""
    return (TOKENS['canvas']['width'] - width) / 2
```

---

## Full Generation Example

```python
from pptx import Presentation
from pptx.util import Inches

def generate_problem_reframing_deck():
    """Generate the Problem Reframing deck using generative rules."""
    
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(5.625)
    
    # Slide 1: Hero
    create_hero(prs,
        eyebrow="Foundation Chapter",
        headline="Problem Reframing",
        subtext="The way you frame a problem determines what solutions you can even imagine."
    )
    
    # Slide 2: Statement
    create_statement(prs,
        headline="Problems get locked in.",
        continuation="The frame becomes invisible."
    )
    
    # Slide 3: Stat
    create_stat(prs,
        number="6",
        label="lenses to see differently",
        context_bold="Each lens opens a different door.",
        context_light="Same problem, six solution spaces."
    )
    
    # Slide 4-5: Lenses (split for one-idea-per-slide rule)
    create_list(prs,
        items=[
            {'title': 'Frame the Problem', 'desc': "What exactly is the problem? Who's involved?"},
            {'title': 'Look Outside', 'desc': "What are we missing? What assumptions?"},
            {'title': 'Rethink the Goal', 'desc': "Is there a better goal to pursue?"},
        ]
    )
    create_list(prs,
        items=[
            {'title': 'Bright Spots', 'desc': "When does this not happen? What's working?"},
            {'title': 'Look in the Mirror', 'desc': "What's our role in creating this?"},
            {'title': 'Their Perspective', 'desc': "What problem are they trying to solve?"},
        ]
    )
    
    # Slide 6: Process
    create_process(prs,
        eyebrow="Running the session",
        headline="The Reframing Process",
        steps=[
            {'title': 'Present', 'desc': '"It sucks that..." statement'},
            {'title': 'Clarify', 'desc': '30 seconds max'},
            {'title': 'Reframe', 'desc': 'Apply lenses, 5-7 min'},
            {'title': 'Capture', 'desc': 'Sticky notes below'},
        ]
    )
    
    # Slide 7: Close
    create_hero(prs,
        eyebrow="Remember",
        headline="The frame determines the solution.",
        subtext="Six lenses. Each opens a different door."
    )
    
    prs.save('/mnt/user-data/outputs/problem-reframing.pptx')
    return prs
```

---

## Validation

Before generating, the system validates against generative rules:

```python
def validate_slide(slide_type, content):
    """Validate content against generative rules."""
    
    errors = []
    
    # One idea per slide
    if slide_type == 'statement' and '\n\n' in content.get('headline', ''):
        errors.append("Statement slide should contain one idea only")
    
    # Weight transition word limit
    if 'continuation' in content:
        words = len(content['continuation'].split())
        max_words = TOKENS['weight_transition_max_words']
        if words > max_words:
            errors.append(f"Continuation ({words} words) exceeds {max_words} word limit")
    
    # Hierarchy depth
    levels = sum([
        bool(content.get('eyebrow')),
        bool(content.get('headline')),
        bool(content.get('body')),
    ])
    if levels > 3:
        errors.append("Exceeds 3 hierarchy levels")
    
    return errors
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2025-12-17 | Complete rewrite using generative rules as source |
| 1.0 | Previous | Hardcoded values |

---

## Integration

This generator reads from:
- `generative-rules.md` → Spacing, typography, density rules
- `tokens.json` → Colors
- `hlv-slide-design.skill` → Slide-specific patterns

When generative rules change, re-run `compute_slide_tokens()` to get updated values.
