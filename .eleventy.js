const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier-terser");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const path = require("path");
const fs = require("fs");
const tailwind = require('tailwindcss');
const postCss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

require('dotenv').config();

const postcssFilter = (cssCode, done) => {
  // we call PostCSS here.
  postCss([tailwind(require('./tailwind.config')), autoprefixer(), cssnano({ preset: 'default' })])
    .process(cssCode, {
    // path to our CSS file
    from: './src/_includes/static/css/tailwind.css'
  })
  .then(
    (r) => done(null, r.css),
    (e) => done(e, null)
  );
};

module.exports = function (eleventyConfig) {
  // Via addWatchTarget we tell Eleventy that changes to this file should trigger a rebuild
  // if we are currently running the application locally with --serve.
  // The asynchronous filter ensures that we can convert our CSS
  eleventyConfig.addWatchTarget('./src/_includes/static/css/tailwind.css');
  eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Make a ISO 8601 date here for the schema data
  eleventyConfig.addFilter("iso8601", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO(
      "yyyy-MM-dd"
    );
  }); 

  // Current month and year at build time (e.g. "February 2026")
  eleventyConfig.addShortcode("buildDate", () => {
    return DateTime.now().toFormat("LLLL yyyy");
  });

  eleventyConfig.addShortcode("currentYear", () => {
    return DateTime.now().toFormat("yyyy");
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Markdown rendering options with anchor IDs for headings
  const md = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: false,
    slugify: (s) => s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
  });

  // External links: open in new tab with icon
  let isExternalLink = false;
  const defaultLinkOpen = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex('href');
    isExternalLink = false;
    if (hrefIndex >= 0) {
      const href = tokens[idx].attrs[hrefIndex][1];
      if (href.startsWith('http://') || href.startsWith('https://')) {
        tokens[idx].attrPush(['target', '_blank']);
        tokens[idx].attrPush(['rel', 'noopener noreferrer']);
        isExternalLink = true;
      }
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  const defaultLinkClose = md.renderer.rules.link_close || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_close = function(tokens, idx, options, env, self) {
    if (isExternalLink) {
      isExternalLink = false;
      return '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:3px;margin-right:3px" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>';
    }
    return defaultLinkClose(tokens, idx, options, env, self);
  };

  // Set as the markdown library for Eleventy
  eleventyConfig.setLibrary("md", md);

  // Add a filter to convert markdown string to HTML
  eleventyConfig.addFilter("markdownify", (markdownString) => {
    return md.render(markdownString);
  });

  // Reading time filter (~230 words per minute)
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const text = content.replace(/<[^>]+>/g, '').replace(/[#*\[\]()_|`>-]/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 230));
    return `${minutes} min read`;
  });

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./src/admin/imageComponent.js": "./admin/imageComponent.js",
    "./src/admin/buttonComponent.js": "./admin/buttonComponent.js",
    "./src/admin/videoComponent.js": "./admin/videoComponent.js",
    "./src/site.webmanifest": "./site.webmanifest"
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/_includes/static/img");

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/favicon-96x96.png");
  eleventyConfig.addPassthroughCopy("./src/favicon.svg");
  eleventyConfig.addPassthroughCopy("./src/web-app-manifest-192x192.png");
  eleventyConfig.addPassthroughCopy("./src/web-app-manifest-512x512.png");
  

  // // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  const { minify } = require("terser");
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      // Fail gracefully.
      callback(null, code);
    }
  });

  // Add custom collections for new content types
  eleventyConfig.addCollection("games", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/guides/slots/*.md").filter(item => {
      return item.inputPath !== "./src/guides/slots/index.md";
    });
  });

  eleventyConfig.addCollection("strategy", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/strategy/*.md").filter(item => {
      return item.inputPath !== "./src/strategy/index.md";
    });
  });

  eleventyConfig.addCollection("compare", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/compare/*.md").filter(item => {
      return item.inputPath !== "./src/compare/index.md";
    });
  });

  eleventyConfig.addCollection("casinoGuides", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/guides/casinos/*.md");
  });

  eleventyConfig.addCollection("drawGuides", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/guides/draws/*.md");
  });

  eleventyConfig.addCollection("allSites", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/sites/*.md");
  });

  eleventyConfig.addCollection("searchIndex", function(collectionApi) {
    var items = [];

    // Sites (slots, casinos, draws)
    collectionApi.getFilteredByGlob("src/sites/*.md").forEach(function(item) {
      items.push({
        title: item.data.title,
        type: (item.data.tags || []).some(function(t) { return t.indexOf('draw') !== -1 || t.indexOf('Draw') !== -1; }) ? 'draw' : 'site',
        url: item.url,
        score: item.data.score || null,
        description: item.data.welcomeOffer || item.data.jackpot || '',
        brand: item.data.brand || null
      });
    });

    // Slot guides
    collectionApi.getFilteredByGlob("src/guides/slots/*.md").forEach(function(item) {
      if (item.inputPath.indexOf('index.md') !== -1) return;
      items.push({
        title: item.data.title,
        type: 'guide',
        url: item.url,
        score: null,
        description: item.data.description || '',
        brand: null
      });
    });

    // Casino guides
    collectionApi.getFilteredByGlob("src/guides/casinos/*.md").forEach(function(item) {
      items.push({
        title: item.data.title,
        type: 'guide',
        url: item.url,
        score: null,
        description: item.data.description || '',
        brand: null
      });
    });

    // Draw guides
    collectionApi.getFilteredByGlob("src/guides/draws/*.md").forEach(function(item) {
      items.push({
        title: item.data.title,
        type: 'guide',
        url: item.url,
        score: null,
        description: item.data.description || '',
        brand: null
      });
    });

    // Strategy articles
    collectionApi.getFilteredByGlob("src/strategy/*.md").forEach(function(item) {
      if (item.inputPath.indexOf('index.md') !== -1) return;
      items.push({
        title: item.data.title,
        type: 'strategy',
        url: item.url,
        score: null,
        description: item.data.description || '',
        brand: null
      });
    });

    // Compare articles
    collectionApi.getFilteredByGlob("src/compare/*.md").forEach(function(item) {
      if (item.inputPath.indexOf('index.md') !== -1) return;
      items.push({
        title: item.data.title,
        type: 'compare',
        url: item.url,
        score: null,
        description: item.data.description || '',
        brand: null
      });
    });

    return items;
  });

  // Add the tag data as a global data object
  eleventyConfig.addGlobalData("tagData", function() {
    const tagData = {};
    const dataDir = path.join(__dirname, 'src/_data');
    
    try {
      // Read all YAML files in the data directory
      fs.readdirSync(dataDir).forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const tagName = path.basename(file, path.extname(file));
          try {
            const fileContents = fs.readFileSync(path.join(dataDir, file), 'utf8');
            const data = yaml.load(fileContents);
            tagData[tagName] = data;
          } catch (e) {
            console.error(`Error loading YAML file ${file}:`, e);
          }
        }
      });
    } catch (e) {
      console.error('Error reading data directory:', e);
    }

    return tagData;
  });

  eleventyConfig.addFilter("toString", function (value) {
    if (typeof value === "string") {
      return value; // It's already a string
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value); // Convert objects to string
    }
    return String(value || ""); // Convert anything else safely
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
