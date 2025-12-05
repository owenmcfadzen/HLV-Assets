/**
 * HLV Asset System - PPTX Renderer
 * Generates PowerPoint presentations using pptxgenjs
 */

const PptxGenJS = require('pptxgenjs');
const {
  resolveToken,
  resolveStrokeWidth,
  gridToPixels,
  gridPointToPixels,
  resolveTextStyle,
  resolveComponentStyle,
  getAnchorPoint
} = require('./utils');

// Convert pixels to inches (PowerPoint uses inches)
const PX_TO_INCHES = 1 / 96;

// Convert hex color to PPTX format (without #)
function hexToPptx(hex) {
  if (!hex || hex === 'none') return null;
  return hex.replace('#', '');
}

/**
 * Render a layout to PPTX
 * @param {object} layout - Layout definition
 * @param {object} tokens - Design tokens
 * @param {string} outputPath - Output file path
 * @returns {Promise<void>}
 */
async function renderPPTX(layout, tokens, outputPath) {
  const pptx = new PptxGenJS();

  const canvasType = layout.canvas || 'standard';
  const canvasConfig = tokens.canvas[canvasType];
  const gridConfig = tokens.grid[canvasType];

  const { width, height } = canvasConfig;

  // Set slide size (in inches)
  pptx.defineLayout({
    name: 'HLV_LAYOUT',
    width: width * PX_TO_INCHES,
    height: height * PX_TO_INCHES
  });
  pptx.layout = 'HLV_LAYOUT';

  // Set metadata
  pptx.title = layout.name || 'HLV Diagram';
  pptx.subject = layout.description || '';
  pptx.author = 'HLV Asset System';

  // Create slide
  const slide = pptx.addSlide();

  // Background
  slide.background = { color: hexToPptx(resolveToken('surface.base', tokens) || '#FFFFFF') };

  // Render shapes (backgrounds first)
  if (layout.shapes) {
    for (const shape of layout.shapes) {
      renderPptxShape(slide, shape, canvasConfig, gridConfig, tokens);
    }
  }

  // Build node bounds for edges
  const nodeBounds = {};
  if (layout.nodes) {
    for (const node of layout.nodes) {
      const pos = gridToPixels(node.grid, canvasConfig, gridConfig);
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
  if (layout.edges) {
    for (const edge of layout.edges) {
      renderPptxEdge(slide, edge, nodeBounds, tokens);
    }
  }

  // Render nodes
  if (layout.nodes) {
    for (const node of layout.nodes) {
      renderPptxNode(slide, node, canvasConfig, gridConfig, tokens);
    }
  }

  // Render annotations
  if (layout.annotations) {
    renderPptxAnnotations(slide, layout.annotations, canvasConfig, gridConfig, tokens);
  }

  // Save file
  await pptx.writeFile({ fileName: outputPath });
}

/**
 * Get node size
 */
function getNodeSize(node, pos, tokens) {
  if (node.size) {
    return {
      width: node.size.width || pos.width,
      height: node.size.height || pos.height
    };
  }

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
 * Render a node to PPTX
 */
function renderPptxNode(slide, node, canvasConfig, gridConfig, tokens) {
  const pos = gridToPixels(node.grid, canvasConfig, gridConfig);
  const size = getNodeSize(node, pos, tokens);
  const type = node.type || 'box';

  // Get component style
  let componentStyle = {};
  if (tokens.components?.nodes?.[type]) {
    componentStyle = resolveComponentStyle('nodes', type, tokens);
  }

  // Get text style
  let textStyle;
  if (node.textStyle) {
    textStyle = resolveTextStyle(node.textStyle, tokens);
  } else if (componentStyle.textStyle) {
    textStyle = componentStyle.textStyle;
  } else {
    textStyle = resolveTextStyle('body', tokens);
  }

  const x = (pos.x - size.width / 2) * PX_TO_INCHES;
  const y = (pos.y - size.height / 2) * PX_TO_INCHES;
  const w = size.width * PX_TO_INCHES;
  const h = size.height * PX_TO_INCHES;

  const fill = componentStyle.fill ? hexToPptx(componentStyle.fill) : null;
  const stroke = componentStyle.stroke && componentStyle.stroke !== 'none' ? hexToPptx(componentStyle.stroke) : null;
  const strokeWidth = componentStyle.strokeWidth || 0;

  // Shape options
  const shapeOpts = {
    x,
    y,
    w,
    h,
    fill: fill ? { color: fill } : null,
    line: stroke ? { color: stroke, width: strokeWidth } : null
  };

  // Determine shape type
  let shapeType = 'rect';
  if (type === 'circle' || type === 'circleAccent') {
    shapeType = 'ellipse';
  } else if (type === 'diamond') {
    shapeType = 'diamond';
  } else if (type === 'phase' || type === 'phaseAccent') {
    shapeType = 'roundRect';
    shapeOpts.rectRadius = 0.5; // Full radius for pill shape
  }

  // Add shape
  if (type !== 'label') {
    slide.addShape(shapeType, shapeOpts);
  }

  // Add text
  if (node.label) {
    let displayText = node.label;
    if (textStyle.textTransform === 'uppercase') {
      displayText = node.label.toUpperCase();
    }

    slide.addText(displayText, {
      x,
      y,
      w,
      h,
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial', // PPTX compatible font
      fontSize: textStyle.fontSize * 0.75, // Convert to points
      bold: textStyle.fontWeight >= 600,
      color: hexToPptx(textStyle.fill)
    });
  }
}

/**
 * Render a shape to PPTX
 */
function renderPptxShape(slide, shape, canvasConfig, gridConfig, tokens) {
  const type = shape.type || 'polygon';

  const fill = shape.style?.fill ? hexToPptx(resolveToken(shape.style.fill, tokens)) : null;
  const stroke = shape.style?.stroke ? hexToPptx(resolveToken(shape.style.stroke, tokens)) : null;
  const strokeWidth = shape.style?.strokeWidth ? resolveStrokeWidth(shape.style.strokeWidth, tokens) : 1;

  if (type === 'polygon' && shape.points) {
    // Convert points to PPTX path format (percentage-based)
    const points = shape.points.map(p => {
      const px = gridPointToPixels(p, canvasConfig, gridConfig);
      return {
        x: (px.x / canvasConfig.width) * 100,
        y: (px.y / canvasConfig.height) * 100
      };
    });

    // For complex polygons, we use a freeform shape
    // PPTX freeform shapes use a different format
    // For simplicity, we'll approximate with a rectangle bounding box
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    slide.addShape('rect', {
      x: (minX / 100) * canvasConfig.width * PX_TO_INCHES,
      y: (minY / 100) * canvasConfig.height * PX_TO_INCHES,
      w: ((maxX - minX) / 100) * canvasConfig.width * PX_TO_INCHES,
      h: ((maxY - minY) / 100) * canvasConfig.height * PX_TO_INCHES,
      fill: fill ? { color: fill, transparency: 50 } : null,
      line: stroke ? { color: stroke, width: strokeWidth } : null
    });
  } else if (type === 'line' && shape.points && shape.points.length >= 2) {
    const p1 = gridPointToPixels(shape.points[0], canvasConfig, gridConfig);
    const p2 = gridPointToPixels(shape.points[1], canvasConfig, gridConfig);

    slide.addShape('line', {
      x: p1.x * PX_TO_INCHES,
      y: p1.y * PX_TO_INCHES,
      w: (p2.x - p1.x) * PX_TO_INCHES,
      h: (p2.y - p1.y) * PX_TO_INCHES,
      line: stroke ? { color: stroke, width: strokeWidth, dashType: shape.style?.dashArray ? 'dash' : 'solid' } : null
    });
  }
}

/**
 * Render an edge to PPTX
 */
function renderPptxEdge(slide, edge, nodeBounds, tokens) {
  const fromBounds = nodeBounds[edge.from];
  const toBounds = nodeBounds[edge.to];

  if (!fromBounds || !toBounds) return;

  const type = edge.type || 'arrow';
  const style = resolveComponentStyle('edges', type, tokens);

  const fromAnchor = edge.fromAnchor || 'right';
  const toAnchor = edge.toAnchor || 'left';

  const from = getAnchorPoint(fromBounds, fromAnchor);
  const to = getAnchorPoint(toBounds, toAnchor);

  const stroke = hexToPptx(style.stroke) || '182D53';
  const strokeWidth = style.strokeWidth || 2;

  slide.addShape('line', {
    x: from.x * PX_TO_INCHES,
    y: from.y * PX_TO_INCHES,
    w: (to.x - from.x) * PX_TO_INCHES,
    h: (to.y - from.y) * PX_TO_INCHES,
    line: {
      color: stroke,
      width: strokeWidth,
      endArrowType: type.startsWith('arrow') ? 'triangle' : 'none'
    }
  });
}

/**
 * Render annotations to PPTX
 */
function renderPptxAnnotations(slide, annotations, canvasConfig, gridConfig, tokens) {
  const { width, height } = canvasConfig;
  const { margin } = gridConfig;

  if (annotations.title) {
    const titleStyle = resolveTextStyle('displayTitle', tokens);

    slide.addText(annotations.title.text, {
      x: margin * PX_TO_INCHES,
      y: (margin) * PX_TO_INCHES,
      w: (width - 2 * margin) * PX_TO_INCHES,
      h: 60 * PX_TO_INCHES,
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial',
      fontSize: titleStyle.fontSize * 0.75,
      bold: true,
      color: hexToPptx(titleStyle.fill)
    });
  }

  if (annotations.subtitle) {
    const subtitleStyle = resolveTextStyle('bodyMuted', tokens);

    slide.addText(annotations.subtitle.text, {
      x: margin * PX_TO_INCHES,
      y: (margin + 50) * PX_TO_INCHES,
      w: (width - 2 * margin) * PX_TO_INCHES,
      h: 40 * PX_TO_INCHES,
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial',
      fontSize: subtitleStyle.fontSize * 0.75,
      color: hexToPptx(subtitleStyle.fill)
    });
  }

  if (annotations.caption) {
    const captionStyle = resolveTextStyle('caption', tokens);

    slide.addText(annotations.caption.text, {
      x: margin * PX_TO_INCHES,
      y: (height - margin - 20) * PX_TO_INCHES,
      w: (width - 2 * margin) * PX_TO_INCHES,
      h: 30 * PX_TO_INCHES,
      align: 'center',
      valign: 'middle',
      fontFace: 'Arial',
      fontSize: captionStyle.fontSize * 0.75,
      color: hexToPptx(captionStyle.fill)
    });
  }
}

module.exports = { renderPPTX };
