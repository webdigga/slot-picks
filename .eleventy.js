const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
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
    from: './src/static/css/tailwind.css'
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
  eleventyConfig.addWatchTarget('./src/_includes/styles/tailwind.css');
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

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Markdown rendering options
  const md = new markdownIt({
    html: true,
  });

  // Add a filter to convert markdown string to HTML
  eleventyConfig.addFilter("markdownify", (markdownString) => {
    return md.render(markdownString);
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

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/favicon-96x96.png");
  eleventyConfig.addPassthroughCopy("./src/favicon.svg");
  eleventyConfig.addPassthroughCopy("./src/web-app-manifest-192x192.png");
  eleventyConfig.addPassthroughCopy("./src/web-app-manifest-512x512.png");
  

  // // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
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
