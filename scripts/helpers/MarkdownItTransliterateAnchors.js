const Translit = require("cyrillic-to-translit-js")({
  preset: "ru",
  useApostrophe: false
});

const getLinksAndHeadings = tokens => {
  const link_opens = [];
  const heading_opens = [];

  function processToken(token) {
    if (token.type === "link_open") {
      link_opens.push(token);
    }

    if (token.type === "heading_open") {
      heading_opens.push(token);
    }

    if (token.children) {
      token.children.forEach(processToken);
    }
  }

  tokens.forEach(processToken);

  return [link_opens, heading_opens];
};

const processLinksAndGetMap = tokens => {
  const map = {};

  tokens.forEach(token => {
    const href = token.attrGet("href");
    if (href.charAt(0) === "#") {
      const decodedHref = decodeURI(href);
      const translit = Translit.transform(decodedHref);
      token.attrSet("href", translit);
      map[decodedHref.slice(1)] = translit.slice(1);
    }
  });

  return map;
};

const processHeadingsUsingMap = (tokens, map) => {
  tokens.forEach(token => {
    const id = token.attrGet("id");
    if (map[id]) {
      token.attrSet("id", map[id]);
    }
  });
};

const MarkdownItTransliterateAnchors = md => {
  md.core.ruler.push("transliterate-anchors", state => {
    const tokens = state.tokens;

    const [link_opens, heading_opens] = getLinksAndHeadings(tokens);

    const map = processLinksAndGetMap(link_opens);
    processHeadingsUsingMap(heading_opens, map);
  });
};

module.exports = MarkdownItTransliterateAnchors;
