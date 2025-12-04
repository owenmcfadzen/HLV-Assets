/**
 * Diagram Validator
 * Validates diagram specs and provides helpful error messages
 */

const fs = require('fs');
const path = require('path');

class DiagramValidator {
  constructor() {
    this.diagramTypesPath = path.join(__dirname, '..', 'diagram-types.json');
    this.componentsPath = path.join(__dirname, '..', 'components.json');

    this.diagramTypes = JSON.parse(fs.readFileSync(this.diagramTypesPath, 'utf8'));
    this.components = JSON.parse(fs.readFileSync(this.componentsPath, 'utf8'));
  }

  /**
   * Validate a diagram spec
   * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
   */
  validate(spec) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!spec.type) {
      errors.push('Missing required field: "type" (e.g., "flow", "comparison", "wheel")');
    }

    if (!spec.meta?.id) {
      warnings.push('Missing meta.id - will use filename as identifier');
    }

    // Validate diagram type
    if (spec.type && !this.diagramTypes.types[spec.type]) {
      const validTypes = Object.keys(this.diagramTypes.types).join(', ');
      errors.push(`Invalid diagram type "${spec.type}". Valid types: ${validTypes}`);
    }

    // Validate variant if specified
    if (spec.type && spec.variant) {
      const typeConfig = this.diagramTypes.types[spec.type];
      if (typeConfig && !typeConfig.variants.includes(spec.variant)) {
        const validVariants = typeConfig.variants.join(', ');
        errors.push(`Invalid variant "${spec.variant}" for type "${spec.type}". Valid: ${validVariants}`);
      }
    }

    // Validate content structure based on type
    if (spec.type === 'comparison') {
      if (!spec.content?.columns || !Array.isArray(spec.content.columns)) {
        errors.push('Comparison diagrams require content.columns array');
      } else {
        spec.content.columns.forEach((col, i) => {
          if (!col.header?.text) {
            errors.push(`Column ${i + 1} missing header.text`);
          }
        });
      }
    }

    if (spec.type === 'flow') {
      if (!spec.content?.steps || !Array.isArray(spec.content.steps)) {
        errors.push('Flow diagrams require content.steps array');
      }
    }

    // Validate box variants
    const validVariants = Object.keys(this.components.boxVariants);
    const checkVariant = (variant, location) => {
      if (variant && !validVariants.includes(variant)) {
        warnings.push(`Unknown variant "${variant}" at ${location}. Valid: ${validVariants.join(', ')}`);
      }
    };

    // Deep check for variants in content
    if (spec.content?.columns) {
      spec.content.columns.forEach((col, i) => {
        checkVariant(col.header?.variant, `columns[${i}].header.variant`);
        if (col.flow?.steps) {
          col.flow.steps.forEach((step, j) => {
            checkVariant(step.variant, `columns[${i}].flow.steps[${j}].variant`);
          });
        }
      });
    }

    if (spec.content?.steps) {
      spec.content.steps.forEach((step, i) => {
        checkVariant(step.variant, `content.steps[${i}].variant`);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get a template for a diagram type
   */
  getTemplate(type, variant = null) {
    const typeConfig = this.diagramTypes.types[type];
    if (!typeConfig) return null;

    const template = {
      $schema: 'hlv-diagram-v1',
      meta: {
        id: `new-${type}-diagram`,
        name: `New ${typeConfig.name}`,
        description: typeConfig.description,
        created: new Date().toISOString().split('T')[0]
      },
      type: type,
      variant: variant || typeConfig.defaultVariant,
      canvas: typeConfig.canvas,
      content: this._getContentTemplate(type, variant || typeConfig.defaultVariant),
      export: {
        svg: true,
        png: true,
        pptx: true
      }
    };

    return template;
  }

  _getContentTemplate(type, variant) {
    switch (type) {
      case 'flow':
        return {
          title: 'Flow Title',
          steps: [
            { id: 'step-1', label: 'Step 1', variant: 'default' },
            { id: 'step-2', label: 'Step 2', variant: 'default' },
            { id: 'step-3', label: 'Step 3', variant: 'primary' }
          ]
        };

      case 'comparison':
        return {
          title: 'Comparison Title',
          columns: [
            {
              id: 'option-a',
              header: { text: 'Option A', variant: 'default' },
              flow: {
                steps: [
                  { id: 'a-1', label: 'Point 1', variant: 'default' }
                ]
              }
            },
            {
              id: 'option-b',
              header: { text: 'Option B', variant: 'primary' },
              flow: {
                steps: [
                  { id: 'b-1', label: 'Point 1', variant: 'highlight' }
                ]
              }
            }
          ],
          divider: { style: 'vs', label: 'vs' }
        };

      case 'wheel':
        return {
          title: 'Wheel Title',
          center: { label: 'Core Concept', variant: 'primary' },
          segments: [
            { id: 'seg-1', label: 'Segment 1' },
            { id: 'seg-2', label: 'Segment 2' },
            { id: 'seg-3', label: 'Segment 3' },
            { id: 'seg-4', label: 'Segment 4' }
          ]
        };

      case 'matrix':
        return {
          title: 'Matrix Title',
          xAxis: { label: 'X Axis', low: 'Low', high: 'High' },
          yAxis: { label: 'Y Axis', low: 'Low', high: 'High' },
          quadrants: [
            { position: 'top-left', label: 'Q1' },
            { position: 'top-right', label: 'Q2' },
            { position: 'bottom-left', label: 'Q3' },
            { position: 'bottom-right', label: 'Q4' }
          ]
        };

      default:
        return { title: 'Diagram Title' };
    }
  }

  /**
   * List all available diagram types with descriptions
   */
  listTypes() {
    return Object.entries(this.diagramTypes.types).map(([key, config]) => ({
      type: key,
      name: config.name,
      description: config.description,
      variants: config.variants,
      defaultVariant: config.defaultVariant,
      canvas: config.canvas
    }));
  }

  /**
   * List all available box variants
   */
  listVariants() {
    return Object.keys(this.components.boxVariants);
  }
}

module.exports = DiagramValidator;
