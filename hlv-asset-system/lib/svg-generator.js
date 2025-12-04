/**
 * SVG Generator
 * Generates SVG from diagram specs using design tokens
 */

const fs = require('fs');
const path = require('path');
const TokenResolver = require('./tokens');

class SVGGenerator {
  constructor(options = {}) {
    this.tokens = new TokenResolver(options.tokensPath);
    this.componentsPath = options.componentsPath || path.join(__dirname, '..', 'components.json');
    this.gridPath = options.gridPath || path.join(__dirname, '..', 'grid.json');
    this.diagramTypesPath = options.diagramTypesPath || path.join(__dirname, '..', 'diagram-types.json');

    this.components = JSON.parse(fs.readFileSync(this.componentsPath, 'utf8'));
    this.grid = JSON.parse(fs.readFileSync(this.gridPath, 'utf8'));
    this.diagramTypes = JSON.parse(fs.readFileSync(this.diagramTypesPath, 'utf8'));
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
   * Resolve component styles from variants
   */
  getBoxStyle(boxType, variant = 'default') {
    const box = this.components.boxes[boxType] || this.components.boxes.standard;
    const variantStyle = this.components.boxVariants[variant] || this.components.boxVariants.default;

    return {
      width: box.width,
      height: box.height,
      padding: box.padding,
      radius: this.tokens.resolve(box.radius),
      fill: this.tokens.resolve(variantStyle.fill),
      stroke: variantStyle.stroke === 'none' ? 'none' : this.tokens.resolve(variantStyle.stroke),
      strokeWidth: this.tokens.resolve(variantStyle.strokeWidth || box.strokeWidth),
      textColor: this.tokens.resolve(variantStyle.textColor)
    };
  }

  /**
   * Get connector style
   */
  getConnectorStyle(connectorType = 'arrow') {
    const connector = this.components.connectors[connectorType] || this.components.connectors.arrow;
    return {
      stroke: this.tokens.resolve(connector.stroke),
      strokeWidth: connector.strokeWidth,
      headSize: connector.headSize,
      dashArray: connector.dashArray || null
    };
  }

  /**
   * Generate SVG header with styles
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
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${this.tokens.get('colors.neutral.white')}"/>
`;
  }

  /**
   * Generate a box element
   */
  generateBox(x, y, style, label, options = {}) {
    const { width, height, radius, fill, stroke, strokeWidth, textColor } = style;
    const lines = label.split('\n');
    const lineHeight = 18;
    const startY = y + (height / 2) - ((lines.length - 1) * lineHeight / 2);

    let svg = '';

    // Box rectangle
    svg += `  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" `;
    svg += `fill="${fill}" `;
    if (stroke !== 'none') {
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" `;
    }
    svg += `/>\n`;

    // Text labels
    lines.forEach((line, i) => {
      const textY = startY + (i * lineHeight);
      svg += `  <text x="${x + width/2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-size="14" font-weight="600" fill="${textColor}">${line}</text>\n`;
    });

    return svg;
  }

  /**
   * Generate an arrow connector
   */
  generateArrow(x1, y1, x2, y2, style, markerType = 'arrowhead') {
    let svg = `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `;
    svg += `stroke="${style.stroke}" stroke-width="${style.strokeWidth}" `;
    if (style.dashArray) {
      svg += `stroke-dasharray="${style.dashArray}" `;
    }
    if (style.headSize > 0) {
      svg += `marker-end="url(#${markerType})" `;
    }
    svg += `/>\n`;
    return svg;
  }

  /**
   * Generate a flow diagram (horizontal or vertical sequence)
   */
  generateFlow(canvas, flow, startX, startY, maxWidth) {
    let svg = '';
    const steps = flow.steps;
    const direction = flow.direction || 'horizontal';

    // Auto-calculate box width based on available space and number of steps
    const minConnectorGap = 20;
    const boxHeight = 80;

    // Calculate optimal box width to fit within maxWidth
    const availableForBoxes = maxWidth - ((steps.length - 1) * minConnectorGap);
    const calculatedBoxWidth = Math.floor(availableForBoxes / steps.length);
    const boxWidth = Math.min(160, Math.max(80, calculatedBoxWidth)); // Clamp between 80-160

    // Recalculate connector gap with actual box width
    const totalBoxWidth = steps.length * boxWidth;
    const remainingSpace = maxWidth - totalBoxWidth;
    const connectorGap = steps.length > 1 ? Math.floor(remainingSpace / (steps.length - 1)) : 0;

    // Center the flow within maxWidth
    const actualTotalWidth = totalBoxWidth + ((steps.length - 1) * connectorGap);
    const offsetX = Math.max(0, (maxWidth - actualTotalWidth) / 2);

    steps.forEach((step, i) => {
      const style = this.getBoxStyle('standard', step.variant || 'default');
      style.width = boxWidth;
      style.height = boxHeight;

      const x = startX + offsetX + (i * (boxWidth + connectorGap));
      const y = startY;

      // Draw box
      svg += this.generateBox(x, y, style, step.label);

      // Draw connector to next box
      if (i < steps.length - 1) {
        const connectorStyle = this.getConnectorStyle(flow.connector || 'arrow');
        const arrowStartX = x + boxWidth;
        const arrowEndX = x + boxWidth + connectorGap - 5;
        const arrowY = y + boxHeight / 2;

        // Determine marker based on next step variant
        const nextVariant = steps[i + 1].variant;
        let markerType = 'arrowhead';
        if (nextVariant === 'success') markerType = 'arrowhead-success';
        else if (nextVariant === 'muted') markerType = 'arrowhead-light';

        svg += this.generateArrow(arrowStartX, arrowY, arrowEndX, arrowY, connectorStyle, markerType);
      }
    });

    return svg;
  }

  /**
   * Generate a comparison diagram
   */
  generateComparison(diagram, canvas) {
    let svg = '';
    const margin = canvas.margin;
    const contentWidth = canvas.contentWidth;
    const columns = diagram.content.columns;

    // Title
    if (diagram.content.title) {
      const titleY = 60;
      svg += `  <text x="${canvas.width/2}" y="${titleY}" text-anchor="middle" `;
      svg += `font-size="28" font-weight="700" fill="${this.tokens.get('colors.primary.navy')}">${diagram.content.title}</text>\n`;
    }

    // Column headers and flows
    const columnWidth = (contentWidth - 80) / 2; // Gap between columns
    const headerY = 120;
    const flowY = 200;

    columns.forEach((col, i) => {
      const colX = margin + (i * (columnWidth + 80));

      // Header box
      const headerVariant = col.header.variant || 'primary';
      const headerStyle = this.getBoxStyle('wide', headerVariant);
      headerStyle.width = columnWidth;
      headerStyle.height = 48;

      svg += `  <rect x="${colX}" y="${headerY}" width="${columnWidth}" height="48" rx="8" `;
      svg += `fill="${headerStyle.fill}" `;
      if (headerStyle.stroke !== 'none') {
        svg += `stroke="${headerStyle.stroke}" stroke-width="2" `;
      }
      svg += `/>\n`;

      svg += `  <text x="${colX + columnWidth/2}" y="${headerY + 30}" text-anchor="middle" `;
      svg += `font-size="18" font-weight="700" fill="${headerStyle.textColor}">${col.header.text}</text>\n`;

      // Flow within column
      if (col.flow) {
        svg += this.generateFlow(canvas, col.flow, colX, flowY, columnWidth);
      }

      // Annotation
      if (col.annotation) {
        const annotationY = flowY + 120;
        svg += `  <text x="${colX + columnWidth/2}" y="${annotationY}" text-anchor="middle" `;
        svg += `font-size="13" font-style="italic" fill="${this.tokens.get('colors.neutral.gray')}">${col.annotation.text}</text>\n`;
      }
    });

    // VS divider
    if (diagram.content.divider) {
      const dividerX = canvas.width / 2;
      const dividerY = flowY + 40;

      svg += `  <circle cx="${dividerX}" cy="${dividerY}" r="24" fill="${this.tokens.get('colors.neutral.pale')}" stroke="${this.tokens.get('colors.neutral.light')}" stroke-width="2"/>\n`;
      svg += `  <text x="${dividerX}" y="${dividerY + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="${this.tokens.get('colors.neutral.gray')}">vs</text>\n`;
    }

    return svg;
  }

  /**
   * Generate footer/branding
   */
  generateFooter(canvas) {
    let svg = '';
    const y = canvas.height - 30;

    svg += `  <text x="${canvas.width/2}" y="${y}" text-anchor="middle" `;
    svg += `font-size="11" font-weight="500" fill="${this.tokens.get('colors.primary.emerald')}">Hudson Lab Ventures</text>\n`;

    return svg;
  }

  /**
   * Main generate function
   */
  generate(diagramSpec) {
    const canvasPreset = diagramSpec.canvas || 'diagram_standard';
    const canvas = this.getCanvas(canvasPreset);

    let svg = this.generateHeader(canvas.width, canvas.height);

    // Route to appropriate generator based on diagram type
    switch (diagramSpec.type) {
      case 'comparison':
        svg += this.generateComparison(diagramSpec, canvas);
        break;
      case 'flow':
        svg += this.generateFlow(canvas, diagramSpec.content, canvas.margin, canvas.height / 3, canvas.contentWidth);
        break;
      default:
        throw new Error(`Unsupported diagram type: ${diagramSpec.type}`);
    }

    svg += this.generateFooter(canvas);
    svg += '</svg>';

    return svg;
  }
}

module.exports = SVGGenerator;
