/**
 * PNG Converter
 * Converts SVG to PNG at 2x resolution for retina displays
 */

const sharp = require('sharp');
const path = require('path');

class PNGConverter {
  constructor(options = {}) {
    this.scale = options.scale || 2; // 2x for retina
    this.quality = options.quality || 90;
  }

  /**
   * Convert SVG string to PNG buffer
   * @param {string} svgString - SVG content
   * @param {Object} options - Optional overrides
   * @returns {Promise<Buffer>} PNG buffer
   */
  async convert(svgString, options = {}) {
    const scale = options.scale || this.scale;

    // Parse dimensions from SVG
    const widthMatch = svgString.match(/width="(\d+)"/);
    const heightMatch = svgString.match(/height="(\d+)"/);

    const width = widthMatch ? parseInt(widthMatch[1]) : 1200;
    const height = heightMatch ? parseInt(heightMatch[1]) : 800;

    // Convert SVG to PNG at scaled resolution
    const svgBuffer = Buffer.from(svgString);

    const pngBuffer = await sharp(svgBuffer, { density: 72 * scale })
      .resize(width * scale, height * scale)
      .png({ quality: this.quality })
      .toBuffer();

    return pngBuffer;
  }

  /**
   * Convert SVG string and save to file
   * @param {string} svgString - SVG content
   * @param {string} outputPath - Path to save PNG
   * @param {Object} options - Optional overrides
   */
  async convertToFile(svgString, outputPath, options = {}) {
    const pngBuffer = await this.convert(svgString, options);
    const fs = require('fs').promises;
    await fs.writeFile(outputPath, pngBuffer);
    return outputPath;
  }

  /**
   * Get output dimensions
   */
  getOutputDimensions(width, height) {
    return {
      width: width * this.scale,
      height: height * this.scale
    };
  }
}

module.exports = PNGConverter;
