/**
 * PPTX Generator
 * Generates native PowerPoint shapes from diagram specs using pptxgenjs
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const TokenResolver = require('./tokens');

class PPTXGenerator {
  constructor(options = {}) {
    this.tokens = new TokenResolver(options.tokensPath);
    this.componentsPath = options.componentsPath || path.join(__dirname, '..', 'components.json');
    this.gridPath = options.gridPath || path.join(__dirname, '..', 'grid.json');
    this.slideExportPath = options.slideExportPath || path.join(__dirname, '..', 'slide-export.json');

    this.components = JSON.parse(fs.readFileSync(this.componentsPath, 'utf8'));
    this.grid = JSON.parse(fs.readFileSync(this.gridPath, 'utf8'));
    this.slideExport = JSON.parse(fs.readFileSync(this.slideExportPath, 'utf8'));

    // Scale factor: pixels to inches (based on 1920px = 10in)
    this.scaleFactor = 10 / 1920;
  }

  /**
   * Convert pixels to inches
   */
  px(pixels) {
    return pixels * this.scaleFactor;
  }

  /**
   * Get color without # prefix
   */
  getColor(colorRef) {
    const color = this.tokens.resolve(colorRef);
    if (typeof color === 'string' && color.startsWith('#')) {
      return color.slice(1);
    }
    return color || '000000';
  }

  /**
   * Get canvas config
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
   * Get box style for variant
   */
  getBoxStyle(boxType, variant = 'default') {
    const box = this.components.boxes[boxType] || this.components.boxes.standard;
    const variantStyle = this.components.boxVariants[variant] || this.components.boxVariants.default;

    return {
      width: box.width,
      height: box.height,
      radius: this.tokens.resolve(box.radius),
      fill: this.getColor(variantStyle.fill),
      stroke: variantStyle.stroke === 'none' ? null : this.getColor(variantStyle.stroke),
      strokeWidth: this.tokens.resolve(variantStyle.strokeWidth || box.strokeWidth),
      textColor: this.getColor(variantStyle.textColor)
    };
  }

  /**
   * Add a box shape with text
   */
  addBox(slide, x, y, style, label) {
    const shapeOptions = {
      x: this.px(x),
      y: this.px(y),
      w: this.px(style.width),
      h: this.px(style.height),
      fill: { color: style.fill },
      rectRadius: this.px(style.radius) / this.px(style.width) // Proportion
    };

    if (style.stroke) {
      shapeOptions.line = {
        color: style.stroke,
        width: style.strokeWidth
      };
    }

    slide.addShape('roundRect', shapeOptions);

    // Add text
    slide.addText(label.replace(/\n/g, '\n'), {
      x: this.px(x),
      y: this.px(y),
      w: this.px(style.width),
      h: this.px(style.height),
      fontFace: 'Manrope',
      fontSize: 11,
      bold: true,
      color: style.textColor,
      align: 'center',
      valign: 'middle'
    });
  }

  /**
   * Add an arrow line
   */
  addArrow(slide, x1, y1, x2, y2, color = '182D53') {
    slide.addShape('line', {
      x: this.px(x1),
      y: this.px(y1),
      w: this.px(x2 - x1),
      h: 0,
      line: {
        color: color,
        width: 2,
        endArrowType: 'triangle'
      }
    });
  }

  /**
   * Generate flow within a column
   */
  generateFlow(slide, flow, startX, startY, maxWidth) {
    const steps = flow.steps;
    const boxHeight = 80;

    // Auto-calculate box width based on available space and number of steps
    const minConnectorGap = 20;
    const availableForBoxes = maxWidth - ((steps.length - 1) * minConnectorGap);
    const calculatedBoxWidth = Math.floor(availableForBoxes / steps.length);
    const boxWidth = Math.min(160, Math.max(80, calculatedBoxWidth));

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

      this.addBox(slide, x, y, style, step.label);

      // Connector arrow
      if (i < steps.length - 1) {
        const arrowStartX = x + boxWidth;
        const arrowEndX = x + boxWidth + connectorGap - 5;
        const arrowY = y + boxHeight / 2;

        const arrowColor = step.variant === 'highlight' ? '00D866' : '182D53';
        this.addArrow(slide, arrowStartX, arrowY, arrowEndX, arrowY, arrowColor);
      }
    });
  }

  /**
   * Generate comparison diagram
   */
  generateComparison(pptx, diagram, canvas) {
    const slide = pptx.addSlide();
    const margin = canvas.margin;
    const contentWidth = canvas.contentWidth;
    const columns = diagram.content.columns;

    // Title
    if (diagram.content.title) {
      slide.addText(diagram.content.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.6,
        fontFace: 'Manrope',
        fontSize: 24,
        bold: true,
        color: this.getColor('@colors.primary.navy'),
        align: 'center'
      });
    }

    const columnWidth = (contentWidth - 80) / 2;
    const headerY = 120;
    const flowY = 200;

    columns.forEach((col, i) => {
      const colX = margin + (i * (columnWidth + 80));

      // Header
      const headerVariant = col.header.variant || 'primary';
      const headerStyle = this.getBoxStyle('wide', headerVariant);
      headerStyle.width = columnWidth;
      headerStyle.height = 48;

      slide.addShape('roundRect', {
        x: this.px(colX),
        y: this.px(headerY),
        w: this.px(columnWidth),
        h: this.px(48),
        fill: { color: headerStyle.fill },
        line: headerStyle.stroke ? { color: headerStyle.stroke, width: 2 } : null,
        rectRadius: 0.05
      });

      slide.addText(col.header.text, {
        x: this.px(colX),
        y: this.px(headerY),
        w: this.px(columnWidth),
        h: this.px(48),
        fontFace: 'Manrope',
        fontSize: 14,
        bold: true,
        color: headerStyle.textColor,
        align: 'center',
        valign: 'middle'
      });

      // Flow
      if (col.flow) {
        this.generateFlow(slide, col.flow, colX, flowY, columnWidth);
      }

      // Annotation
      if (col.annotation) {
        slide.addText(col.annotation.text, {
          x: this.px(colX),
          y: this.px(flowY + 100),
          w: this.px(columnWidth),
          h: 0.3,
          fontFace: 'Manrope',
          fontSize: 10,
          italic: true,
          color: this.getColor('@colors.neutral.gray'),
          align: 'center'
        });
      }
    });

    // VS divider
    if (diagram.content.divider) {
      const dividerX = canvas.width / 2;
      const dividerY = flowY + 40;

      slide.addShape('ellipse', {
        x: this.px(dividerX - 24),
        y: this.px(dividerY - 24),
        w: this.px(48),
        h: this.px(48),
        fill: { color: this.getColor('@colors.neutral.pale') },
        line: { color: this.getColor('@colors.neutral.light'), width: 2 }
      });

      slide.addText('vs', {
        x: this.px(dividerX - 24),
        y: this.px(dividerY - 12),
        w: this.px(48),
        h: this.px(24),
        fontFace: 'Manrope',
        fontSize: 11,
        bold: true,
        color: this.getColor('@colors.neutral.gray'),
        align: 'center',
        valign: 'middle'
      });
    }

    // Footer
    slide.addText('Hudson Lab Ventures', {
      x: 0,
      y: this.px(canvas.height - 40),
      w: this.px(canvas.width),
      h: 0.3,
      fontFace: 'Manrope',
      fontSize: 9,
      color: this.getColor('@colors.primary.emerald'),
      align: 'center'
    });

    return slide;
  }

  /**
   * Main generate function
   */
  async generate(diagramSpec, outputPath) {
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = 'HLV Asset System';
    pptx.title = diagramSpec.meta?.name || 'HLV Diagram';
    pptx.subject = diagramSpec.meta?.description || '';

    // Use 16:9 layout (10" x 5.625")
    pptx.defineLayout({ name: 'HLV_WIDE', width: 10, height: 5.625 });
    pptx.layout = 'HLV_WIDE';

    const canvasPreset = diagramSpec.canvas || 'diagram_standard';
    const canvas = this.getCanvas(canvasPreset);

    // Route to appropriate generator
    switch (diagramSpec.type) {
      case 'comparison':
        this.generateComparison(pptx, diagramSpec, canvas);
        break;
      default:
        throw new Error(`Unsupported diagram type for PPTX: ${diagramSpec.type}`);
    }

    // Save or return buffer
    if (outputPath) {
      await pptx.writeFile({ fileName: outputPath });
      return outputPath;
    } else {
      return await pptx.write('nodebuffer');
    }
  }
}

module.exports = PPTXGenerator;
