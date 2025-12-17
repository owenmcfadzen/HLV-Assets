/**
 * Apple Design System Data Extraction Tool - WebFetch Version
 *
 * Uses HTTP fetch to get raw HTML and parses with cheerio
 * This version extracts data from raw HTML without computed styles
 */

import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const CONFIG = {
  baseDir: path.resolve(import.meta.dirname, '..')
};

// Pages organized by priority
const PAGES = {
  1: [
    { name: 'homepage', url: 'https://www.apple.com/' },
    { name: 'iphone', url: 'https://www.apple.com/iphone/' },
    { name: 'iphone-16-pro', url: 'https://www.apple.com/iphone-16-pro/' },
    { name: 'mac', url: 'https://www.apple.com/mac/' },
    { name: 'macbook-pro', url: 'https://www.apple.com/macbook-pro/' },
    { name: 'macbook-air', url: 'https://www.apple.com/macbook-air/' }
  ],
  2: [
    { name: 'ipad', url: 'https://www.apple.com/ipad/' },
    { name: 'apple-watch-series-10', url: 'https://www.apple.com/apple-watch-series-10/' },
    { name: 'airpods-pro', url: 'https://www.apple.com/airpods-pro/' },
    { name: 'apple-vision-pro', url: 'https://www.apple.com/apple-vision-pro/' },
    { name: 'imac', url: 'https://www.apple.com/imac/' },
    { name: 'mac-mini', url: 'https://www.apple.com/mac-mini/' }
  ],
  3: [
    { name: 'ios-18', url: 'https://www.apple.com/ios/ios-18/' },
    { name: 'macos-sequoia', url: 'https://www.apple.com/macos/macos-sequoia/' }
  ],
  4: [
    { name: 'apple-music', url: 'https://www.apple.com/apple-music/' },
    { name: 'icloud', url: 'https://www.apple.com/icloud/' }
  ],
  5: [
    { name: 'accessibility', url: 'https://www.apple.com/accessibility/' },
    { name: 'privacy', url: 'https://www.apple.com/privacy/' }
  ]
};

/**
 * Parse HTML and extract design data
 */
function extractDataFromHTML(html, url, pageName) {
  const $ = cheerio.load(html);

  const data = {
    url,
    pageName,
    scraped_at: new Date().toISOString(),
    typography: [],
    colors: { inline: [], classes: [] },
    spacing: { classes: [] },
    sections: [],
    copy: { headlines: [], subheadlines: [], body: [], ctas: [], navigation: [], footer: [] },
    media: { images: [], videos: [] },
    cssClasses: new Set()
  };

  // Extract typography elements
  $('h1, h2, h3, h4, h5, h6, p, span, a, li, label, button, figcaption').each((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (!text || text.length > 500) return;

    const classes = $el.attr('class') || '';
    const style = $el.attr('style') || '';
    const id = $el.attr('id') || '';

    // Find parent section
    const $section = $el.closest('section, [class*="section"], [class*="module"], [class*="hero"]');
    const sectionClass = $section.attr('class') || '';

    data.typography.push({
      tag: el.tagName.toLowerCase(),
      text: text.substring(0, 300),
      className: classes,
      id,
      inlineStyle: style,
      sectionContext: sectionClass.split(' ')[0] || ''
    });

    // Collect CSS classes
    classes.split(' ').forEach(c => {
      if (c.trim()) data.cssClasses.add(c.trim());
    });
  });

  // Extract inline color values
  $('[style*="color"], [style*="background"]').each((i, el) => {
    const style = $(el).attr('style') || '';
    data.colors.inline.push({
      tag: el.tagName.toLowerCase(),
      style: style.substring(0, 200)
    });
  });

  // Extract color-related classes
  $('[class*="color"], [class*="bg-"], [class*="text-"]').each((i, el) => {
    const classes = $(el).attr('class') || '';
    data.colors.classes.push({
      tag: el.tagName.toLowerCase(),
      classes
    });
  });

  // Extract sections
  $('section, [class*="section"], [class*="module"], [class*="hero"], [class*="gallery"]').each((i, el) => {
    const $section = $(el);
    const className = $section.attr('class') || '';
    const id = $section.attr('id') || '';

    // Get headlines in section
    const headlines = [];
    $section.find('h1, h2, h3, [class*="headline"], [class*="title"]').each((j, h) => {
      const text = $(h).text().trim();
      if (text && text.length < 200) {
        headlines.push({
          tag: h.tagName.toLowerCase(),
          text
        });
      }
    });

    data.sections.push({
      index: i,
      tag: el.tagName.toLowerCase(),
      className,
      id,
      headlines: headlines.slice(0, 5)
    });
  });

  // Extract copy - Headlines
  $('h1, h2, h3, [class*="headline"], [class*="title"]').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 300) {
      data.copy.headlines.push({
        tag: el.tagName.toLowerCase(),
        className: $(el).attr('class') || '',
        text
      });
    }
  });

  // Extract copy - Subheadlines
  $('[class*="subhead"], [class*="tagline"], [class*="eyebrow"], h4, h5, h6').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 300) {
      data.copy.subheadlines.push({
        tag: el.tagName.toLowerCase(),
        className: $(el).attr('class') || '',
        text
      });
    }
  });

  // Extract copy - Body text
  $('p, [class*="copy"], [class*="description"], [class*="body"]').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20 && text.length < 1000) {
      data.copy.body.push({
        tag: el.tagName.toLowerCase(),
        className: $(el).attr('class') || '',
        text
      });
    }
  });

  // Extract copy - CTAs
  $('a[class*="cta"], a[class*="button"], button, [class*="cta"], [role="button"]').each((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (text && text.length < 100) {
      data.copy.ctas.push({
        tag: el.tagName.toLowerCase(),
        className: $el.attr('class') || '',
        text,
        href: $el.attr('href') || ''
      });
    }
  });

  // Extract navigation
  $('nav a, [class*="nav"] a, header a').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 50) {
      data.copy.navigation.push({
        text,
        href: $(el).attr('href') || ''
      });
    }
  });

  // Extract footer
  $('footer a, footer p, [class*="footer"] a').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 2 && text.length < 100) {
      data.copy.footer.push({
        tag: el.tagName.toLowerCase(),
        text
      });
    }
  });

  // Extract images
  $('img').each((i, el) => {
    const $el = $(el);
    data.media.images.push({
      src: ($el.attr('src') || '').substring(0, 200),
      srcset: ($el.attr('srcset') || '').substring(0, 300),
      alt: $el.attr('alt') || '',
      className: $el.attr('class') || '',
      width: $el.attr('width') || '',
      height: $el.attr('height') || '',
      loading: $el.attr('loading') || ''
    });
  });

  // Extract videos
  $('video').each((i, el) => {
    const $el = $(el);
    data.media.videos.push({
      src: ($el.attr('src') || '').substring(0, 200),
      poster: ($el.attr('poster') || '').substring(0, 200),
      className: $el.attr('class') || '',
      autoplay: $el.attr('autoplay') !== undefined,
      loop: $el.attr('loop') !== undefined,
      muted: $el.attr('muted') !== undefined
    });
  });

  // Convert Set to Array
  data.cssClasses = [...data.cssClasses];

  return data;
}

/**
 * Generate markdown copy file
 */
function generateCopyMarkdown(data) {
  let md = `# ${data.pageName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Copy\n\n`;
  md += `*URL: ${data.url}*\n`;
  md += `*Extracted: ${data.scraped_at}*\n\n---\n\n`;

  // Navigation
  if (data.copy.navigation.length > 0) {
    md += `## Navigation\n\n`;
    const uniqueNav = [...new Set(data.copy.navigation.map(n => n.text))];
    uniqueNav.slice(0, 20).forEach(text => {
      md += `- ${text}\n`;
    });
    md += `\n`;
  }

  // Headlines
  if (data.copy.headlines.length > 0) {
    md += `## Headlines\n\n`;
    data.copy.headlines.forEach(h => {
      md += `**${h.tag.toUpperCase()}:** ${h.text}\n\n`;
    });
  }

  // Subheadlines
  if (data.copy.subheadlines.length > 0) {
    md += `## Subheadlines & Taglines\n\n`;
    data.copy.subheadlines.forEach(s => {
      md += `*${s.text}*\n\n`;
    });
  }

  // Body copy
  if (data.copy.body.length > 0) {
    md += `## Body Copy\n\n`;
    data.copy.body.forEach(b => {
      md += `${b.text}\n\n---\n\n`;
    });
  }

  // CTAs
  if (data.copy.ctas.length > 0) {
    md += `## CTAs & Buttons\n\n`;
    const uniqueCtas = [...new Set(data.copy.ctas.map(c => c.text))];
    uniqueCtas.forEach(text => {
      md += `- **${text}**\n`;
    });
    md += `\n`;
  }

  // Footer
  if (data.copy.footer.length > 0) {
    md += `## Footer\n\n`;
    const uniqueFooter = [...new Set(data.copy.footer.map(f => f.text))];
    uniqueFooter.slice(0, 30).forEach(text => {
      md += `- ${text}\n`;
    });
  }

  return md;
}

/**
 * Save all results
 */
async function saveResults(allData) {
  // Aggregate data
  const typography = { pages: {} };
  const colors = { pages: {} };
  const sections = { pages: {} };
  const media = { pages: {} };
  const allCssClasses = new Set();
  const allHeadlines = [];

  for (const data of allData) {
    const key = data.pageName;

    typography.pages[key] = {
      url: data.url,
      scraped_at: data.scraped_at,
      elements: data.typography
    };

    colors.pages[key] = {
      url: data.url,
      scraped_at: data.scraped_at,
      inline: data.colors.inline,
      classes: data.colors.classes
    };

    sections.pages[key] = {
      url: data.url,
      scraped_at: data.scraped_at,
      sections: data.sections
    };

    media.pages[key] = {
      url: data.url,
      scraped_at: data.scraped_at,
      images: data.media.images,
      videos: data.media.videos
    };

    data.cssClasses.forEach(c => allCssClasses.add(c));

    // Collect headlines for aggregation
    data.copy.headlines.forEach(h => {
      allHeadlines.push({
        page: data.pageName,
        ...h
      });
    });

    // Save individual copy markdown
    const copyMd = generateCopyMarkdown(data);
    await fs.writeFile(
      path.join(CONFIG.baseDir, 'copy', `${data.pageName}-copy.md`),
      copyMd
    );
  }

  // Aggregate typography classes by pattern
  const typographyPatterns = {
    headlines: [...allCssClasses].filter(c => /headline|title|hero/i.test(c)),
    subheads: [...allCssClasses].filter(c => /subhead|tagline|eyebrow|intro/i.test(c)),
    body: [...allCssClasses].filter(c => /copy|body|description|text|paragraph/i.test(c)),
    cta: [...allCssClasses].filter(c => /cta|button|link/i.test(c)),
    layout: [...allCssClasses].filter(c => /section|module|hero|gallery|tile|grid|container|wrapper/i.test(c))
  };

  typography.aggregated = {
    totalClasses: allCssClasses.size,
    patterns: typographyPatterns
  };

  // Save JSON files
  await fs.writeFile(
    path.join(CONFIG.baseDir, 'extracted', 'typography.json'),
    JSON.stringify(typography, null, 2)
  );

  await fs.writeFile(
    path.join(CONFIG.baseDir, 'extracted', 'colors.json'),
    JSON.stringify(colors, null, 2)
  );

  await fs.writeFile(
    path.join(CONFIG.baseDir, 'extracted', 'sections.json'),
    JSON.stringify(sections, null, 2)
  );

  await fs.writeFile(
    path.join(CONFIG.baseDir, 'extracted', 'media.json'),
    JSON.stringify(media, null, 2)
  );

  await fs.writeFile(
    path.join(CONFIG.baseDir, 'extracted', 'css-classes.json'),
    JSON.stringify({
      total: allCssClasses.size,
      all: [...allCssClasses].sort(),
      patterns: typographyPatterns
    }, null, 2)
  );

  // Generate all-headlines.md
  let headlinesMd = `# All Headlines - Apple Website\n\n`;
  headlinesMd += `*Aggregated for pattern analysis*\n\n---\n\n`;

  const groupedHeadlines = {};
  allHeadlines.forEach(h => {
    if (!groupedHeadlines[h.page]) groupedHeadlines[h.page] = [];
    groupedHeadlines[h.page].push(h);
  });

  Object.entries(groupedHeadlines).forEach(([page, headlines]) => {
    headlinesMd += `## ${page}\n\n`;
    headlines.forEach(h => {
      headlinesMd += `**${h.tag}:** ${h.text}\n\n`;
    });
    headlinesMd += `---\n\n`;
  });

  await fs.writeFile(
    path.join(CONFIG.baseDir, 'copy', 'all-headlines.md'),
    headlinesMd
  );

  // Save metadata
  await fs.writeFile(
    path.join(CONFIG.baseDir, 'metadata', 'pages-scraped.json'),
    JSON.stringify({
      totalPages: allData.length,
      pages: allData.map(d => ({
        name: d.pageName,
        url: d.url,
        scraped_at: d.scraped_at,
        stats: {
          typographyElements: d.typography.length,
          headlines: d.copy.headlines.length,
          bodyParagraphs: d.copy.body.length,
          ctas: d.copy.ctas.length,
          images: d.media.images.length,
          sections: d.sections.length,
          cssClasses: d.cssClasses.length
        }
      }))
    }, null, 2)
  );

  // Generate summary
  let summary = `# Apple Design System Research - Data Collection Summary\n\n`;
  summary += `*Generated: ${new Date().toISOString()}*\n\n`;
  summary += `---\n\n`;
  summary += `## Collection Statistics\n\n`;
  summary += `| Metric | Value |\n`;
  summary += `|--------|-------|\n`;
  summary += `| Pages scraped | ${allData.length} |\n`;
  summary += `| Total typography elements | ${allData.reduce((sum, d) => sum + d.typography.length, 0)} |\n`;
  summary += `| Total headlines | ${allHeadlines.length} |\n`;
  summary += `| Total CSS classes found | ${allCssClasses.size} |\n`;
  summary += `| Total images | ${allData.reduce((sum, d) => sum + d.media.images.length, 0)} |\n`;
  summary += `| Total sections | ${allData.reduce((sum, d) => sum + d.sections.length, 0)} |\n\n`;

  summary += `## CSS Class Patterns\n\n`;
  summary += `### Typography Classes (${typographyPatterns.headlines.length} headline, ${typographyPatterns.subheads.length} subhead, ${typographyPatterns.body.length} body)\n\n`;
  summary += `**Headlines:** \`${typographyPatterns.headlines.slice(0, 20).join('`, `')}\`\n\n`;
  summary += `**Subheads:** \`${typographyPatterns.subheads.slice(0, 20).join('`, `')}\`\n\n`;
  summary += `**Body:** \`${typographyPatterns.body.slice(0, 20).join('`, `')}\`\n\n`;
  summary += `**CTAs:** \`${typographyPatterns.cta.slice(0, 20).join('`, `')}\`\n\n`;
  summary += `**Layout:** \`${typographyPatterns.layout.slice(0, 20).join('`, `')}\`\n\n`;

  summary += `## Files Generated\n\n`;
  summary += `- \`/raw-html/*.html\` - Raw HTML for each page\n`;
  summary += `- \`/extracted/typography.json\` - Typography elements and classes\n`;
  summary += `- \`/extracted/colors.json\` - Color-related styles and classes\n`;
  summary += `- \`/extracted/sections.json\` - Section structures\n`;
  summary += `- \`/extracted/media.json\` - Image/video metadata\n`;
  summary += `- \`/extracted/css-classes.json\` - All CSS classes found\n`;
  summary += `- \`/copy/*-copy.md\` - Copy from each page\n`;
  summary += `- \`/copy/all-headlines.md\` - Aggregated headlines\n\n`;
  summary += `---\n\n`;
  summary += `*Note: This extraction uses HTML parsing. For computed styles (actual rendered px values), a browser-based approach is needed.*\n`;

  await fs.writeFile(
    path.join(CONFIG.baseDir, 'summary.md'),
    summary
  );

  console.log(`\n✅ Results saved:`);
  console.log(`   - ${allData.length} pages processed`);
  console.log(`   - ${allCssClasses.size} unique CSS classes found`);
  console.log(`   - ${allHeadlines.length} headlines collected`);
}

// Main function - processes HTML files passed as arguments or reads from stdin
async function main() {
  console.log('🍎 Apple Design System Data Extraction Tool (HTML Parser)\n');

  // Check for pre-fetched HTML in raw-html directory
  const rawHtmlDir = path.join(CONFIG.baseDir, 'raw-html');

  try {
    const files = await fs.readdir(rawHtmlDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    if (htmlFiles.length === 0) {
      console.log('No HTML files found in raw-html directory.');
      console.log('Please use WebFetch to download pages first, or provide HTML files.');
      return;
    }

    console.log(`Found ${htmlFiles.length} HTML files to process\n`);

    const allData = [];

    for (const file of htmlFiles) {
      const pageName = file.replace('.html', '');
      const filePath = path.join(rawHtmlDir, file);

      console.log(`📄 Processing: ${pageName}`);

      const html = await fs.readFile(filePath, 'utf-8');
      const pageConfig = Object.values(PAGES).flat().find(p => p.name === pageName);
      const url = pageConfig?.url || `https://www.apple.com/${pageName}/`;

      const data = extractDataFromHTML(html, url, pageName);
      allData.push(data);

      console.log(`   ✓ Typography: ${data.typography.length} elements`);
      console.log(`   ✓ Headlines: ${data.copy.headlines.length}`);
      console.log(`   ✓ Sections: ${data.sections.length}`);
      console.log(`   ✓ Images: ${data.media.images.length}`);
      console.log(`   ✓ CSS Classes: ${data.cssClasses.length}`);
    }

    await saveResults(allData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
