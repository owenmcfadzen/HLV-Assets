/**
 * HLV Asset System - PNG Renderer
 * Generates PNG at 2x scale for retina displays using sharp
 */

const sharp = require('sharp');

/**
 * Render SVG to PNG at 2x scale
 * @param {string} svgContent - SVG content string
 * @param {object} canvasConfig - Canvas configuration { width, height }
 * @param {string} outputPath - Output file path
 * @returns {Promise<void>}
 */
async function renderPNG(svgContent, canvasConfig, outputPath) {
  const { width, height } = canvasConfig;
  const scale = 2; // 2x for retina

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Convert SVG to buffer
  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer, {
    density: 72 * scale // Scale DPI for higher resolution
  })
    .resize(scaledWidth, scaledHeight)
    .png({
      quality: 100,
      compressionLevel: 6
    })
    .toFile(outputPath);
}

module.exports = { renderPNG };
