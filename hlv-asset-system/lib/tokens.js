/**
 * Token Resolver
 * Resolves @references in component/diagram specs to actual values from tokens.json
 */

const fs = require('fs');
const path = require('path');

class TokenResolver {
  constructor(tokensPath) {
    const tokensFile = tokensPath || path.join(__dirname, '..', 'tokens.json');
    this.tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
    this.cache = new Map();
  }

  /**
   * Get a value from tokens by dot-notation path
   * @param {string} tokenPath - e.g., "colors.primary.navy"
   * @returns {*} The resolved value
   */
  get(tokenPath) {
    if (this.cache.has(tokenPath)) {
      return this.cache.get(tokenPath);
    }

    const parts = tokenPath.split('.');
    let value = this.tokens;

    for (const part of parts) {
      if (value === undefined || value === null) {
        throw new Error(`Token path not found: ${tokenPath}`);
      }
      value = value[part];
    }

    this.cache.set(tokenPath, value);
    return value;
  }

  /**
   * Resolve a value that may contain @references
   * @param {*} value - String with @reference or any other value
   * @returns {*} Resolved value
   */
  resolve(value) {
    if (typeof value !== 'string') {
      return value;
    }

    // Check if it's a token reference (starts with @)
    if (value.startsWith('@')) {
      const tokenPath = value.slice(1); // Remove @
      return this.get(tokenPath);
    }

    return value;
  }

  /**
   * Deep resolve all @references in an object
   * @param {*} obj - Object, array, or primitive
   * @returns {*} Object with all references resolved
   */
  resolveAll(obj) {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.resolve(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveAll(item));
    }

    if (typeof obj === 'object') {
      const resolved = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = this.resolveAll(value);
      }
      return resolved;
    }

    return obj;
  }

  /**
   * Get color without # prefix (for pptxgenjs)
   * @param {string} colorRef - Color reference or hex value
   * @returns {string} Hex color without #
   */
  getColor(colorRef) {
    const color = this.resolve(colorRef);
    if (typeof color === 'string' && color.startsWith('#')) {
      return color.slice(1);
    }
    return color;
  }

  /**
   * Get all tokens (for debugging/inspection)
   */
  getAll() {
    return this.tokens;
  }
}

module.exports = TokenResolver;
