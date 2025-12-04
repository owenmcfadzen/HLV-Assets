/**
 * PPTX Generator - Primitives-based
 * Generates native PowerPoint shapes from element primitives using pptxgenjs
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

    this.components = JSON.parse(fs.readFileSync(this.componentsPath, 'utf8'));
    this.grid = JSON.parse(fs.readFileSync(this.gridPath, 'utf8'));

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
  getBoxStyle(variant = 'default') {
    const box = this.components.boxes.standard;
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
   * Render a box primitive
   */
  renderBox(slide, el) {
    const style = this.getBoxStyle(el.variant || 'default');
    const w = el.w || style.width;
    const h = el.h || style.height;

    const shapeOptions = {
      x: this.px(el.x),
      y: this.px(el.y),
      w: this.px(w),
      h: this.px(h),
      fill: { color: style.fill },
      rectRadius: this.px(style.radius) / this.px(w)
    };

    if (style.stroke) {
      shapeOptions.line = {
        color: style.stroke,
        width: style.strokeWidth
      };
    }

    slide.addShape('roundRect', shapeOptions);

    // Add text label
    if (el.label) {
      slide.addText(el.label.replace(/\\n/g, '\n'), {
        x: this.px(el.x),
        y: this.px(el.y),
        w: this.px(w),
        h: this.px(h),
        fontFace: 'Manrope',
        fontSize: 11,
        bold: true,
        color: style.textColor,
        align: 'center',
        valign: 'middle'
      });
    }
  }

  /**
   * Render an arrow primitive
   */
  renderArrow(slide, el) {
    const [x1, y1] = el.from;
    const [x2, y2] = el.to;
    const color = el.color ? this.getColor(el.color) : this.getColor('@colors.primary.navy');

    slide.addShape('line', {
      x: this.px(x1),
      y: this.px(y1),
      w: this.px(x2 - x1),
      h: this.px(y2 - y1),
      line: {
        color: color,
        width: el.strokeWidth || 2,
        endArrowType: 'triangle',
        dashType: el.dashed ? 'dash' : 'solid'
      }
    });
  }

  /**
   * Render a line primitive
   */
  renderLine(slide, el) {
    const [x1, y1] = el.from;
    const [x2, y2] = el.to;
    const color = el.color ? this.getColor(el.color) : this.getColor('@colors.neutral.light');

    slide.addShape('line', {
      x: this.px(x1),
      y: this.px(y1),
      w: this.px(x2 - x1),
      h: this.px(y2 - y1),
      line: {
        color: color,
        width: el.strokeWidth || 1,
        dashType: el.dashed ? 'dash' : 'solid'
      }
    });
  }

  /**
   * Render a text primitive
   */
  renderText(slide, el) {
    const scale = this.tokens.get('typography.scale');
    const styleName = el.style || 'body';
    const textStyle = scale[styleName] || scale.body;
    const color = el.color ? this.getColor(el.color) : this.getColor('@colors.primary.navy');

    slide.addText(el.content, {
      x: this.px(el.x) - 2,
      y: this.px(el.y) - 0.2,
      w: 4,
      h: 0.4,
      fontFace: 'Manrope',
      fontSize: textStyle.size * 0.75,
      bold: textStyle.weight >= 600,
      italic: el.italic || false,
      color: color,
      align: el.align || 'center'
    });
  }

  /**
   * Render a circle primitive
   */
  renderCircle(slide, el) {
    const style = el.variant ? this.getBoxStyle(el.variant) : null;
    const fill = el.fill ? this.getColor(el.fill) : (style ? style.fill : this.getColor('@colors.neutral.pale'));
    const stroke = el.stroke ? this.getColor(el.stroke) : (style && style.stroke ? style.stroke : null);

    const shapeOptions = {
      x: this.px(el.cx - el.r),
      y: this.px(el.cy - el.r),
      w: this.px(el.r * 2),
      h: this.px(el.r * 2),
      fill: { color: fill }
    };

    if (stroke) {
      shapeOptions.line = { color: stroke, width: el.strokeWidth || 2 };
    }

    slide.addShape('ellipse', shapeOptions);

    // Add label
    if (el.label) {
      const textColor = style ? style.textColor : this.getColor('@colors.primary.navy');
      slide.addText(el.label, {
        x: this.px(el.cx - el.r),
        y: this.px(el.cy - el.r),
        w: this.px(el.r * 2),
        h: this.px(el.r * 2),
        fontFace: 'Manrope',
        fontSize: 9,
        bold: true,
        color: textColor,
        align: 'center',
        valign: 'middle'
      });
    }
  }

  /**
   * Render a rectangle primitive
   */
  renderRect(slide, el) {
    const fill = el.fill ? this.getColor(el.fill) : this.getColor('@colors.neutral.pale');
    const stroke = el.stroke ? this.getColor(el.stroke) : null;

    const shapeOptions = {
      x: this.px(el.x),
      y: this.px(el.y),
      w: this.px(el.w),
      h: this.px(el.h),
      fill: { color: fill }
    };

    if (el.radius) {
      shapeOptions.rectRadius = this.px(el.radius) / this.px(el.w);
    }

    if (stroke) {
      shapeOptions.line = { color: stroke, width: el.strokeWidth || 1 };
    }

    slide.addShape('rect', shapeOptions);
  }

  /**
   * Render a group of elements
   */
  renderGroup(slide, el) {
    // PPTX doesn't support native grouping well, flatten elements
    if (el.elements) {
      el.elements.forEach(child => {
        this.renderElement(slide, child);
      });
    }
  }

  /**
   * Render any element by type
   */
  renderElement(slide, el) {
    switch (el.type) {
      case 'box': return this.renderBox(slide, el);
      case 'arrow': return this.renderArrow(slide, el);
      case 'line': return this.renderLine(slide, el);
      case 'text': return this.renderText(slide, el);
      case 'circle': return this.renderCircle(slide, el);
      case 'rect': return this.renderRect(slide, el);
      case 'group': return this.renderGroup(slide, el);
      default:
        console.warn(`Unknown element type for PPTX: ${el.type}`);
    }
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

    const slide = pptx.addSlide();

    // Title
    if (diagramSpec.title) {
      slide.addText(diagramSpec.title, {
        x: 0.5,
        y: 0.2,
        w: 9,
        h: 0.5,
        fontFace: 'Manrope',
        fontSize: 24,
        bold: true,
        color: this.getColor('@colors.primary.navy'),
        align: 'center'
      });
    }

    // Subtitle
    if (diagramSpec.subtitle) {
      slide.addText(diagramSpec.subtitle, {
        x: 0.5,
        y: 0.65,
        w: 9,
        h: 0.3,
        fontFace: 'Manrope',
        fontSize: 12,
        color: this.getColor('@colors.neutral.gray'),
        align: 'center'
      });
    }

    // Render all elements
    if (diagramSpec.elements && Array.isArray(diagramSpec.elements)) {
      diagramSpec.elements.forEach(el => {
        this.renderElement(slide, el);
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
