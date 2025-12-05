/**
 * HLV Asset System - SVG Renderer
 * Generates clean, valid SVG 1.1 from layout definitions
 */

const {
  resolveToken,
  resolveStrokeWidth,
  resolveRadius,
  gridToPixels,
  gridPointToPixels,
  positionToPixels,
  resolveTextStyle,
  resolveComponentStyle,
  getAnchorPoint,
  escapeXml
} = require('./utils');

/**
 * Render a layout to SVG
 * @param {object} layout - Layout definition
 * @param {object} tokens - Design tokens
 * @returns {string} SVG string
 */
function renderSVG(layout, tokens) {
  const canvasType = layout.canvas || 'standard';
  const canvasConfig = tokens.canvas[canvasType];
  const gridConfig = tokens.grid[canvasType];

  const { width, height } = canvasConfig;

  // Build SVG parts
  const parts = [];

  // SVG header
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`);

  // Definitions (for markers, gradients, etc.)
  parts.push(renderDefs(layout, tokens));

  // Background
  parts.push(`  <rect width="${width}" height="${height}" fill="${resolveToken('surface.base', tokens) || '#FFFFFF'}"/>`);

  // Title group for metadata
  if (layout.name) {
    parts.push(`  <title>${escapeXml(layout.name)}</title>`);
  }
  if (layout.description) {
    parts.push(`  <desc>${escapeXml(layout.description)}</desc>`);
  }

  // Render custom shapes first (they're usually backgrounds)
  if (layout.shapes && layout.shapes.length > 0) {
    parts.push(`  <g id="shapes">`);
    for (const shape of layout.shapes) {
      parts.push(renderShape(shape, canvasConfig, gridConfig, tokens));
    }
    parts.push(`  </g>`);
  }

  // Build node bounds map for edge rendering
  const nodeBounds = {};
  if (layout.nodes) {
    for (const node of layout.nodes) {
      const pos = positionToPixels(node, canvasConfig, gridConfig);
      const size = getNodeSize(node, pos, tokens);
      nodeBounds[node.id] = {
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height
      };
    }
  }

  // Render edges
  if (layout.edges && layout.edges.length > 0) {
    parts.push(`  <g id="edges">`);
    for (const edge of layout.edges) {
      parts.push(renderEdge(edge, nodeBounds, tokens));
    }
    parts.push(`  </g>`);
  }

  // Render nodes
  if (layout.nodes && layout.nodes.length > 0) {
    parts.push(`  <g id="nodes">`);
    for (const node of layout.nodes) {
      parts.push(renderNode(node, canvasConfig, gridConfig, tokens));
    }
    parts.push(`  </g>`);
  }

  // Render annotations
  if (layout.annotations) {
    parts.push(`  <g id="annotations">`);
    parts.push(renderAnnotations(layout.annotations, canvasConfig, gridConfig, tokens));
    parts.push(`  </g>`);
  }

  // Close SVG
  parts.push(`</svg>`);

  return parts.join('\n');
}

/**
 * Render SVG definitions (markers, etc.)
 */
function renderDefs(layout, tokens) {
  const defs = ['  <defs>'];

  // Custom gradients from layout
  if (layout.defs && layout.defs.gradients) {
    for (const gradient of layout.defs.gradients) {
      if (gradient.type === 'linear') {
        defs.push(`    <linearGradient id="${gradient.id}" x1="${gradient.x1 || '0%'}" y1="${gradient.y1 || '0%'}" x2="${gradient.x2 || '0%'}" y2="${gradient.y2 || '100%'}">`);
        for (const stop of gradient.stops) {
          defs.push(`      <stop offset="${stop.offset}" stop-color="${stop.color}"/>`);
        }
        defs.push(`    </linearGradient>`);
      } else if (gradient.type === 'radial') {
        defs.push(`    <radialGradient id="${gradient.id}" cx="${gradient.cx || '50%'}" cy="${gradient.cy || '50%'}" r="${gradient.r || '50%'}">`);
        for (const stop of gradient.stops) {
          defs.push(`      <stop offset="${stop.offset}" stop-color="${stop.color}"/>`);
        }
        defs.push(`    </radialGradient>`);
      }
    }
  }

  // Arrow markers for different edge types
  const edgeTypes = ['arrow', 'arrowAccent', 'arrowMuted', 'curved'];

  for (const edgeType of edgeTypes) {
    const style = resolveComponentStyle('edges', edgeType, tokens);
    const stroke = style.stroke || '#000000';
    const headSize = style.headSize || 12;

    defs.push(`    <marker id="arrow-${edgeType}" markerWidth="${headSize}" markerHeight="${headSize}" refX="${headSize - 2}" refY="${headSize / 2}" orient="auto" markerUnits="userSpaceOnUse">`);
    defs.push(`      <path d="M0,0 L0,${headSize} L${headSize},${headSize / 2} z" fill="${stroke}"/>`);
    defs.push(`    </marker>`);
  }

  defs.push('  </defs>');
  return defs.join('\n');
}

/**
 * Get node size based on type and content
 */
function getNodeSize(node, pos, tokens) {
  // If explicit size is provided, use it
  if (node.size) {
    return {
      width: node.size.width || pos.width,
      height: node.size.height || pos.height
    };
  }

  // Default sizes based on type
  const type = node.type || 'box';

  switch (type) {
    case 'phase':
    case 'phaseAccent':
      return { width: 120, height: 36 };
    case 'circle':
    case 'circleAccent':
      return { width: 48, height: 48 };
    case 'diamond':
      return { width: 40, height: 40 };
    case 'label':
      return { width: pos.width, height: 24 };
    default:
      return { width: pos.width * 0.8, height: pos.height * 0.6 };
  }
}

/**
 * Render a node
 */
function renderNode(node, canvasConfig, gridConfig, tokens) {
  const pos = positionToPixels(node, canvasConfig, gridConfig);
  const size = getNodeSize(node, pos, tokens);
  const type = node.type || 'box';

  // Get component style
  let componentStyle = {};
  if (tokens.components?.nodes?.[type]) {
    componentStyle = resolveComponentStyle('nodes', type, tokens);
  }

  // Merge with node-specific style overrides
  const style = { ...componentStyle, ...resolveNodeStyle(node.style, tokens) };

  // Get text style
  let textStyle;
  if (node.textStyle) {
    textStyle = resolveTextStyle(node.textStyle, tokens);
  } else if (style.textStyle) {
    textStyle = style.textStyle;
  } else {
    textStyle = resolveTextStyle('body', tokens);
  }

  const parts = [];
  parts.push(`    <g id="${escapeXml(node.id)}" transform="translate(${pos.x}, ${pos.y})">`);

  // Render shape based on type
  switch (type) {
    case 'circle':
    case 'circleAccent':
      parts.push(renderCircle(size, style));
      break;
    case 'diamond':
      parts.push(renderDiamond(size, style));
      break;
    case 'phase':
    case 'phaseAccent':
      parts.push(renderPill(size, style));
      break;
    case 'label':
      // Labels are text-only, no shape
      break;
    default:
      parts.push(renderRect(size, style));
  }

  // Render label
  if (node.label) {
    const align = node.align || 'middle';
    parts.push(renderText(node.label, textStyle, type, 0, align));
  }

  // Render sublabel if present
  if (node.sublabel) {
    const sublabelStyle = resolveTextStyle('small', tokens);
    parts.push(renderText(node.sublabel, sublabelStyle, type, 20));
  }

  parts.push(`    </g>`);

  return parts.join('\n');
}

/**
 * Render a rectangle shape
 */
function renderRect(size, style) {
  const { width, height } = size;
  const fill = style.fill || '#F3F4F6';
  const stroke = style.stroke;
  const strokeWidth = style.strokeWidth || 0;
  const radius = style.radius || 0;

  let strokeAttr = '';
  if (stroke && stroke !== 'none' && strokeWidth > 0) {
    strokeAttr = ` stroke="${stroke}" stroke-width="${strokeWidth}"`;
  }

  const rx = radius > 0 ? ` rx="${radius}"` : '';

  return `      <rect x="${-width / 2}" y="${-height / 2}" width="${width}" height="${height}" fill="${fill}"${strokeAttr}${rx}/>`;
}

/**
 * Render a circle shape
 */
function renderCircle(size, style) {
  const radius = Math.min(size.width, size.height) / 2;
  const fill = style.fill || '#182D53';
  const stroke = style.stroke;
  const strokeWidth = style.strokeWidth || 0;

  let strokeAttr = '';
  if (stroke && stroke !== 'none' && strokeWidth > 0) {
    strokeAttr = ` stroke="${stroke}" stroke-width="${strokeWidth}"`;
  }

  return `      <circle cx="0" cy="0" r="${radius}" fill="${fill}"${strokeAttr}/>`;
}

/**
 * Render a diamond shape
 */
function renderDiamond(size, style) {
  const { width, height } = size;
  const halfW = width / 2;
  const halfH = height / 2;
  const fill = style.fill || '#182D53';
  const stroke = style.stroke;
  const strokeWidth = style.strokeWidth || 0;

  let strokeAttr = '';
  if (stroke && stroke !== 'none' && strokeWidth > 0) {
    strokeAttr = ` stroke="${stroke}" stroke-width="${strokeWidth}"`;
  }

  const points = `0,${-halfH} ${halfW},0 0,${halfH} ${-halfW},0`;

  return `      <polygon points="${points}" fill="${fill}"${strokeAttr}/>`;
}

/**
 * Render a pill/capsule shape
 */
function renderPill(size, style) {
  const { width, height } = size;
  const fill = style.fill || '#182D53';
  const stroke = style.stroke;
  const strokeWidth = style.strokeWidth || 0;
  const radius = height / 2; // Full radius for pill shape

  let strokeAttr = '';
  if (stroke && stroke !== 'none' && strokeWidth > 0) {
    strokeAttr = ` stroke="${stroke}" stroke-width="${strokeWidth}"`;
  }

  return `      <rect x="${-width / 2}" y="${-height / 2}" width="${width}" height="${height}" fill="${fill}"${strokeAttr} rx="${radius}"/>`;
}

/**
 * Render text
 */
function renderText(text, textStyle, nodeType, yOffset = 0, align = 'middle') {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    fill,
    letterSpacing,
    textTransform
  } = textStyle;

  let displayText = text;
  if (textTransform === 'uppercase') {
    displayText = text.toUpperCase();
  }

  const letterSpacingAttr = letterSpacing && letterSpacing !== '0' ? ` letter-spacing="${letterSpacing}"` : '';
  const textAnchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';

  return `      <text x="0" y="${yOffset}" text-anchor="${textAnchor}" dominant-baseline="central" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}"${letterSpacingAttr}>${escapeXml(displayText)}</text>`;
}

/**
 * Resolve node style overrides
 */
function resolveNodeStyle(style, tokens) {
  if (!style) return {};

  const resolved = {};
  for (const [key, value] of Object.entries(style)) {
    if (key === 'fill' || key === 'stroke') {
      resolved[key] = resolveToken(value, tokens);
    } else if (key === 'strokeWidth') {
      resolved[key] = resolveStrokeWidth(value, tokens);
    } else if (key === 'radius') {
      resolved[key] = resolveRadius(value, tokens);
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

/**
 * Render an edge
 */
function renderEdge(edge, nodeBounds, tokens) {
  const fromBounds = nodeBounds[edge.from];
  const toBounds = nodeBounds[edge.to];

  if (!fromBounds || !toBounds) {
    console.warn(`Edge references missing node: ${edge.from} -> ${edge.to}`);
    return '';
  }

  const type = edge.type || 'arrow';
  const style = resolveComponentStyle('edges', type, tokens);

  const fromAnchor = edge.fromAnchor || 'right';
  const toAnchor = edge.toAnchor || 'left';

  const from = getAnchorPoint(fromBounds, fromAnchor);
  const to = getAnchorPoint(toBounds, toAnchor);

  const stroke = style.stroke || '#182D53';
  const strokeWidth = style.strokeWidth || 2;

  let markerEnd = '';
  if (type.startsWith('arrow') || type === 'curved') {
    markerEnd = ` marker-end="url(#arrow-${type})"`;
  }

  let dashArray = '';
  if (style.style === 'dashed' && style.dashArray) {
    dashArray = ` stroke-dasharray="${style.dashArray}"`;
  }

  // For curved edges, use a bezier curve
  if (type === 'curved') {
    const midX = (from.x + to.x) / 2;
    const controlY = Math.min(from.y, to.y) - 50;
    return `    <path d="M${from.x},${from.y} Q${midX},${controlY} ${to.x},${to.y}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${markerEnd}${dashArray}/>`;
  }

  return `    <line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${stroke}" stroke-width="${strokeWidth}"${markerEnd}${dashArray}/>`;
}

/**
 * Render a custom shape
 */
function renderShape(shape, canvasConfig, gridConfig, tokens) {
  const type = shape.type || 'polygon';
  const style = resolveShapeStyle(shape.style, tokens);

  const fill = style.fill || 'none';
  const stroke = style.stroke || 'none';
  const strokeWidth = style.strokeWidth || 1;

  let strokeAttr = '';
  if (stroke && stroke !== 'none') {
    strokeAttr = ` stroke="${stroke}" stroke-width="${strokeWidth}"`;
  }

  let dashArray = '';
  if (style.dashArray) {
    dashArray = ` stroke-dasharray="${style.dashArray}"`;
  }

  switch (type) {
    case 'polygon': {
      if (!shape.points || shape.points.length === 0) return '';

      const points = shape.points.map(p => {
        const px = gridPointToPixels(p, canvasConfig, gridConfig);
        return `${px.x},${px.y}`;
      }).join(' ');

      return `    <polygon id="${escapeXml(shape.id)}" points="${points}" fill="${fill}"${strokeAttr}${dashArray}/>`;
    }

    case 'line': {
      if (!shape.points || shape.points.length < 2) return '';

      const p1 = gridPointToPixels(shape.points[0], canvasConfig, gridConfig);
      const p2 = gridPointToPixels(shape.points[1], canvasConfig, gridConfig);

      return `    <line id="${escapeXml(shape.id)}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashArray}/>`;
    }

    case 'path': {
      if (!shape.d) return '';
      return `    <path id="${escapeXml(shape.id)}" d="${shape.d}" fill="${fill}"${strokeAttr}${dashArray}/>`;
    }

    case 'rect': {
      const pos = shape.position ? gridPointToPixels(shape.position, canvasConfig, gridConfig) : { x: 0, y: 0 };
      const width = shape.width || 100;
      const height = shape.height || 100;
      const rx = style.radius || 0;

      return `    <rect id="${escapeXml(shape.id)}" x="${pos.x}" y="${pos.y}" width="${width}" height="${height}" fill="${fill}"${strokeAttr}${rx > 0 ? ` rx="${rx}"` : ''}/>`;
    }

    case 'ellipse': {
      const pos = shape.position ? gridPointToPixels(shape.position, canvasConfig, gridConfig) : { x: 0, y: 0 };
      const rx = shape.rx || 50;
      const ry = shape.ry || 50;

      return `    <ellipse id="${escapeXml(shape.id)}" cx="${pos.x}" cy="${pos.y}" rx="${rx}" ry="${ry}" fill="${fill}"${strokeAttr}/>`;
    }

    default:
      return '';
  }
}

/**
 * Resolve shape style
 */
function resolveShapeStyle(style, tokens) {
  if (!style) return {};

  const resolved = {};
  for (const [key, value] of Object.entries(style)) {
    if (key === 'fill' || key === 'stroke') {
      resolved[key] = resolveToken(value, tokens);
    } else if (key === 'strokeWidth') {
      resolved[key] = resolveStrokeWidth(value, tokens);
    } else if (key === 'radius') {
      resolved[key] = resolveRadius(value, tokens);
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

/**
 * Render annotations (title, subtitle, caption, legend)
 */
function renderAnnotations(annotations, canvasConfig, gridConfig, tokens) {
  const parts = [];
  const { width, height } = canvasConfig;
  const { margin } = gridConfig;

  // Title
  if (annotations.title) {
    const titleStyle = resolveTextStyle('displayTitle', tokens);
    const y = margin + 40;
    parts.push(`    <text x="${width / 2}" y="${y}" text-anchor="middle" font-family="${titleStyle.fontFamily}" font-size="${titleStyle.fontSize}" font-weight="${titleStyle.fontWeight}" fill="${titleStyle.fill}">${escapeXml(annotations.title.text)}</text>`);
  }

  // Subtitle
  if (annotations.subtitle) {
    const subtitleStyle = resolveTextStyle('bodyMuted', tokens);
    const y = margin + 80;
    parts.push(`    <text x="${width / 2}" y="${y}" text-anchor="middle" font-family="${subtitleStyle.fontFamily}" font-size="${subtitleStyle.fontSize}" font-weight="${subtitleStyle.fontWeight}" fill="${subtitleStyle.fill}">${escapeXml(annotations.subtitle.text)}</text>`);
  }

  // Caption
  if (annotations.caption) {
    const captionStyle = resolveTextStyle('caption', tokens);
    const y = height - margin + 20;
    parts.push(`    <text x="${width / 2}" y="${y}" text-anchor="middle" font-family="${captionStyle.fontFamily}" font-size="${captionStyle.fontSize}" font-weight="${captionStyle.fontWeight}" fill="${captionStyle.fill}">${escapeXml(annotations.caption.text)}</text>`);
  }

  // Legend
  if (annotations.legend && annotations.legend.length > 0) {
    const legendY = height - margin + 10;
    let legendX = margin;

    parts.push(`    <g id="legend" transform="translate(${legendX}, ${legendY})">`);

    let offsetX = 0;
    for (const item of annotations.legend) {
      const color = resolveToken(item.color, tokens) || '#000000';
      const shape = item.shape || 'circle';

      // Shape
      if (shape === 'circle') {
        parts.push(`      <circle cx="${offsetX + 6}" cy="0" r="6" fill="${color}"/>`);
      } else if (shape === 'square') {
        parts.push(`      <rect x="${offsetX}" y="-6" width="12" height="12" fill="${color}"/>`);
      } else if (shape === 'triangle') {
        parts.push(`      <polygon points="${offsetX + 6},-6 ${offsetX + 12},6 ${offsetX},6" fill="${color}"/>`);
      } else if (shape === 'line') {
        parts.push(`      <line x1="${offsetX}" y1="0" x2="${offsetX + 12}" y2="0" stroke="${color}" stroke-width="2"/>`);
      }

      // Label
      const microStyle = resolveTextStyle('micro', tokens);
      parts.push(`      <text x="${offsetX + 20}" y="0" dominant-baseline="central" font-family="${microStyle.fontFamily}" font-size="${microStyle.fontSize}" font-weight="${microStyle.fontWeight}" fill="${microStyle.fill}">${escapeXml(item.label)}</text>`);

      offsetX += 100; // Space between legend items
    }

    parts.push(`    </g>`);
  }

  return parts.join('\n');
}

module.exports = { renderSVG };
