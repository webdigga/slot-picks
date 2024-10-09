const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");

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

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Markdown rendering options
  const md = new markdownIt({
    html: true,
  });

  // Add the new markdown filter (use when components render markdown)
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./src/admin/imageComponent.js": "./admin/imageComponent.js",
    "./src/admin/buttonComponent.js": "./admin/buttonComponent.js",
    "./src/site.manifest": "./site.manifest"
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/_includes/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("./src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("./src/android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("./src/android-chrome-512x512.png");
  

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

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
