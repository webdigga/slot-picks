CMS.registerEditorComponent({
  // Internal id of the component
  id: "button",
  // Visible label
  label: "Button",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    {
      name: 'destination',
      label: 'Destination',
      widget: 'string'
    },
    {
      name: 'buttonText',
      label: 'Button Text',
      widget: 'string'
    },
    {
      label: 'Button Type',
      name: 'buttonType',
      widget: 'select',
      options: [
        {
          label: "Primary",
          value: "no-underline bg-[color:var(--dark-purple)] text-white mb-4 rounded-md cursor-pointer inline-block py-4 px-6 hover:opacity-80"
        },
        {
          label: "Secondary",
          value: "no-underline bg-[color:var(--light-green)] text-white mb-4 rounded-md cursor-pointer inline-block py-4 px-6 hover:opacity-80"
        }
      ]
    },
  ],
  // Regex pattern used to search for instances of this block in the markdown document.
  // Patterns are run in a multiline environment (against the entire markdown document),
  // and so generally should make use of the multiline flag (`m`). If you need to capture
  // newlines in your capturing groups, you can either use something like
  // `([\S\s]*)`, or you can additionally enable the "dot all" flag (`s`),
  // which will cause `(.*)` to match newlines as well.
  //
  // Additionally, it's recommended that you use non-greedy capturing groups (e.g.
  // `(.*?)` vs `(.*)`), especially if matching against newline characters.

  // Example with multiline - pattern: /^<a>$\s*?<summary>(.*?)<\/summary>\n\n(.*?)\n^<\/a>$/ms,
  pattern: /^<a href="(.*?)" class="(.*?)">(.*?)<\/a>$/s,
  // Given a RegExp Match object
  // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match#return_value),
  // return an object with one property for each field defined in `fields`.
  //
  // This is used to populate the custom widget in the markdown editor in the CMS.
  fromBlock: function(match) {
    return {
      destination: match[1],
      buttonText: match[3],
      buttonType: match[2]
    };
  },
  // Given an object with one property for each field defined in `fields`,
  // return the string you wish to be inserted into your markdown.
  //
  // This is used to serialize the data from the custom widget to the
  // markdown document
  toBlock: function(data) {
    return `<a href="${ data.destination }" class="${ data.buttonType }">${data.buttonText}</a>`;
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(data) {
    return `<a href="${ data.destination }" class="${ data.buttonType }">${data.buttonText}</a>`;
  }
});