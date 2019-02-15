const fs = require("fs");
const MarkdownIt = require("markdown-it");
const MarkdownItAnchor = require("markdown-it-anchor");
const MarkdownItUnderline = require("markdown-it-underline");
const uslug = require("uslug");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(MarkdownItAnchor, {
  slugify: uslug
}).use(MarkdownItUnderline);

const mdContents = fs.readFileSync("source.md", "utf8");
const mdHTML = md.render(mdContents);

const template = fs.readFileSync("template.html", "utf8");
var finalHTML = template.replace(/{MD-RESULT}/g, mdHTML);

fs.writeFileSync("index.html", finalHTML, { flag: "w" });

console.log("Success!")
