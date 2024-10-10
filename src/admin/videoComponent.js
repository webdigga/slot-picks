CMS.registerEditorComponent({
  id: "youtube",
  label: "YouTube",
  fields: [
    {
      name: "url",
      label: "YouTube Video URL",
      widget: "string"
    },
    {
      name: "caption",
      label: "Caption",
      widget: "string",
      default: ""
    },
    {
      name: "float",
      label: "Float",
      widget: "select",
      options: [
        { value: "", label: "None" },
        { value: "Left", label: "Left" },
        { value: "Right", label: "Right" }
      ],
      default: ""
    }
  ],
  pattern: /^<div class="youtube-embed (.*?)">[\s\S]*<\/div>$/,
  fromBlock: function(match) {
    const urlMatch = match[0].match(/src="(.*?)"/);
    const captionMatch = match[0].match(/<h5 class="text-lg mb-4 font-bold">(.*?)<\/h5>/);
    const floatMatch = match[0].match(/youtube-embed (Left|Right)/); // Capture float class

    return {
      url: urlMatch ? urlMatch[1] : '',
      caption: captionMatch ? captionMatch[1] : '',
      float: floatMatch ? floatMatch[1] : '' // Capture float value
    };
  },
  toBlock: function(obj) {
    const videoUrl = obj.url.replace("watch?v=", "embed/").split("&")[0]; // Clean up the URL
    const captionHtml = obj.caption ? `<h5 class="text-lg mb-4 font-bold">${obj.caption}</h5>` : '';
    const floatClass = obj.float ? obj.float : ''; // Set float class

    return `
<div class="youtube-embed ${floatClass}">
  ${captionHtml}
  <iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
</div>`;
  },
  toPreview: function(obj) {
    const videoUrl = obj.url.replace("watch?v=", "embed/").split("&")[0]; // Clean up the URL
    const captionMarkdown = obj.caption ? `### ${obj.caption}\n\n` : '';

    return `
${captionMarkdown}
<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
    `;
  }
});
