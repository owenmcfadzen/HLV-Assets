/**
 * HLV Asset System - Utility Functions
 * Token resolution, grid calculations, and style helpers
 */

/**
 * Resolve a dot-notation token path to its value
 * @param {string} path - Token path like "primary.navy" or "spacing.md"
 * @param {object} tokens - The tokens object
 * @returns {*} The resolved value
 */
function resolveToken(path, tokens) {
  if (!path || typeof path !== 'string') return path;

  // Handle "none" explicitly
  if (path === 'none') return null;

  // If it looks like a raw value (starts with # for color, or is a number), return as-is
  if (path.startsWith('#') || !isNaN(path)) return path;

  // Check if it's a color token path (contains a dot and refers to colors)
  const parts = path.split('.');

  // Try to resolve from colors first
  let value = tokens.colors;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      // If not found in colors, try from root
      value = tokens;
      for (const p of parts) {
        if (value && typeof value === 'object' && p in value) {
          value = value[p];
        } else {
          return path; // Return original if not found
        }
      }
      break;
    }
  }

  return value;
}

/**
 * Resolve a stroke width token
 * @param {string|number} width - Stroke width token name or value
 * @param {object} tokens - The tokens object
 * @returns {number} The stroke width in pixels
 */
function resolveStrokeWidth(width, tokens) {
  if (typeof width === 'number') return width;
  if (width === 'none' || !width) return 0;

  const strokeTokens = tokens.shapes?.stroke || {};
  return strokeTokens[width] ?? 1;
}

/**
 * Resolve a radius token
 * @param {string|number} radius - Radius token name or value
 * @param {object} tokens - The tokens object
 * @returns {number} The radius in pixels
 */
function resolveRadius(radius, tokens) {
  if (typeof radius === 'number') return radius;
  if (radius === 'none' || !radius) return 0;

  const radiusTokens = tokens.shapes?.radius || {};
  return radiusTokens[radius] ?? 0;
}

/**
 * Resolve a spacing token
 * @param {string|number} spacing - Spacing token name or value
 * @param {object} tokens - The tokens object
 * @returns {number} The spacing in pixels
 */
function resolveSpacing(spacing, tokens) {
  if (typeof spacing === 'number') return spacing;
  if (!spacing) return 0;

  return tokens.spacing?.[spacing] ?? 0;
}

/**
 * Convert grid coordinates to pixel positions
 * @param {object} grid - Grid specification { col, row, colSpan, rowSpan, align, valign, offsetX, offsetY }
 * @param {object} canvasConfig - Canvas configuration { width, height }
 * @param {object} gridConfig - Grid configuration { columns, rows, margin, gutter }
 * @returns {object} { x, y, width, height } in pixels
 */
function gridToPixels(grid, canvasConfig, gridConfig) {
  const { width: canvasWidth, height: canvasHeight } = canvasConfig;
  const { columns, rows, margin, gutter } = gridConfig;

  // Calculate usable area
  const usableWidth = canvasWidth - (2 * margin);
  const usableHeight = canvasHeight - (2 * margin);

  // Calculate cell dimensions (accounting for gutters)
  const totalGutterWidth = (columns - 1) * gutter;
  const totalGutterHeight = (rows - 1) * gutter;

  const cellWidth = (usableWidth - totalGutterWidth) / columns;
  const cellHeight = (usableHeight - totalGutterHeight) / rows;

  // Get grid values with defaults
  const col = grid.col ?? 1;
  const row = grid.row ?? 1;
  const colSpan = grid.colSpan ?? 1;
  const rowSpan = grid.rowSpan ?? 1;
  const align = grid.align ?? 'center';
  const valign = grid.valign ?? 'center';
  const offsetX = grid.offsetX ?? 0;
  const offsetY = grid.offsetY ?? 0;

  // Calculate position (1-indexed to 0-indexed)
  const colIndex = col - 1;
  const rowIndex = row - 1;

  // Calculate top-left of the grid cell
  const cellX = margin + (colIndex * (cellWidth + gutter));
  const cellY = margin + (rowIndex * (cellHeight + gutter));

  // Calculate spanned dimensions
  const spanWidth = (colSpan * cellWidth) + ((colSpan - 1) * gutter);
  const spanHeight = (rowSpan * cellHeight) + ((rowSpan - 1) * gutter);

  // Calculate center of the cell span
  let x = cellX + (spanWidth / 2);
  let y = cellY + (spanHeight / 2);

  // Apply alignment
  if (align === 'start') x = cellX;
  if (align === 'end') x = cellX + spanWidth;
  if (valign === 'start') y = cellY;
  if (valign === 'end') y = cellY + spanHeight;

  // Apply offsets
  x += offsetX;
  y += offsetY;

  return {
    x,
    y,
    width: spanWidth,
    height: spanHeight,
    cellX,
    cellY
  };
}

/**
 * Convert grid column/row to pixel coordinates (for shapes with point arrays)
 * Supports both grid-based (col/row) and absolute (x/y) positioning
 * @param {object} point - Point with col/row OR x/y
 * @param {object} canvasConfig - Canvas configuration
 * @param {object} gridConfig - Grid configuration
 * @returns {object} { x, y } in pixels
 */
function gridPointToPixels(point, canvasConfig, gridConfig) {
  // If point has absolute x/y coordinates, use them directly
  if (point.x !== undefined && point.y !== undefined) {
    return { x: point.x, y: point.y };
  }

  const { width: canvasWidth, height: canvasHeight } = canvasConfig;
  const { columns, rows, margin, gutter } = gridConfig;

  const usableWidth = canvasWidth - (2 * margin);
  const usableHeight = canvasHeight - (2 * margin);

  const totalGutterWidth = (columns - 1) * gutter;
  const totalGutterHeight = (rows - 1) * gutter;

  const cellWidth = (usableWidth - totalGutterWidth) / columns;
  const cellHeight = (usableHeight - totalGutterHeight) / rows;

  // Convert fractional columns/rows to pixel positions
  const colIndex = (point.col ?? 1) - 1;
  const rowIndex = (point.row ?? 1) - 1;

  // For fractional positions, interpolate
  const wholeCol = Math.floor(colIndex);
  const fracCol = colIndex - wholeCol;

  const wholeRow = Math.floor(rowIndex);
  const fracRow = rowIndex - wholeRow;

  const x = margin + (wholeCol * (cellWidth + gutter)) + (fracCol * cellWidth);
  const y = margin + (wholeRow * (cellHeight + gutter)) + (fracRow * cellHeight);

  return { x, y };
}

/**
 * Convert position to pixels - handles both grid and absolute positioning
 * @param {object} positionSpec - Either { grid: {...} } or { position: { x, y } }
 * @param {object} canvasConfig - Canvas configuration
 * @param {object} gridConfig - Grid configuration
 * @returns {object} { x, y, width, height } in pixels
 */
function positionToPixels(positionSpec, canvasConfig, gridConfig) {
  // Absolute positioning
  if (positionSpec.position) {
    return {
      x: positionSpec.position.x,
      y: positionSpec.position.y,
      width: positionSpec.size?.width || 100,
      height: positionSpec.size?.height || 40
    };
  }

  // Grid-based positioning
  if (positionSpec.grid) {
    return gridToPixels(positionSpec.grid, canvasConfig, gridConfig);
  }

  // Fallback
  return { x: 0, y: 0, width: 100, height: 40 };
}

/**
 * Resolve a text style to concrete values
 * @param {string} styleName - Text style name from textStyles
 * @param {object} tokens - The tokens object
 * @returns {object} Resolved text style with fontFamily, fontSize, fontWeight, fill, etc.
 */
function resolveTextStyle(styleName, tokens) {
  const textStyle = tokens.textStyles?.[styleName];
  if (!textStyle) {
    return {
      fontFamily: tokens.typography?.fontFamily || 'sans-serif',
      fontSize: 16,
      fontWeight: 400,
      fill: '#000000',
      letterSpacing: '0'
    };
  }

  // Resolve size
  const fontSize = tokens.typography?.sizes?.[textStyle.size] ?? 16;

  // Resolve line height
  const lineHeight = tokens.typography?.lineHeights?.[textStyle.lineHeight] ?? fontSize * 1.5;

  // Resolve weight
  const fontWeight = tokens.typography?.weights?.[textStyle.weight] ?? 400;

  // Resolve color
  const fill = resolveToken(textStyle.color, tokens) || '#000000';

  // Resolve letter spacing
  const letterSpacing = tokens.typography?.letterSpacing?.[textStyle.letterSpacing] ?? '0';

  return {
    fontFamily: tokens.typography?.fontFamily || 'sans-serif',
    fontSize,
    lineHeight,
    fontWeight,
    fill,
    letterSpacing,
    textTransform: textStyle.textTransform || 'none'
  };
}

/**
 * Resolve a component style (node, edge, card, etc.)
 * @param {string} componentType - Component type (e.g., "nodes", "edges", "cards")
 * @param {string} styleName - Style name within the component type
 * @param {object} tokens - The tokens object
 * @returns {object} Resolved component style
 */
function resolveComponentStyle(componentType, styleName, tokens) {
  const componentStyles = tokens.components?.[componentType]?.[styleName];
  if (!componentStyles) return {};

  const resolved = {};

  for (const [key, value] of Object.entries(componentStyles)) {
    if (key === 'fill' || key === 'stroke' || key === 'headerFill') {
      resolved[key] = resolveToken(value, tokens);
    } else if (key === 'strokeWidth') {
      resolved[key] = resolveStrokeWidth(value, tokens);
    } else if (key === 'radius') {
      resolved[key] = resolveRadius(value, tokens);
    } else if (key === 'padding') {
      resolved[key] = resolveSpacing(value, tokens);
    } else if (key === 'textStyle') {
      resolved.textStyle = resolveTextStyle(value, tokens);
    } else if (key === 'shadow') {
      resolved[key] = tokens.shapes?.shadow?.[value] ?? value;
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Get anchor point coordinates for a node
 * @param {object} bounds - Node bounds { x, y, width, height }
 * @param {string} anchor - Anchor position (top, right, bottom, left, center)
 * @returns {object} { x, y }
 */
function getAnchorPoint(bounds, anchor) {
  const { x, y, width, height } = bounds;
  const halfW = width / 2;
  const halfH = height / 2;

  switch (anchor) {
    case 'top':
      return { x, y: y - halfH };
    case 'right':
      return { x: x + halfW, y };
    case 'bottom':
      return { x, y: y + halfH };
    case 'left':
      return { x: x - halfW, y };
    case 'center':
    default:
      return { x, y };
  }
}

/**
 * Escape special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a simple hash for content
 * @param {string} content - Content to hash
 * @returns {string} Hash string
 */
function simpleHash(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

module.exports = {
  resolveToken,
  resolveStrokeWidth,
  resolveRadius,
  resolveSpacing,
  gridToPixels,
  gridPointToPixels,
  positionToPixels,
  resolveTextStyle,
  resolveComponentStyle,
  getAnchorPoint,
  escapeXml,
  simpleHash
};
