#!/usr/bin/env node

/**
 * HLV Asset System CLI
 * Build SVG, PNG, and PPTX from diagram specifications
 *
 * Usage:
 *   node cli.js build <diagram.json>         # Build all formats
 *   node cli.js build <diagram.json> --svg   # SVG only
 *   node cli.js build-all                    # Build all diagrams
 *   node cli.js list                         # List available diagrams
 */

const fs = require('fs');
const path = require('path');
const SVGGenerator = require('./lib/svg-generator');
const PNGConverter = require('./lib/png-converter');
const PPTXGenerator = require('./lib/pptx-generator');

const DIST_DIR = path.join(__dirname, 'dist');
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');

// Ensure dist directories exist
function ensureDistDirs() {
  ['svg', 'png', 'pptx'].forEach(dir => {
    const fullPath = path.join(DIST_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

// Load a diagram spec
function loadDiagram(diagramPath) {
  const fullPath = path.isAbsolute(diagramPath)
    ? diagramPath
    : path.join(__dirname, diagramPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Diagram not found: ${fullPath}`);
  }

  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

// Build a single diagram
async function buildDiagram(diagramPath, options = {}) {
  console.log(`\n📊 Building: ${diagramPath}`);

  const diagram = loadDiagram(diagramPath);
  const id = diagram.meta?.id || path.basename(diagramPath, '.json');
  const exportConfig = diagram.export || { svg: true, png: true, pptx: true };

  ensureDistDirs();

  const results = [];

  // Generate SVG
  if ((options.svg || options.all !== false) && exportConfig.svg !== false) {
    try {
      const svgGen = new SVGGenerator();
      const svgContent = svgGen.generate(diagram);
      const svgPath = path.join(DIST_DIR, 'svg', `${id}.svg`);
      fs.writeFileSync(svgPath, svgContent);
      console.log(`   ✓ SVG: dist/svg/${id}.svg`);
      results.push({ type: 'svg', path: svgPath, success: true });

      // Generate PNG from SVG
      if ((options.png || options.all !== false) && exportConfig.png !== false) {
        try {
          const pngConv = new PNGConverter();
          const pngPath = path.join(DIST_DIR, 'png', `${id}.png`);
          await pngConv.convertToFile(svgContent, pngPath);
          console.log(`   ✓ PNG: dist/png/${id}.png (2x)`);
          results.push({ type: 'png', path: pngPath, success: true });
        } catch (err) {
          console.log(`   ✗ PNG: ${err.message}`);
          results.push({ type: 'png', error: err.message, success: false });
        }
      }
    } catch (err) {
      console.log(`   ✗ SVG: ${err.message}`);
      results.push({ type: 'svg', error: err.message, success: false });
    }
  }

  // Generate PPTX
  if ((options.pptx || options.all !== false) && exportConfig.pptx !== false) {
    try {
      const pptxGen = new PPTXGenerator();
      const pptxPath = path.join(DIST_DIR, 'pptx', `${id}.pptx`);
      await pptxGen.generate(diagram, pptxPath);
      console.log(`   ✓ PPTX: dist/pptx/${id}.pptx`);
      results.push({ type: 'pptx', path: pptxPath, success: true });
    } catch (err) {
      console.log(`   ✗ PPTX: ${err.message}`);
      results.push({ type: 'pptx', error: err.message, success: false });
    }
  }

  return results;
}

// Build all diagrams in the diagrams directory
async function buildAll() {
  console.log('🔄 Building all diagrams...\n');

  const diagramFiles = fs.readdirSync(DIAGRAMS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join('diagrams', f));

  const allResults = [];

  for (const file of diagramFiles) {
    const results = await buildDiagram(file);
    allResults.push({ file, results });
  }

  console.log('\n✨ Build complete!');

  const successCount = allResults.flatMap(r => r.results).filter(r => r.success).length;
  const failCount = allResults.flatMap(r => r.results).filter(r => !r.success).length;

  console.log(`   ${successCount} files generated, ${failCount} errors`);

  return allResults;
}

// List available diagrams
function listDiagrams() {
  console.log('📋 Available diagrams:\n');

  const diagramFiles = fs.readdirSync(DIAGRAMS_DIR)
    .filter(f => f.endsWith('.json'));

  diagramFiles.forEach(file => {
    const diagram = loadDiagram(path.join('diagrams', file));
    const name = diagram.meta?.name || file;
    const type = diagram.type || 'unknown';
    console.log(`   ${file}`);
    console.log(`      Type: ${type}`);
    console.log(`      Name: ${name}`);
    console.log('');
  });
}

// Verify tokens are being resolved
function verifyTokens() {
  console.log('🔍 Verifying token resolution...\n');

  const TokenResolver = require('./lib/tokens');
  const tokens = new TokenResolver();

  const testPaths = [
    'colors.primary.navy',
    'colors.primary.emerald',
    'typography.family',
    'spacing.scale.md',
    'borders.radius.md'
  ];

  testPaths.forEach(p => {
    try {
      const value = tokens.get(p);
      console.log(`   ✓ ${p} → ${value}`);
    } catch (err) {
      console.log(`   ✗ ${p} → ${err.message}`);
    }
  });
}

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];
  const flags = args.slice(2);

  const options = {
    svg: flags.includes('--svg'),
    png: flags.includes('--png'),
    pptx: flags.includes('--pptx'),
    all: !flags.some(f => f.startsWith('--'))
  };

  return { command, target, options };
}

// Main entry point
async function main() {
  const { command, target, options } = parseArgs();

  console.log('╔════════════════════════════════════════╗');
  console.log('║     HLV Asset System Generator         ║');
  console.log('╚════════════════════════════════════════╝');

  switch (command) {
    case 'build':
      if (!target) {
        console.error('Error: Please specify a diagram file');
        console.log('Usage: node cli.js build diagrams/<name>.json');
        process.exit(1);
      }
      await buildDiagram(target, options);
      break;

    case 'build-all':
      await buildAll();
      break;

    case 'list':
      listDiagrams();
      break;

    case 'verify':
      verifyTokens();
      break;

    default:
      console.log(`
Usage:
  node cli.js build <diagram.json>    Build a specific diagram
  node cli.js build-all               Build all diagrams
  node cli.js list                    List available diagrams
  node cli.js verify                  Verify token resolution

Options:
  --svg   Generate SVG only
  --png   Generate PNG only
  --pptx  Generate PPTX only

Examples:
  node cli.js build diagrams/reframing-process-flow.json
  node cli.js build diagrams/reframing-process-flow.json --svg --png
  node cli.js build-all
`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
