// ============================================
// TOKEN MANAGEMENT - V2 (GitHub-sourced)
// ============================================
// Replace the existing TOKEN MANAGEMENT section in Code.gs with this.
// Fetches computed tokens from GitHub instead of Google Sheet.

/**
 * GitHub source for computed tokens
 * Generated from: design-system/generative-rules.md
 */
const TOKENS_URL = 'https://raw.githubusercontent.com/owenmcfadzen/HLV-Assets/main/design-system/tokens-computed.json';

/**
 * Default tokens - fallback if GitHub fetch fails
 * These should match tokens-computed.json structure
 */
function getDefaultTokens() {
  return {
    colors: {
      primary: '#182D53',
      accent: '#00D866',
      warning: '#F59E0B',
      surface: '#FFFFFF',
      surface_alt: '#F5F5F7',
      text: '#1D1D1F',
      text_muted: '#6E6E73',
      text_light: '#86868B',
      text_inverse: '#FFFFFF',
      text_inverse_muted: '#B8C5D9',
      text_inverse_light: '#8A9BB5',
      text_inverse_faint: '#5A6B82',
      border: '#E5E5E5',
      border_dark: '#D2D2D7',
      accent_light: '#E6FBF0',
      warning_light: '#FEF3C7',
      error_light: '#FEE2E2',
      success_light: '#D1FAE5'
    },
    fonts: {
      heading: 'Manrope',
      body: 'Lora'
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    sizes: {
      display_large: 48,
      display: 38,
      title: 28,
      heading: 24,
      subtitle: 18,
      body: 14,
      body_small: 12,
      caption: 11,
      label: 10,
      // Aliases for backward compatibility
      title_large: 48
    },
    lineheights: {
      tight: 1.15,
      normal: 1.4,
      relaxed: 1.5
    },
    grid: {
      slide_width: 720,
      slide_height: 405,
      margin: 50,
      margin_y: 28,
      columns: 12,
      column_width: 48,
      gutter: 8,
      content_width: 620,
      content_height: 349,
      header_height: 40,
      footer_height: 24
    },
    spacing: {
      none: 0,
      atomic: 6,
      xs: 6,
      tight: 12,
      sm: 12,
      related: 24,
      md: 24,
      distinct: 48,
      lg: 32,
      xl: 48,
      separate: 96,
      xxl: 96
    },
    // Generative rules metadata (for validation)
    generative: {
      content_density: 0.7,
      spacing_base: 24,
      typography_base: 18,
      weight_transition_max_words: 15,
      ideas_per_container: 1
    },
    content_constraints: {
      headline_max_width: 504,
      body_max_width: 468,
      quote_max_width: 576
    }
  };
}

/**
 * Load tokens from GitHub
 * Fetches tokens-computed.json from HLV-Assets repo
 */
function loadTokensFromGitHub() {
  try {
    const response = UrlFetchApp.fetch(TOKENS_URL, {
      muteHttpExceptions: true,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      Logger.log('GitHub fetch failed: ' + response.getResponseCode());
      return null;
    }
    
    const json = JSON.parse(response.getContentText());
    
    // Add backward-compatible aliases
    if (json.sizes && !json.sizes.title_large) {
      json.sizes.title_large = json.sizes.display_large;
    }
    
    Logger.log('Loaded tokens from GitHub (v' + (json._meta?.version || 'unknown') + ')');
    return json;
    
  } catch (e) {
    Logger.log('Error loading tokens from GitHub: ' + e.message);
    return null;
  }
}

/**
 * Load tokens - tries GitHub first, falls back to defaults
 */
function loadTokens() {
  const githubTokens = loadTokensFromGitHub();
  if (githubTokens) {
    return githubTokens;
  }
  Logger.log('Using default tokens (GitHub unavailable)');
  return getDefaultTokens();
}

// Cache tokens for performance
let _cachedTokens = null;
const USE_CACHE = true;  // Enable caching for production

function getTokens() {
  if (USE_CACHE && _cachedTokens) {
    return _cachedTokens;
  }
  _cachedTokens = loadTokens();
  return _cachedTokens;
}

/**
 * Force reload tokens from GitHub
 */
function reloadTokens() {
  _cachedTokens = null;
  const t = getTokens();
  const source = t._meta ? 'GitHub (v' + t._meta.version + ')' : 'Default (fallback)';
  SlidesApp.getUi().alert(
    'Tokens reloaded from: ' + source + '\n\n' +
    'Heading font: ' + t.fonts.heading + '\n' +
    'Body font: ' + t.fonts.body + '\n' +
    'Accent: ' + t.colors.accent + '\n' +
    'Spacing base: ' + (t.generative?.spacing_base || 24) + 'px'
  );
}

/**
 * Debug: Show current token values and source
 */
function debugTokens() {
  const t = getTokens();
  let msg = 'SOURCE: ' + (t._meta ? 'GitHub v' + t._meta.version : 'Default') + '\n\n';
  
  msg += 'FONTS:\n';
  msg += '  heading: ' + t.fonts.heading + '\n';
  msg += '  body: ' + t.fonts.body + '\n\n';
  
  msg += 'COLORS:\n';
  msg += '  primary: ' + t.colors.primary + '\n';
  msg += '  accent: ' + t.colors.accent + '\n';
  msg += '  text: ' + t.colors.text + '\n\n';
  
  msg += 'SIZES (pt):\n';
  msg += '  display_large: ' + t.sizes.display_large + '\n';
  msg += '  title: ' + t.sizes.title + '\n';
  msg += '  body: ' + t.sizes.body + '\n\n';
  
  msg += 'SPACING (pt):\n';
  msg += '  atomic: ' + t.spacing.atomic + '\n';
  msg += '  tight: ' + t.spacing.tight + '\n';
  msg += '  related: ' + t.spacing.related + '\n';
  msg += '  distinct: ' + t.spacing.distinct + '\n\n';
  
  msg += 'GRID:\n';
  msg += '  margin: ' + t.grid.margin + '\n';
  msg += '  content_width: ' + t.grid.content_width + '\n';
  
  if (t.generative) {
    msg += '\nGENERATIVE RULES:\n';
    msg += '  content_density: ' + t.generative.content_density + '\n';
    msg += '  spacing_base: ' + t.generative.spacing_base + 'px\n';
    msg += '  max_words_transition: ' + t.generative.weight_transition_max_words + '\n';
  }
  
  SlidesApp.getUi().alert(msg);
}


// ============================================
// UPDATED GRID SYSTEM
// ============================================
// Uses new spacing tokens from generative rules

function grid() {
  const t = getTokens();
  const g = t.grid;
  const s = t.spacing;
  
  return {
    // Get x position for start of column (1-indexed)
    colX: function(colNum) {
      return g.margin + (colNum - 1) * (g.column_width + g.gutter);
    },
    
    // Get width spanning N columns (including internal gutters)
    colSpan: function(numCols) {
      return numCols * g.column_width + (numCols - 1) * g.gutter;
    },
    
    // Content area (inside margins)
    contentWidth: function() {
      return g.slide_width - (g.margin * 2);
    },
    
    contentHeight: function() {
      return g.slide_height - (g.margin_y * 2);
    },
    
    // Quick accessors
    margin: g.margin,
    marginY: g.margin_y || g.margin,
    slideWidth: g.slide_width,
    slideHeight: g.slide_height,
    gutter: g.gutter,
    
    // Spacing shortcuts (from generative rules)
    spacing: {
      atomic: s.atomic,      // 6pt - eyebrow → headline
      tight: s.tight,        // 12pt - items in same group
      related: s.related,    // 24pt - headline → body
      distinct: s.distinct,  // 48pt - section breaks
      separate: s.separate   // 96pt - major divisions
    }
  };
}


// ============================================
// HELPER: Semantic spacing
// ============================================
// Use these instead of hardcoded values

function sp() {
  const s = getTokens().spacing;
  return {
    // Generative rule names
    atomic: s.atomic,        // Eyebrow to headline
    tight: s.tight,          // Items in same group
    related: s.related,      // Headline to body
    distinct: s.distinct,    // Section to section
    separate: s.separate,    // Major breaks
    
    // Legacy aliases
    xs: s.atomic,
    sm: s.tight,
    md: s.related,
    lg: s.distinct,
    xl: s.separate
  };
}


// ============================================
// HELPER: Semantic typography
// ============================================

function type() {
  const t = getTokens();
  return {
    // Size
    displayLarge: t.sizes.display_large,
    display: t.sizes.display,
    title: t.sizes.title,
    heading: t.sizes.heading,
    subtitle: t.sizes.subtitle,
    body: t.sizes.body,
    bodySmall: t.sizes.body_small,
    caption: t.sizes.caption,
    label: t.sizes.label,
    
    // Font families
    headingFont: t.fonts.heading,
    bodyFont: t.fonts.body,
    
    // Weights
    regular: t.weights.regular,
    medium: t.weights.medium,
    semibold: t.weights.semibold,
    bold: t.weights.bold,
    
    // Line heights
    tight: t.lineheights.tight,
    normal: t.lineheights.normal,
    relaxed: t.lineheights.relaxed
  };
}


// ============================================
// HELPER: Semantic colors
// ============================================

function clr() {
  const c = getTokens().colors;
  return {
    // Primary palette
    primary: c.primary,
    accent: c.accent,
    warning: c.warning,
    
    // Surfaces
    surface: c.surface,
    surfaceAlt: c.surface_alt,
    
    // Text
    text: c.text,
    textMuted: c.text_muted,
    textLight: c.text_light,
    textInverse: c.text_inverse,
    textInverseMuted: c.text_inverse_muted,
    textInverseLight: c.text_inverse_light,
    
    // Borders
    border: c.border,
    borderDark: c.border_dark,
    
    // Semantic backgrounds
    accentLight: c.accent_light,
    warningLight: c.warning_light,
    errorLight: c.error_light,
    successLight: c.success_light
  };
}
