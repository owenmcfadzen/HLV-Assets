#!/usr/bin/env node
/**
 * HLV Asset System - Build Script
 * Regenerates all diagrams from specs using current tokens
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');
const TokenResolver = require('./lib/tokens');
const SVGGenerator = require('./lib/svg-generator');
const PNGConverter = require('./lib/png-converter');
const PPTXGenerator = require('./lib/pptx-generator');

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const DIST_DIR = path.join(__dirname, 'dist');

async function build() {
  console.log('\n🔧 HLV Asset System - Build\n');

  // Initialize generators with fresh tokens
  const tokens = new TokenResolver();
  const svgGen = new SVGGenerator(tokens);
  const pngConv = new PNGConverter();
  const pptxGen = new PPTXGenerator(tokens);

  // Ensure dist directories exist
  ['svg', 'png', 'pptx'].forEach(dir => {
    const dirPath = path.join(DIST_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Find all diagram JSON files
  const diagrams = fs.readdirSync(DIAGRAMS_DIR)
    .filter(f => f.endsWith('.json'));

  if (diagrams.length === 0) {
    console.log('No diagrams found in diagrams/ directory');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const file of diagrams) {
    const diagramPath = path.join(DIAGRAMS_DIR, file);
    const diagram = JSON.parse(fs.readFileSync(diagramPath, 'utf8'));
    const id = diagram.meta?.id || path.basename(file, '.json');

    console.log(`📊 Building: ${file}`);

    try {
      // Generate SVG
      const svg = svgGen.generate(diagram);
      const svgPath = path.join(DIST_DIR, 'svg', `${id}.svg`);
      fs.writeFileSync(svgPath, svg);
      console.log(`   ✓ SVG: dist/svg/${id}.svg`);

      // Generate PNG (2x resolution)
      const png = await pngConv.convert(svg);
      const pngPath = path.join(DIST_DIR, 'png', `${id}.png`);
      fs.writeFileSync(pngPath, png);
      console.log(`   ✓ PNG: dist/png/${id}.png (2x)`);

      // Generate PPTX
      const pptx = await pptxGen.generate(diagram);
      const pptxPath = path.join(DIST_DIR, 'pptx', `${id}.pptx`);
      fs.writeFileSync(pptxPath, pptx);
      console.log(`   ✓ PPTX: dist/pptx/${id}.pptx`);

      successCount += 3;
      console.log('');
    } catch (err) {
      console.error(`   ✗ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`✨ Build complete! ${successCount} files generated, ${errorCount} errors\n`);
}

// Run build
build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
