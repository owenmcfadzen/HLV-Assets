/**
 * Apple Design System Data Extraction Tool
 *
 * Systematically scrapes Apple's website to extract:
 * - Typography data (fonts, sizes, weights, line-heights)
 * - Color data (backgrounds, text, borders, accents)
 * - Spacing data (padding, margins, gaps)
 * - Layout/grid data (containers, columns, breakpoints)
 * - Section structures
 * - Copy/content for voice analysis
 * - Image/media metadata
 */

import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

// Configuration
const CONFIG = {
  baseDir: path.resolve(import.meta.dirname, '..'),
  viewports: [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 }
  ],
  requestDelay: 1500, // ms between requests
  timeout: 60000, // page load timeout
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Pages organized by priority
const PAGES = {
  1: [
    { name: 'homepage', url: 'https://www.apple.com/' },
    { name: 'iphone', url: 'https://www.apple.com/iphone/' },
    { name: 'iphone-16-pro', url: 'https://www.apple.com/iphone-16-pro/' },
    { name: 'iphone-compare', url: 'https://www.apple.com/iphone/compare/' },
    { name: 'mac', url: 'https://www.apple.com/mac/' },
    { name: 'macbook-pro', url: 'https://www.apple.com/macbook-pro/' },
    { name: 'macbook-air', url: 'https://www.apple.com/macbook-air/' }
  ],
  2: [
    { name: 'ipad', url: 'https://www.apple.com/ipad/' },
    { name: 'ipad-pro', url: 'https://www.apple.com/ipad-pro/' },
    { name: 'apple-watch-ultra-2', url: 'https://www.apple.com/apple-watch-ultra-2/' },
    { name: 'apple-watch-series-10', url: 'https://www.apple.com/apple-watch-series-10/' },
    { name: 'airpods', url: 'https://www.apple.com/airpods/' },
    { name: 'airpods-pro', url: 'https://www.apple.com/airpods-pro/' },
    { name: 'apple-vision-pro', url: 'https://www.apple.com/apple-vision-pro/' },
    { name: 'homepod', url: 'https://www.apple.com/homepod/' },
    { name: 'apple-tv-4k', url: 'https://www.apple.com/apple-tv-4k/' },
    { name: 'imac', url: 'https://www.apple.com/imac/' },
    { name: 'mac-mini', url: 'https://www.apple.com/mac-mini/' },
    { name: 'mac-studio', url: 'https://www.apple.com/mac-studio/' },
    { name: 'mac-pro', url: 'https://www.apple.com/mac-pro/' }
  ],
  3: [
    { name: 'ios-18', url: 'https://www.apple.com/ios/ios-18/' },
    { name: 'ipados-18', url: 'https://www.apple.com/ipados/ipados-18/' },
    { name: 'macos-sequoia', url: 'https://www.apple.com/macos/macos-sequoia/' },
    { name: 'watchos-11', url: 'https://www.apple.com/watchos/watchos-11/' },
    { name: 'tvos-18', url: 'https://www.apple.com/tvos/tvos-18/' },
    { name: 'visionos', url: 'https://www.apple.com/visionos/' }
  ],
  4: [
    { name: 'apple-music', url: 'https://www.apple.com/apple-music/' },
    { name: 'apple-tv-plus', url: 'https://www.apple.com/apple-tv-plus/' },
    { name: 'apple-arcade', url: 'https://www.apple.com/apple-arcade/' },
    { name: 'apple-fitness-plus', url: 'https://www.apple.com/apple-fitness-plus/' },
    { name: 'apple-news', url: 'https://www.apple.com/apple-news/' },
    { name: 'icloud', url: 'https://www.apple.com/icloud/' },
    { name: 'apple-one', url: 'https://www.apple.com/apple-one/' },
    { name: 'apple-card', url: 'https://www.apple.com/apple-card/' },
    { name: 'apple-pay', url: 'https://www.apple.com/apple-pay/' }
  ],
  5: [
    { name: 'accessibility', url: 'https://www.apple.com/accessibility/' },
    { name: 'environment', url: 'https://www.apple.com/environment/' },
    { name: 'privacy', url: 'https://www.apple.com/privacy/' },
    { name: 'diversity', url: 'https://www.apple.com/diversity/' },
    { name: 'supplier-responsibility', url: 'https://www.apple.com/supplier-responsibility/' }
  ],
  6: [
    { name: 'retail', url: 'https://www.apple.com/retail/' },
    { name: 'today-at-apple', url: 'https://www.apple.com/today/' },
    { name: 'shop', url: 'https://www.apple.com/shop' },
    { name: 'support', url: 'https://support.apple.com/' },
    { name: 'newsroom', url: 'https://www.apple.com/newsroom/' },
    { name: 'leadership', url: 'https://www.apple.com/leadership/' },
    { name: 'careers', url: 'https://www.apple.com/careers/' },
    { name: 'business', url: 'https://www.apple.com/business/' },
    { name: 'education', url: 'https://www.apple.com/education/' }
  ],
  7: [
    { name: 'shop-buy-iphone', url: 'https://www.apple.com/shop/buy-iphone' },
    { name: 'shop-buy-mac', url: 'https://www.apple.com/shop/buy-mac' },
    { name: 'shop-buy-ipad', url: 'https://www.apple.com/shop/buy-ipad' },
    { name: 'shop-buy-watch', url: 'https://www.apple.com/shop/buy-watch' }
  ]
};

// Extraction functions to run in browser context
const browserExtractors = {
  /**
   * Extract typography data from all text elements
   */
  typography: () => {
    const textSelectors = 'h1, h2, h3, h4, h5, h6, p, span, a, li, label, button, figcaption, blockquote, cite, strong, em, small, [class*="headline"], [class*="title"], [class*="copy"], [class*="text"], [class*="description"], [class*="subhead"], [class*="cta"]';
    const elements = document.querySelectorAll(textSelectors);
    const data = [];
    const seen = new Set();

    elements.forEach((el, index) => {
      const text = el.textContent?.trim();
      if (!text || text.length > 500) return; // Skip empty or very long texts

      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Skip invisible elements
      if (rect.width === 0 || rect.height === 0) return;
      if (style.display === 'none' || style.visibility === 'hidden') return;

      // Create a unique key to avoid duplicates
      const key = `${el.tagName}-${text.substring(0, 50)}-${style.fontSize}-${style.fontWeight}`;
      if (seen.has(key)) return;
      seen.add(key);

      // Find the nearest section context
      let section = el.closest('section, [class*="section"], [class*="module"], [class*="hero"], [class*="gallery"], [class*="tile"], [class*="card"], header, footer, nav, main, article');
      const sectionClass = section?.className || '';
      const sectionId = section?.id || '';

      data.push({
        tag: el.tagName.toLowerCase(),
        className: el.className || '',
        id: el.id || '',
        text: text.substring(0, 300), // Truncate very long text
        styles: {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textTransform: style.textTransform,
          color: style.color
        },
        position: {
          top: Math.round(rect.top),
          left: Math.round(rect.left)
        },
        section: {
          className: sectionClass,
          id: sectionId
        },
        index
      });
    });

    return data;
  },

  /**
   * Extract color data from all elements
   */
  colors: () => {
    const elements = document.querySelectorAll('*');
    const colors = {
      backgrounds: {},
      texts: {},
      borders: {},
      accents: {}
    };

    const normalizeColor = (color) => {
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null;
      return color;
    };

    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const bgColor = normalizeColor(style.backgroundColor);
      const textColor = normalizeColor(style.color);
      const borderColor = normalizeColor(style.borderColor);

      const context = {
        tag: el.tagName.toLowerCase(),
        className: (el.className || '').substring(0, 100)
      };

      if (bgColor) {
        if (!colors.backgrounds[bgColor]) colors.backgrounds[bgColor] = [];
        if (colors.backgrounds[bgColor].length < 5) {
          colors.backgrounds[bgColor].push(context);
        }
      }

      if (textColor) {
        if (!colors.texts[textColor]) colors.texts[textColor] = [];
        if (colors.texts[textColor].length < 5) {
          colors.texts[textColor].push(context);
        }
      }

      if (borderColor && style.borderWidth !== '0px') {
        if (!colors.borders[borderColor]) colors.borders[borderColor] = [];
        if (colors.borders[borderColor].length < 5) {
          colors.borders[borderColor].push(context);
        }
      }
    });

    return colors;
  },

  /**
   * Extract spacing data from sections and major elements
   */
  spacing: () => {
    const selectors = 'section, [class*="section"], [class*="module"], [class*="hero"], [class*="container"], [class*="wrapper"], [class*="content"], [class*="grid"], [class*="row"], [class*="tile"], [class*="card"], header, footer, main, article, aside, nav, div[class]';
    const elements = document.querySelectorAll(selectors);
    const data = [];

    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) return;
      if (style.display === 'none') return;

      // Only collect elements with interesting spacing values
      const hasSpacing =
        parseInt(style.paddingTop) > 0 ||
        parseInt(style.paddingBottom) > 0 ||
        parseInt(style.marginTop) > 0 ||
        parseInt(style.marginBottom) > 0 ||
        style.gap !== 'normal' && style.gap !== '0px';

      if (!hasSpacing) return;

      data.push({
        tag: el.tagName.toLowerCase(),
        className: (el.className || '').substring(0, 150),
        id: el.id || '',
        spacing: {
          paddingTop: style.paddingTop,
          paddingRight: style.paddingRight,
          paddingBottom: style.paddingBottom,
          paddingLeft: style.paddingLeft,
          marginTop: style.marginTop,
          marginRight: style.marginRight,
          marginBottom: style.marginBottom,
          marginLeft: style.marginLeft,
          gap: style.gap,
          rowGap: style.rowGap,
          columnGap: style.columnGap
        },
        dimensions: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          minHeight: style.minHeight,
          maxWidth: style.maxWidth
        }
      });
    });

    return data;
  },

  /**
   * Extract layout/grid data
   */
  layout: () => {
    const containers = document.querySelectorAll('[class*="container"], [class*="wrapper"], [class*="grid"], [class*="row"], [class*="flex"], [class*="column"], main, section');
    const data = [];

    containers.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (rect.width === 0) return;

      const isGrid = style.display === 'grid' || style.display === 'inline-grid';
      const isFlex = style.display === 'flex' || style.display === 'inline-flex';

      if (!isGrid && !isFlex && !el.className?.includes('container')) return;

      data.push({
        tag: el.tagName.toLowerCase(),
        className: (el.className || '').substring(0, 150),
        display: style.display,
        layout: {
          flexDirection: isFlex ? style.flexDirection : null,
          flexWrap: isFlex ? style.flexWrap : null,
          justifyContent: style.justifyContent,
          alignItems: style.alignItems,
          gridTemplateColumns: isGrid ? style.gridTemplateColumns : null,
          gridTemplateRows: isGrid ? style.gridTemplateRows : null,
          gap: style.gap
        },
        dimensions: {
          width: Math.round(rect.width),
          maxWidth: style.maxWidth,
          margin: `${style.marginLeft} ${style.marginRight}`
        }
      });
    });

    return data;
  },

  /**
   * Extract section structure
   */
  sections: () => {
    const sectionSelectors = 'section, [class*="section"], [class*="module"], [class*="hero"], [class*="gallery"], [class*="tile-group"], [class*="compare"], header, footer, nav[class*="global"], main';
    const sections = document.querySelectorAll(sectionSelectors);
    const data = [];

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.height === 0) return;

      // Get immediate children structure
      const children = Array.from(section.children).slice(0, 10).map(child => ({
        tag: child.tagName.toLowerCase(),
        className: (child.className || '').substring(0, 100)
      }));

      // Find headlines in this section
      const headlines = Array.from(section.querySelectorAll('h1, h2, h3, [class*="headline"], [class*="title"]'))
        .slice(0, 5)
        .map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.textContent?.trim().substring(0, 100)
        }));

      data.push({
        index,
        tag: section.tagName.toLowerCase(),
        className: section.className || '',
        id: section.id || '',
        position: {
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height)
        },
        children,
        headlines
      });
    });

    return data;
  },

  /**
   * Extract all copy/content with hierarchy
   */
  copy: () => {
    const sections = document.querySelectorAll('section, [class*="section"], [class*="module"], [class*="hero"], header, footer, main, article');
    const data = [];

    sections.forEach((section, sectionIndex) => {
      const sectionData = {
        sectionIndex,
        sectionClass: section.className || '',
        sectionId: section.id || '',
        content: []
      };

      // Headlines
      section.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="headline"], [class*="title"]').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length < 300) {
          sectionData.content.push({
            type: 'headline',
            tag: el.tagName.toLowerCase(),
            className: el.className || '',
            text
          });
        }
      });

      // Subheadlines/taglines
      section.querySelectorAll('[class*="subhead"], [class*="tagline"], [class*="eyebrow"], [class*="intro"]').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length < 300) {
          sectionData.content.push({
            type: 'subheadline',
            tag: el.tagName.toLowerCase(),
            className: el.className || '',
            text
          });
        }
      });

      // Body paragraphs
      section.querySelectorAll('p, [class*="copy"], [class*="description"], [class*="body"]').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 10 && text.length < 1000) {
          sectionData.content.push({
            type: 'body',
            tag: el.tagName.toLowerCase(),
            className: el.className || '',
            text
          });
        }
      });

      // CTAs and buttons
      section.querySelectorAll('a[class*="cta"], a[class*="button"], a[class*="link"], button, [class*="cta"], [role="button"]').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length < 100) {
          sectionData.content.push({
            type: 'cta',
            tag: el.tagName.toLowerCase(),
            className: el.className || '',
            text,
            href: el.href || null
          });
        }
      });

      if (sectionData.content.length > 0) {
        data.push(sectionData);
      }
    });

    // Navigation labels
    const navItems = [];
    document.querySelectorAll('nav a, [class*="nav"] a, header a').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 50) {
        navItems.push({
          type: 'nav',
          text,
          href: el.href || null
        });
      }
    });

    // Footer content
    const footerContent = [];
    document.querySelectorAll('footer, [class*="footer"]').forEach(footer => {
      footer.querySelectorAll('a, p, span').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length < 100 && text.length > 2) {
          footerContent.push({
            type: 'footer',
            tag: el.tagName.toLowerCase(),
            text
          });
        }
      });
    });

    return { sections: data, navigation: navItems, footer: footerContent };
  },

  /**
   * Extract image/media metadata
   */
  media: () => {
    const data = {
      images: [],
      videos: [],
      figures: []
    };

    // Images
    document.querySelectorAll('img, picture source, [class*="image"]').forEach(el => {
      if (el.tagName === 'IMG') {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return;

        data.images.push({
          src: el.src?.substring(0, 200) || '',
          alt: el.alt || '',
          width: el.naturalWidth || Math.round(rect.width),
          height: el.naturalHeight || Math.round(rect.height),
          aspectRatio: el.naturalWidth && el.naturalHeight
            ? (el.naturalWidth / el.naturalHeight).toFixed(2)
            : null,
          className: el.className || '',
          loading: el.loading || 'auto'
        });
      }
    });

    // Videos
    document.querySelectorAll('video, [class*="video"]').forEach(el => {
      if (el.tagName === 'VIDEO') {
        const rect = el.getBoundingClientRect();
        data.videos.push({
          src: el.src?.substring(0, 200) || '',
          poster: el.poster?.substring(0, 200) || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          autoplay: el.autoplay,
          loop: el.loop,
          muted: el.muted,
          className: el.className || ''
        });
      }
    });

    // Figures with captions
    document.querySelectorAll('figure').forEach(fig => {
      const img = fig.querySelector('img');
      const caption = fig.querySelector('figcaption');
      if (img || caption) {
        data.figures.push({
          hasImage: !!img,
          imageAlt: img?.alt || '',
          caption: caption?.textContent?.trim().substring(0, 200) || '',
          className: fig.className || ''
        });
      }
    });

    return data;
  }
};

/**
 * Main scraper class
 */
class AppleDesignScraper {
  constructor() {
    this.browser = null;
    this.results = {
      typography: { pages: {}, aggregated: {} },
      colors: { pages: {}, aggregated: {} },
      spacing: { pages: {}, aggregated: {} },
      layouts: { pages: {}, aggregated: {} },
      sections: { pages: {} },
      copy: { pages: {} },
      media: { pages: {} }
    };
    this.scrapedPages = [];
    this.errors = [];
  }

  async init() {
    console.log('Launching browser...');
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrapePage(pageInfo, viewport = CONFIG.viewports[0]) {
    const { name, url } = pageInfo;
    console.log(`\n📄 Scraping: ${name} (${viewport.name})`);
    console.log(`   URL: ${url}`);

    const context = await this.browser.newContext({
      userAgent: CONFIG.userAgent,
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      // Navigate to page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: CONFIG.timeout
      });

      // Wait for content to load
      await page.waitForSelector('body', { timeout: 10000 });

      // Scroll to load lazy content
      await this.autoScroll(page);

      // Get raw HTML
      const html = await page.content();

      // Save raw HTML
      const htmlPath = path.join(CONFIG.baseDir, 'raw-html', `${name}.html`);
      await fs.writeFile(htmlPath, html);
      console.log(`   ✓ Saved HTML (${(html.length / 1024).toFixed(1)} KB)`);

      // Extract all data
      const timestamp = new Date().toISOString();
      const pageKey = `${name}_${viewport.name}`;

      // Typography
      console.log('   Extracting typography...');
      const typography = await page.evaluate(browserExtractors.typography);
      this.results.typography.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        elements: typography
      };
      console.log(`   ✓ Typography: ${typography.length} elements`);

      // Colors
      console.log('   Extracting colors...');
      const colors = await page.evaluate(browserExtractors.colors);
      this.results.colors.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        ...colors
      };
      console.log(`   ✓ Colors: ${Object.keys(colors.backgrounds).length} backgrounds, ${Object.keys(colors.texts).length} text colors`);

      // Spacing
      console.log('   Extracting spacing...');
      const spacing = await page.evaluate(browserExtractors.spacing);
      this.results.spacing.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        elements: spacing
      };
      console.log(`   ✓ Spacing: ${spacing.length} elements`);

      // Layout
      console.log('   Extracting layout...');
      const layout = await page.evaluate(browserExtractors.layout);
      this.results.layouts.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        elements: layout
      };
      console.log(`   ✓ Layout: ${layout.length} elements`);

      // Sections
      console.log('   Extracting sections...');
      const sections = await page.evaluate(browserExtractors.sections);
      this.results.sections.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        sections
      };
      console.log(`   ✓ Sections: ${sections.length} sections`);

      // Copy
      console.log('   Extracting copy...');
      const copy = await page.evaluate(browserExtractors.copy);
      this.results.copy.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        ...copy
      };
      console.log(`   ✓ Copy: ${copy.sections.length} content sections`);

      // Media
      console.log('   Extracting media...');
      const media = await page.evaluate(browserExtractors.media);
      this.results.media.pages[pageKey] = {
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        ...media
      };
      console.log(`   ✓ Media: ${media.images.length} images, ${media.videos.length} videos`);

      // Generate copy markdown
      await this.generateCopyMarkdown(name, copy);

      this.scrapedPages.push({
        name,
        url,
        viewport: viewport.name,
        scraped_at: timestamp,
        stats: {
          typographyElements: typography.length,
          backgroundColors: Object.keys(colors.backgrounds).length,
          textColors: Object.keys(colors.texts).length,
          spacingElements: spacing.length,
          layoutElements: layout.length,
          sections: sections.length,
          images: media.images.length
        }
      });

      console.log(`   ✅ Completed: ${name}`);

    } catch (error) {
      console.error(`   ❌ Error scraping ${name}: ${error.message}`);
      this.errors.push({
        page: name,
        url,
        viewport: viewport.name,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await context.close();
    }
  }

  async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
  }

  async generateCopyMarkdown(pageName, copyData) {
    let md = `# ${pageName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Copy\n\n`;
    md += `*Extracted: ${new Date().toISOString()}*\n\n---\n\n`;

    // Navigation
    if (copyData.navigation?.length > 0) {
      md += `## Navigation\n\n`;
      copyData.navigation.forEach(item => {
        md += `- ${item.text}\n`;
      });
      md += `\n`;
    }

    // Sections
    copyData.sections.forEach((section, i) => {
      const sectionName = section.sectionClass?.split(' ')[0] || section.sectionId || `Section ${i + 1}`;
      md += `## ${sectionName}\n\n`;

      section.content.forEach(item => {
        switch (item.type) {
          case 'headline':
            md += `**Headline (${item.tag}):** ${item.text}\n\n`;
            break;
          case 'subheadline':
            md += `**Subhead:** ${item.text}\n\n`;
            break;
          case 'body':
            md += `${item.text}\n\n`;
            break;
          case 'cta':
            md += `**CTA:** ${item.text}${item.href ? ` → ${item.href}` : ''}\n\n`;
            break;
        }
      });

      md += `---\n\n`;
    });

    // Footer
    if (copyData.footer?.length > 0) {
      md += `## Footer\n\n`;
      const uniqueFooter = [...new Set(copyData.footer.map(f => f.text))];
      uniqueFooter.slice(0, 30).forEach(text => {
        md += `- ${text}\n`;
      });
    }

    const copyPath = path.join(CONFIG.baseDir, 'copy', `${pageName}-copy.md`);
    await fs.writeFile(copyPath, md);
  }

  async aggregate() {
    console.log('\n📊 Aggregating data...');

    // Aggregate typography
    const allFontSizes = new Set();
    const allFontWeights = new Set();
    const allFontFamilies = new Set();
    const allLineHeights = new Set();
    const allLetterSpacings = new Set();

    Object.values(this.results.typography.pages).forEach(page => {
      page.elements?.forEach(el => {
        if (el.styles.fontSize) allFontSizes.add(el.styles.fontSize);
        if (el.styles.fontWeight) allFontWeights.add(el.styles.fontWeight);
        if (el.styles.fontFamily) {
          // Extract first font family
          const family = el.styles.fontFamily.split(',')[0].trim().replace(/"/g, '');
          allFontFamilies.add(family);
        }
        if (el.styles.lineHeight) allLineHeights.add(el.styles.lineHeight);
        if (el.styles.letterSpacing && el.styles.letterSpacing !== 'normal') {
          allLetterSpacings.add(el.styles.letterSpacing);
        }
      });
    });

    this.results.typography.aggregated = {
      fontSizesUsed: [...allFontSizes].sort((a, b) => parseInt(a) - parseInt(b)),
      fontWeightsUsed: [...allFontWeights].sort(),
      fontFamilies: [...allFontFamilies],
      lineHeightsUsed: [...allLineHeights].sort(),
      letterSpacingsUsed: [...allLetterSpacings].sort()
    };

    // Aggregate colors
    const allBackgrounds = {};
    const allTextColors = {};

    Object.values(this.results.colors.pages).forEach(page => {
      Object.keys(page.backgrounds || {}).forEach(color => {
        allBackgrounds[color] = (allBackgrounds[color] || 0) + 1;
      });
      Object.keys(page.texts || {}).forEach(color => {
        allTextColors[color] = (allTextColors[color] || 0) + 1;
      });
    });

    this.results.colors.aggregated = {
      backgroundColors: Object.entries(allBackgrounds)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([color, count]) => ({ color, count })),
      textColors: Object.entries(allTextColors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([color, count]) => ({ color, count }))
    };

    // Aggregate spacing values
    const allSpacingValues = new Set();
    Object.values(this.results.spacing.pages).forEach(page => {
      page.elements?.forEach(el => {
        Object.values(el.spacing || {}).forEach(val => {
          if (val && val !== '0px' && val !== 'normal') {
            allSpacingValues.add(val);
          }
        });
      });
    });

    this.results.spacing.aggregated = {
      uniqueValues: [...allSpacingValues].sort((a, b) => parseInt(a) - parseInt(b))
    };

    // Aggregate layouts
    const maxWidths = new Set();
    Object.values(this.results.layouts.pages).forEach(page => {
      page.elements?.forEach(el => {
        if (el.dimensions?.maxWidth && el.dimensions.maxWidth !== 'none') {
          maxWidths.add(el.dimensions.maxWidth);
        }
      });
    });

    this.results.layouts.aggregated = {
      containerMaxWidths: [...maxWidths].sort((a, b) => parseInt(a) - parseInt(b))
    };

    console.log('✓ Aggregation complete');
  }

  async generateHeadlinesFile() {
    let md = `# All Headlines - Apple Website\n\n`;
    md += `*Aggregated for pattern analysis*\n\n---\n\n`;

    Object.entries(this.results.copy.pages).forEach(([pageKey, pageData]) => {
      md += `## ${pageKey}\n\n`;

      pageData.sections?.forEach(section => {
        section.content
          .filter(item => item.type === 'headline' || item.type === 'subheadline')
          .forEach(item => {
            const prefix = item.type === 'headline' ? '**' : '*';
            md += `${prefix}${item.text}${prefix}\n\n`;
          });
      });

      md += `---\n\n`;
    });

    const headlinesPath = path.join(CONFIG.baseDir, 'copy', 'all-headlines.md');
    await fs.writeFile(headlinesPath, md);
    console.log('✓ Generated all-headlines.md');
  }

  async saveResults() {
    console.log('\n💾 Saving results...');

    // Save extracted JSON files
    const jsonFiles = [
      { name: 'typography.json', data: this.results.typography },
      { name: 'colors.json', data: this.results.colors },
      { name: 'spacing.json', data: this.results.spacing },
      { name: 'layouts.json', data: this.results.layouts },
      { name: 'sections.json', data: this.results.sections },
      { name: 'media.json', data: this.results.media }
    ];

    for (const { name, data } of jsonFiles) {
      const filePath = path.join(CONFIG.baseDir, 'extracted', name);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`   ✓ Saved ${name}`);
    }

    // Save metadata
    const pagesScraped = {
      totalPages: this.scrapedPages.length,
      pages: this.scrapedPages,
      errors: this.errors
    };
    await fs.writeFile(
      path.join(CONFIG.baseDir, 'metadata', 'pages-scraped.json'),
      JSON.stringify(pagesScraped, null, 2)
    );

    // Generate extraction notes
    let notes = `# Extraction Notes\n\n`;
    notes += `*Generated: ${new Date().toISOString()}*\n\n`;
    notes += `## Summary\n\n`;
    notes += `- Total pages scraped: ${this.scrapedPages.length}\n`;
    notes += `- Errors encountered: ${this.errors.length}\n\n`;

    if (this.errors.length > 0) {
      notes += `## Errors\n\n`;
      this.errors.forEach(err => {
        notes += `### ${err.page}\n`;
        notes += `- URL: ${err.url}\n`;
        notes += `- Viewport: ${err.viewport}\n`;
        notes += `- Error: ${err.error}\n\n`;
      });
    }

    notes += `## Pages Scraped\n\n`;
    this.scrapedPages.forEach(page => {
      notes += `### ${page.name}\n`;
      notes += `- URL: ${page.url}\n`;
      notes += `- Typography elements: ${page.stats.typographyElements}\n`;
      notes += `- Background colors: ${page.stats.backgroundColors}\n`;
      notes += `- Text colors: ${page.stats.textColors}\n`;
      notes += `- Sections: ${page.stats.sections}\n`;
      notes += `- Images: ${page.stats.images}\n\n`;
    });

    await fs.writeFile(
      path.join(CONFIG.baseDir, 'metadata', 'extraction-notes.md'),
      notes
    );

    // Generate headlines file
    await this.generateHeadlinesFile();

    console.log('✓ All results saved');
  }

  async generateSummary() {
    let summary = `# Apple Design System Research - Data Collection Summary\n\n`;
    summary += `*Generated: ${new Date().toISOString()}*\n\n`;
    summary += `---\n\n`;

    summary += `## Collection Statistics\n\n`;
    summary += `| Metric | Value |\n`;
    summary += `|--------|-------|\n`;
    summary += `| Pages scraped | ${this.scrapedPages.length} |\n`;
    summary += `| Errors | ${this.errors.length} |\n`;
    summary += `| Typography elements | ${Object.values(this.results.typography.pages).reduce((sum, p) => sum + (p.elements?.length || 0), 0)} |\n`;
    summary += `| Unique font sizes | ${this.results.typography.aggregated.fontSizesUsed?.length || 0} |\n`;
    summary += `| Unique font families | ${this.results.typography.aggregated.fontFamilies?.length || 0} |\n`;
    summary += `| Background colors | ${this.results.colors.aggregated.backgroundColors?.length || 0} |\n`;
    summary += `| Text colors | ${this.results.colors.aggregated.textColors?.length || 0} |\n`;
    summary += `| Spacing values | ${this.results.spacing.aggregated.uniqueValues?.length || 0} |\n`;

    summary += `\n## Typography Scale\n\n`;
    summary += `### Font Sizes Used\n`;
    summary += `\`\`\`\n${this.results.typography.aggregated.fontSizesUsed?.join(', ') || 'N/A'}\n\`\`\`\n\n`;

    summary += `### Font Weights Used\n`;
    summary += `\`\`\`\n${this.results.typography.aggregated.fontWeightsUsed?.join(', ') || 'N/A'}\n\`\`\`\n\n`;

    summary += `### Font Families\n`;
    summary += `\`\`\`\n${this.results.typography.aggregated.fontFamilies?.join('\n') || 'N/A'}\n\`\`\`\n\n`;

    summary += `## Color Palette\n\n`;
    summary += `### Top Background Colors\n`;
    this.results.colors.aggregated.backgroundColors?.slice(0, 10).forEach(c => {
      summary += `- \`${c.color}\` (${c.count} pages)\n`;
    });

    summary += `\n### Top Text Colors\n`;
    this.results.colors.aggregated.textColors?.slice(0, 10).forEach(c => {
      summary += `- \`${c.color}\` (${c.count} pages)\n`;
    });

    summary += `\n## Container Max-Widths\n\n`;
    summary += `\`\`\`\n${this.results.layouts.aggregated.containerMaxWidths?.join(', ') || 'N/A'}\n\`\`\`\n\n`;

    summary += `## Files Generated\n\n`;
    summary += `- \`/raw-html/*.html\` - Raw HTML for each page\n`;
    summary += `- \`/extracted/typography.json\` - All typography data\n`;
    summary += `- \`/extracted/colors.json\` - All color data\n`;
    summary += `- \`/extracted/spacing.json\` - All spacing patterns\n`;
    summary += `- \`/extracted/layouts.json\` - Grid/layout structures\n`;
    summary += `- \`/extracted/sections.json\` - Section structures\n`;
    summary += `- \`/extracted/media.json\` - Image/media metadata\n`;
    summary += `- \`/copy/*-copy.md\` - Copy from each page\n`;
    summary += `- \`/copy/all-headlines.md\` - Aggregated headlines\n`;
    summary += `- \`/metadata/pages-scraped.json\` - Scraping log\n`;
    summary += `- \`/metadata/extraction-notes.md\` - Detailed notes\n`;

    summary += `\n---\n\n`;
    summary += `*Ready for qualitative analysis phase.*\n`;

    await fs.writeFile(
      path.join(CONFIG.baseDir, 'summary.md'),
      summary
    );
    console.log('✓ Generated summary.md');
  }

  async run(priorityLevels = [1]) {
    try {
      await this.init();

      for (const priority of priorityLevels) {
        const pages = PAGES[priority];
        if (!pages) continue;

        console.log(`\n${'='.repeat(50)}`);
        console.log(`📦 Priority ${priority}: ${pages.length} pages`);
        console.log(`${'='.repeat(50)}`);

        for (const pageInfo of pages) {
          // Scrape desktop viewport only for now (can extend to multi-viewport)
          await this.scrapePage(pageInfo, CONFIG.viewports[0]);

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, CONFIG.requestDelay));
        }
      }

      await this.aggregate();
      await this.saveResults();
      await this.generateSummary();

      console.log(`\n${'='.repeat(50)}`);
      console.log(`✅ SCRAPING COMPLETE`);
      console.log(`${'='.repeat(50)}`);
      console.log(`Pages scraped: ${this.scrapedPages.length}`);
      console.log(`Errors: ${this.errors.length}`);
      console.log(`Output directory: ${CONFIG.baseDir}`);

    } catch (error) {
      console.error('Fatal error:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
let priorities = [1]; // Default to priority 1

if (args.includes('--priority')) {
  const priorityArg = args[args.indexOf('--priority') + 1];
  if (priorityArg === 'all') {
    priorities = [1, 2, 3, 4, 5, 6, 7];
  } else {
    priorities = priorityArg.split(',').map(Number).filter(n => n >= 1 && n <= 7);
  }
}

console.log('🍎 Apple Design System Data Extraction Tool');
console.log(`   Priorities to scrape: ${priorities.join(', ')}`);
console.log(`   Output: ${CONFIG.baseDir}`);
console.log('');

const scraper = new AppleDesignScraper();
scraper.run(priorities).catch(console.error);
