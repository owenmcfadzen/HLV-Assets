/**
 * SVG Generator - Primitives-based
 * Renders diagrams from element primitives using design tokens
 */

const fs = require('fs');
const path = require('path');
const TokenResolver = require('./tokens');

class SVGGenerator {
  constructor(options = {}) {
    this.tokens = new TokenResolver(options.tokensPath);
    this.componentsPath = options.componentsPath || path.join(__dirname, '..', 'components.json');
    this.gridPath = options.gridPath || path.join(__dirname, '..', 'grid.json');

    this.components = JSON.parse(fs.readFileSync(this.componentsPath, 'utf8'));
    this.grid = JSON.parse(fs.readFileSync(this.gridPath, 'utf8'));
  }

  /**
   * Get canvas dimensions for a preset
   */
  getCanvas(presetName) {
    const preset = this.grid.canvas.presets[presetName] || this.grid.canvas.presets[this.grid.canvas.default];
    return {
      width: preset.width,
      height: preset.height,
      margin: this.grid.grid.margin,
      contentWidth: this.grid.grid.contentWidth[presetName] || preset.width - (this.grid.grid.margin * 2)
    };
  }

  /**
   * Get box style for a variant
   */
  getBoxStyle(variant = 'default') {
    const box = this.components.boxes.standard;
    const variantStyle = this.components.boxVariants[variant] || this.components.boxVariants.default;

    return {
      width: box.width,
      height: box.height,
      radius: this.tokens.resolve(box.radius),
      fill: this.tokens.resolve(variantStyle.fill),
      stroke: variantStyle.stroke === 'none' ? 'none' : this.tokens.resolve(variantStyle.stroke),
      strokeWidth: this.tokens.resolve(variantStyle.strokeWidth || box.strokeWidth),
      textColor: this.tokens.resolve(variantStyle.textColor)
    };
  }

  /**
   * Get typography style
   */
  getTextStyle(styleName = 'body') {
    const scale = this.tokens.get('typography.scale');
    const style = scale[styleName] || scale.body;
    return {
      size: style.size,
      weight: style.weight,
      lineHeight: style.lineHeight
    };
  }

  /**
   * Generate SVG header
   */
  generateHeader(width, height) {
    const fontFamily = this.tokens.get('typography.family');
    const fallback = this.tokens.get('typography.fallback');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;500;600;700;800&amp;display=swap');
      text { font-family: '${fontFamily}', ${fallback}; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${this.tokens.get('colors.primary.navy')}" />
    </marker>
    <marker id="arrowhead-light" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="${this.tokens.get('colors.neutral.gray')}" />
    </marker>
    <marker id="arrowhead-success" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${this.tokens.get('colors.semantic.success')}" />
    </marker>
    <marker id="arrowhead-accent" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${this.tokens.get('colors.accent.green')}" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${this.tokens.get('colors.neutral.white')}"/>
`;
  }

  /**
   * Render a box primitive
   */
  renderBox(el) {
    const style = this.getBoxStyle(el.variant || 'default');
    const w = el.w || style.width;
    const h = el.h || style.height;
    const x = el.x;
    const y = el.y;
    const radius = el.radius || style.radius;

    let svg = '';

    // Rectangle
    svg += `  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" `;
    svg += `fill="${style.fill}" `;
    if (style.stroke !== 'none') {
      svg += `stroke="${style.stroke}" stroke-width="${style.strokeWidth}" `;
    }
    svg += `/>\n`;

    // Label text (if provided)
    if (el.label) {
      const lines = el.label.split('\n');
      const lineHeight = 18;
      const startY = y + (h / 2) - ((lines.length - 1) * lineHeight / 2);

      lines.forEach((line, i) => {
        const textY = startY + (i * lineHeight);
        svg += `  <text x="${x + w/2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" `;
        svg += `font-size="14" font-weight="600" fill="${style.textColor}">${this.escapeXml(line)}</text>\n`;
      });
    }

    return svg;
  }

  /**
   * Render an arrow primitive
   */
  renderArrow(el) {
    const [x1, y1] = el.from;
    const [x2, y2] = el.to;
    const color = el.color ? this.tokens.resolve(el.color) : this.tokens.get('colors.primary.navy');
    const strokeWidth = el.strokeWidth || 2;
    const marker = el.marker || 'arrowhead';

    let svg = `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `;
    svg += `stroke="${color}" stroke-width="${strokeWidth}" `;
    if (el.dashed) {
      svg += `stroke-dasharray="6,4" `;
    }
    svg += `marker-end="url(#${marker})" />\n`;

    return svg;
  }

  /**
   * Render a line primitive (no arrowhead)
   */
  renderLine(el) {
    const [x1, y1] = el.from;
    const [x2, y2] = el.to;
    const color = el.color ? this.tokens.resolve(el.color) : this.tokens.get('colors.neutral.light');
    const strokeWidth = el.strokeWidth || 1;

    let svg = `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `;
    svg += `stroke="${color}" stroke-width="${strokeWidth}" `;
    if (el.dashed) {
      svg += `stroke-dasharray="6,4" `;
    }
    svg += `/>\n`;

    return svg;
  }

  /**
   * Render a text primitive
   */
  renderText(el) {
    const styleName = el.style || 'body';
    const textStyle = this.getTextStyle(styleName);
    const color = el.color ? this.tokens.resolve(el.color) : this.tokens.get('colors.primary.navy');
    const align = el.align || 'middle';
    const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';

    let svg = `  <text x="${el.x}" y="${el.y}" text-anchor="${anchor}" `;
    svg += `font-size="${textStyle.size}" font-weight="${textStyle.weight}" fill="${color}"`;
    if (el.italic) svg += ` font-style="italic"`;
    svg += `>${this.escapeXml(el.content)}</text>\n`;

    return svg;
  }

  /**
   * Render a circle primitive
   */
  renderCircle(el) {
    const style = el.variant ? this.getBoxStyle(el.variant) : null;
    const fill = el.fill ? this.tokens.resolve(el.fill) : (style ? style.fill : this.tokens.get('colors.neutral.pale'));
    const stroke = el.stroke ? this.tokens.resolve(el.stroke) : (style && style.stroke !== 'none' ? style.stroke : 'none');
    const strokeWidth = el.strokeWidth || 2;

    let svg = `  <circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${fill}"`;
    if (stroke !== 'none') {
      svg += ` stroke="${stroke}" stroke-width="${strokeWidth}"`;
    }
    svg += `/>\n`;

    // Label inside circle
    if (el.label) {
      const textColor = style ? style.textColor : this.tokens.get('colors.primary.navy');
      svg += `  <text x="${el.cx}" y="${el.cy}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-size="12" font-weight="600" fill="${textColor}">${this.escapeXml(el.label)}</text>\n`;
    }

    return svg;
  }

  /**
   * Render a rectangle primitive (simpler than box, no variant)
   */
  renderRect(el) {
    const fill = el.fill ? this.tokens.resolve(el.fill) : this.tokens.get('colors.neutral.pale');
    const stroke = el.stroke ? this.tokens.resolve(el.stroke) : 'none';
    const radius = el.radius || 0;

    let svg = `  <rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" `;
    if (radius) svg += `rx="${radius}" `;
    svg += `fill="${fill}"`;
    if (stroke !== 'none') {
      svg += ` stroke="${stroke}" stroke-width="${el.strokeWidth || 1}"`;
    }
    svg += `/>\n`;

    return svg;
  }

  /**
   * Render a group of elements
   */
  renderGroup(el) {
    let svg = `  <g`;
    if (el.transform) svg += ` transform="${el.transform}"`;
    svg += `>\n`;

    if (el.elements) {
      el.elements.forEach(child => {
        svg += this.renderElement(child);
      });
    }

    svg += `  </g>\n`;
    return svg;
  }

  /**
   * Render any element by type
   */
  renderElement(el) {
    switch (el.type) {
      case 'box': return this.renderBox(el);
      case 'arrow': return this.renderArrow(el);
      case 'line': return this.renderLine(el);
      case 'text': return this.renderText(el);
      case 'circle': return this.renderCircle(el);
      case 'rect': return this.renderRect(el);
      case 'group': return this.renderGroup(el);
      default:
        console.warn(`Unknown element type: ${el.type}`);
        return '';
    }
  }

  /**
   * Escape XML special characters
   */
  escapeXml(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Generate footer/branding
   */
  generateFooter(canvas) {
    const y = canvas.height - 30;
    return `  <text x="${canvas.width/2}" y="${y}" text-anchor="middle" font-size="11" font-weight="500" fill="${this.tokens.get('colors.accent.green')}">Hudson Lab Ventures</text>\n`;
  }

  /**
   * Main generate function
   */
  generate(diagramSpec) {
    const canvasPreset = diagramSpec.canvas || 'diagram_standard';
    const canvas = this.getCanvas(canvasPreset);

    let svg = this.generateHeader(canvas.width, canvas.height);

    // Title
    if (diagramSpec.title) {
      svg += `  <text x="${canvas.width/2}" y="50" text-anchor="middle" font-size="28" font-weight="700" fill="${this.tokens.get('colors.primary.navy')}">${this.escapeXml(diagramSpec.title)}</text>\n`;
    }

    // Subtitle
    if (diagramSpec.subtitle) {
      svg += `  <text x="${canvas.width/2}" y="80" text-anchor="middle" font-size="14" font-weight="400" fill="${this.tokens.get('colors.neutral.gray')}">${this.escapeXml(diagramSpec.subtitle)}</text>\n`;
    }

    // Render all elements
    if (diagramSpec.elements && Array.isArray(diagramSpec.elements)) {
      diagramSpec.elements.forEach(el => {
        svg += this.renderElement(el);
      });
    }

    svg += this.generateFooter(canvas);
    svg += '</svg>';

    return svg;
  }
}

module.exports = SVGGenerator;
