const lightCodeTheme = {
  plain: { color: "#161616", backgroundColor: "#f4f4f4" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6f6f6f", fontStyle: "italic" } },
    { types: ["keyword", "selector", "deleted"], style: { color: "#0043ce" } },
    { types: ["string", "char", "attr-value", "inserted"], style: { color: "#0e6027" } },
    { types: ["number", "constant", "symbol", "bold"], style: { color: "#9f1853" } },
    { types: ["function", "class-name", "function-variable"], style: { color: "#0043ce" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#a21904" } },
    { types: ["title", "attr-name", "property", "tag"], style: { color: "#8a3800" } },
    { types: ["punctuation"], style: { color: "#525252" } },
  ],
};

const darkCodeTheme = {
  plain: { color: "#f4f4f4", backgroundColor: "#262626" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#8d8d8d", fontStyle: "italic" } },
    { types: ["keyword", "selector", "deleted"], style: { color: "#78a9ff" } },
    { types: ["string", "char", "attr-value", "inserted"], style: { color: "#a7f0ba" } },
    { types: ["number", "constant", "symbol", "bold"], style: { color: "#ff7eb6" } },
    { types: ["function", "class-name", "function-variable"], style: { color: "#78a9ff" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#ffb3a6" } },
    { types: ["title", "attr-name", "property", "tag"], style: { color: "#f8c665" } },
    { types: ["punctuation"], style: { color: "#c6c6c6" } },
  ],
};

const PLEX =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400" +
  "&family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400" +
  "&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

module.exports = {
  title: "AskAILab Docs",
  tagline: "Field notes on AI agents, retrieval and data infrastructure — measured, not claimed.",
  url: "https://askailab.com",
  baseUrl: "/",
  favicon: "/img/favicon.svg",
  organizationName: "fakabbir",
  projectName: "mintlify-docs",
  onBrokenLinks: "warn",
  onBrokenAnchors: "warn",
  markdown: {
    mermaid: true,
    format: "detect",
  },
  themes: ["@docusaurus/theme-mermaid"],
  stylesheets: [{ href: PLEX, type: "text/css" }],
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/fakabbir/mintlify-docs/tree/main/",
        },
        blog: false,
        theme: { customCss: require.resolve("./src/css/carbon.css") },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        src: "/img/logo.svg",
        srcDark: "/img/logo-dark.svg",
        alt: "AskAILab",
        width: 132,
        height: 32,
      },
      items: [
        { href: "https://askailab.com", label: "AskAILab", position: "right" },
        { href: "https://askailab.com/#contact", label: "Contact", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            { label: "Trip @ Scale", to: "/user-stats" },
            { label: "Senior SDE", to: "/hybrid-logical-clocks" },
            { label: "Forward Deployment", to: "/complete-rag-tutorial" },
            { label: "Interview Experience", to: "/interivew-data" },
          ],
        },
        {
          title: "AskAILab",
          items: [
            { label: "Home", href: "https://askailab.com" },
            { label: "Contact", href: "https://askailab.com/#contact" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} AskAILab — trustworthy AI agents, measured.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["bash", "lua", "sql", "python"],
    },
    docs: { sidebar: { hideable: true, autoCollapseCategories: false } },
    mermaid: {
      theme: { light: "base", dark: "dark" },
      options: {
        fontFamily: '"IBM Plex Sans", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
        flowchart: { curve: "linear", nodeSpacing: 44, rankSpacing: 58, padding: 14 },
      },
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
  },
};
