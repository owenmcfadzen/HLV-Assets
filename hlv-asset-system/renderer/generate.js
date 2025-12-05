#!/usr/bin/env node

/**
 * HLV Asset System - Main Generator
 * Generates SVG, PNG, and PPTX outputs from layout definitions
 *
 * Usage:
 *   npm run generate                     # Generate all layouts, all formats
 *   npm run generate -- --layout=id      # Generate specific layout
 *   npm run generate -- --format=svg     # Generate specific format only
 */

const fs = require('fs');
const path = require('path');
const { renderSVG } = require('./svg-renderer');
const { renderPNG } = require('./png-renderer');
const { renderPPTX } = require('./pptx-renderer');
const { simpleHash } = require('./utils');

// Paths
const BASE_DIR = path.resolve(__dirname, '..');
const TOKENS_PATH = path.join(BASE_DIR, 'tokens.json');
const LAYOUTS_DIR = path.join(BASE_DIR, 'layouts');
const OUTPUTS_DIR = path.join(BASE_DIR, 'outputs');
const MANIFEST_PATH = path.join(BASE_DIR, 'manifest.json');

// Parse command line arguments
function parseArgs() {
  const args = {
    layout: null,
    format: null
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg.startsWith('--layout=')) {
      args.layout = arg.split('=')[1];
    } else if (arg.startsWith('--format=')) {
      args.format = arg.split('=')[1];
    }
  }

  return args;
}

// Load tokens
function loadTokens() {
  if (!fs.existsSync(TOKENS_PATH)) {
    throw new Error(`Tokens file not found: ${TOKENS_PATH}`);
  }

  const content = fs.readFileSync(TOKENS_PATH, 'utf-8');
  return JSON.parse(content);
}

// Load all layouts or a specific one
function loadLayouts(layoutId = null) {
  if (!fs.existsSync(LAYOUTS_DIR)) {
    console.warn(`Layouts directory not found: ${LAYOUTS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(LAYOUTS_DIR).filter(f => f.endsWith('.json'));
  const layouts = [];

  for (const file of files) {
    const filePath = path.join(LAYOUTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const layout = JSON.parse(content);

    // Filter by layoutId if specified
    if (layoutId && layout.id !== layoutId) {
      continue;
    }

    layouts.push({
      ...layout,
      _filePath: filePath
    });
  }

  return layouts;
}

// Ensure output directories exist
function ensureOutputDirs() {
  const dirs = [
    path.join(OUTPUTS_DIR, 'svg'),
    path.join(OUTPUTS_DIR, 'png'),
    path.join(OUTPUTS_DIR, 'pptx')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Generate a single layout
async function generateLayout(layout, tokens, format = null) {
  const canvasType = layout.canvas || 'standard';
  const canvasConfig = tokens.canvas[canvasType];

  const outputs = {
    svg: null,
    png: null,
    pptx: null
  };

  console.log(`  Generating ${layout.id}...`);

  // Generate SVG
  if (!format || format === 'svg') {
    try {
      const svgContent = renderSVG(layout, tokens);
      const svgPath = path.join(OUTPUTS_DIR, 'svg', `${layout.id}.svg`);
      fs.writeFileSync(svgPath, svgContent);
      outputs.svg = path.relative(BASE_DIR, svgPath);
      console.log(`    ✓ SVG: ${outputs.svg}`);
    } catch (error) {
      console.error(`    ✗ SVG failed: ${error.message}`);
    }
  }

  // Generate PNG (requires SVG)
  if (!format || format === 'png') {
    try {
      const svgContent = renderSVG(layout, tokens);
      const pngPath = path.join(OUTPUTS_DIR, 'png', `${layout.id}.png`);
      await renderPNG(svgContent, canvasConfig, pngPath);
      outputs.png = path.relative(BASE_DIR, pngPath);
      console.log(`    ✓ PNG: ${outputs.png}`);
    } catch (error) {
      console.error(`    ✗ PNG failed: ${error.message}`);
    }
  }

  // Generate PPTX
  if (!format || format === 'pptx') {
    try {
      const pptxPath = path.join(OUTPUTS_DIR, 'pptx', `${layout.id}.pptx`);
      await renderPPTX(layout, tokens, pptxPath);
      outputs.pptx = path.relative(BASE_DIR, pptxPath);
      console.log(`    ✓ PPTX: ${outputs.pptx}`);
    } catch (error) {
      console.error(`    ✗ PPTX failed: ${error.message}`);
    }
  }

  return {
    id: layout.id,
    name: layout.name,
    category: layout.metadata?.category || 'uncategorized',
    files: outputs,
    dimensions: {
      width: canvasConfig.width,
      height: canvasConfig.height
    },
    hash: simpleHash(JSON.stringify(layout))
  };
}

// Generate manifest
function generateManifest(outputs, tokens) {
  const manifest = {
    generated: new Date().toISOString(),
    tokenVersion: tokens.meta?.version || '1.0.0',
    outputs
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${path.relative(BASE_DIR, MANIFEST_PATH)}`);
}

// Main function
async function main() {
  console.log('HLV Asset System Generator\n');

  const args = parseArgs();

  // Load tokens
  console.log('Loading tokens...');
  const tokens = loadTokens();
  console.log(`  Version: ${tokens.meta?.version || 'unknown'}\n`);

  // Load layouts
  console.log('Loading layouts...');
  const layouts = loadLayouts(args.layout);

  if (layouts.length === 0) {
    if (args.layout) {
      console.error(`Layout not found: ${args.layout}`);
    } else {
      console.warn('No layouts found');
    }
    process.exit(1);
  }

  console.log(`  Found ${layouts.length} layout(s)\n`);

  // Ensure output directories
  ensureOutputDirs();

  // Generate outputs
  console.log('Generating outputs...');
  const outputs = [];

  for (const layout of layouts) {
    try {
      const output = await generateLayout(layout, tokens, args.format);
      outputs.push(output);
    } catch (error) {
      console.error(`  Failed to generate ${layout.id}: ${error.message}`);
    }
  }

  // Generate manifest
  generateManifest(outputs, tokens);

  console.log('\nDone!');
}

// Run
main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
