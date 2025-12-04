#!/usr/bin/env node

/**
 * HLV Asset System CLI
 * Build SVG, PNG, and PPTX from diagram specifications
 *
 * Commands:
 *   build <diagram.json>     Build a specific diagram
 *   build-all                Build all diagrams in diagrams/
 *   new <type> <name>        Create a new diagram from template
 *   validate <diagram.json>  Validate a diagram spec
 *   types                    List available diagram types
 *   variants                 List available box variants
 *   tokens                   Show current token values
 *   list                     List existing diagrams
 */

const fs = require('fs');
const path = require('path');
const SVGGenerator = require('./lib/svg-generator');
const PNGConverter = require('./lib/png-converter');
const PPTXGenerator = require('./lib/pptx-generator');
const DiagramValidator = require('./lib/validator');

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

// Validate a diagram
function validateDiagram(diagramPath) {
  console.log(`\n🔍 Validating: ${diagramPath}\n`);

  const diagram = loadDiagram(diagramPath);
  const validator = new DiagramValidator();
  const result = validator.validate(diagram);

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(e => console.log(`   • ${e}`));
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(w => console.log(`   • ${w}`));
  }

  if (result.valid) {
    console.log('✅ Diagram spec is valid!');
  }

  return result;
}

// Build a single diagram
async function buildDiagram(diagramPath, options = {}) {
  console.log(`\n📊 Building: ${diagramPath}`);

  // Validate first
  const validator = new DiagramValidator();
  const diagram = loadDiagram(diagramPath);
  const validation = validator.validate(diagram);

  if (!validation.valid) {
    console.log('\n❌ Validation failed:');
    validation.errors.forEach(e => console.log(`   • ${e}`));
    return [];
  }

  if (validation.warnings.length > 0) {
    validation.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
  }

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

  if (!fs.existsSync(DIAGRAMS_DIR)) {
    console.log('No diagrams directory found.');
    return [];
  }

  const diagramFiles = fs.readdirSync(DIAGRAMS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join('diagrams', f));

  if (diagramFiles.length === 0) {
    console.log('No diagram files found in diagrams/');
    return [];
  }

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

// Create a new diagram from template
function createNew(type, name) {
  const validator = new DiagramValidator();
  const template = validator.getTemplate(type);

  if (!template) {
    console.log(`\n❌ Unknown diagram type: "${type}"`);
    console.log('\nAvailable types:');
    validator.listTypes().forEach(t => {
      console.log(`   ${t.type} - ${t.description}`);
    });
    return;
  }

  // Generate ID from name
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  template.meta.id = id;
  template.meta.name = name;
  template.meta.created = new Date().toISOString().split('T')[0];

  const filePath = path.join(DIAGRAMS_DIR, `${id}.json`);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log(`\n❌ File already exists: ${filePath}`);
    return;
  }

  // Ensure diagrams directory exists
  if (!fs.existsSync(DIAGRAMS_DIR)) {
    fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
  console.log(`\n✅ Created: diagrams/${id}.json`);
  console.log(`\nNext steps:`);
  console.log(`   1. Edit the file to add your content`);
  console.log(`   2. Run: node cli.js build diagrams/${id}.json`);
}

// List available diagrams
function listDiagrams() {
  console.log('\n📋 Existing diagrams:\n');

  if (!fs.existsSync(DIAGRAMS_DIR)) {
    console.log('   No diagrams directory found.');
    return;
  }

  const diagramFiles = fs.readdirSync(DIAGRAMS_DIR)
    .filter(f => f.endsWith('.json'));

  if (diagramFiles.length === 0) {
    console.log('   No diagram files found.');
    console.log('\n   Create one with: node cli.js new <type> "<name>"');
    return;
  }

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

// List available diagram types
function listTypes() {
  console.log('\n📐 Available diagram types:\n');

  const validator = new DiagramValidator();
  validator.listTypes().forEach(t => {
    console.log(`   ${t.type}`);
    console.log(`      ${t.description}`);
    console.log(`      Variants: ${t.variants.join(', ')}`);
    console.log(`      Canvas: ${t.canvas}`);
    console.log('');
  });

  console.log('Create a new diagram: node cli.js new <type> "<Name>"');
}

// List available variants
function listVariants() {
  console.log('\n🎨 Available box variants:\n');

  const validator = new DiagramValidator();
  const TokenResolver = require('./lib/tokens');
  const tokens = new TokenResolver();
  const components = JSON.parse(fs.readFileSync(path.join(__dirname, 'components.json'), 'utf8'));

  validator.listVariants().forEach(v => {
    const style = components.boxVariants[v];
    const fill = tokens.resolve(style.fill);
    const stroke = style.stroke === 'none' ? 'none' : tokens.resolve(style.stroke);
    console.log(`   ${v}`);
    console.log(`      Fill: ${fill}, Stroke: ${stroke}`);
  });
}

// Show token values
function showTokens() {
  console.log('\n🎯 Current token values:\n');

  const TokenResolver = require('./lib/tokens');
  const tokens = new TokenResolver();

  console.log('Colors:');
  console.log(`   Navy:    ${tokens.get('colors.primary.navy')}`);
  console.log(`   Emerald: ${tokens.get('colors.primary.emerald')}`);
  console.log(`   Ocean:   ${tokens.get('colors.secondary.ocean')}`);
  console.log(`   Violet:  ${tokens.get('colors.secondary.violet')}`);
  console.log(`   Gray:    ${tokens.get('colors.neutral.gray')}`);

  console.log('\nTypography:');
  console.log(`   Font:    ${tokens.get('typography.family')}`);

  console.log('\nSpacing:');
  console.log(`   Unit:    ${tokens.get('spacing.unit')}px`);
  console.log(`   Medium:  ${tokens.get('spacing.scale.md')}px`);

  console.log('\nBorders:');
  console.log(`   Radius:  ${tokens.get('borders.radius.md')}px`);
}

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];
  const extra = args[2];
  const flags = args.filter(a => a.startsWith('--'));

  const options = {
    svg: flags.includes('--svg'),
    png: flags.includes('--png'),
    pptx: flags.includes('--pptx'),
    all: !flags.some(f => ['--svg', '--png', '--pptx'].includes(f))
  };

  return { command, target, extra, options };
}

// Main entry point
async function main() {
  const { command, target, extra, options } = parseArgs();

  console.log('╔════════════════════════════════════════╗');
  console.log('║     HLV Asset System Generator         ║');
  console.log('╚════════════════════════════════════════╝');

  switch (command) {
    case 'build':
      if (!target) {
        console.error('\n❌ Please specify a diagram file');
        console.log('Usage: node cli.js build diagrams/<name>.json');
        process.exit(1);
      }
      await buildDiagram(target, options);
      break;

    case 'build-all':
      await buildAll();
      break;

    case 'new':
      if (!target || !extra) {
        console.error('\n❌ Please specify type and name');
        console.log('Usage: node cli.js new <type> "<name>"');
        console.log('Example: node cli.js new flow "Build Measure Learn"');
        listTypes();
        process.exit(1);
      }
      createNew(target, extra);
      break;

    case 'validate':
      if (!target) {
        console.error('\n❌ Please specify a diagram file');
        process.exit(1);
      }
      validateDiagram(target);
      break;

    case 'types':
      listTypes();
      break;

    case 'variants':
      listVariants();
      break;

    case 'tokens':
      showTokens();
      break;

    case 'list':
      listDiagrams();
      break;

    default:
      console.log(`
Commands:
  build <file>           Build a diagram (SVG + PNG + PPTX)
  build-all              Build all diagrams in diagrams/
  new <type> "<name>"    Create new diagram from template
  validate <file>        Validate a diagram spec
  list                   List existing diagrams
  types                  Show available diagram types
  variants               Show available box variants
  tokens                 Show current token values

Options:
  --svg   Generate SVG only
  --png   Generate PNG only
  --pptx  Generate PPTX only

Examples:
  node cli.js new flow "Customer Journey"
  node cli.js build diagrams/customer-journey.json
  node cli.js build-all
  node cli.js tokens
`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
