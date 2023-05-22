// get version from package.json
const { version } = require("./package.json");

const productionDatabasePath = process.env.DATABASE_PATH || "database.db";
const fs = require("fs");
const databasePath = fs.existsSync(productionDatabasePath)
  ? productionDatabasePath
  : "sample.db";

module.exports = {
  siteMetadata: {
    title: "Sagra",
    siteUrl: `https://preordinifeste.it/`,
    description: `Preordine sagra`,
    author: "kowalski7cc",
    lang: "it",
    version: version || "0.0.0",
    features: {
      coperti_enabled: true,
      use_encode_uri: true,
    },
  },
  flags: {
    FAST_DEV: true,
    DEV_SSR: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    DETECT_NODE_MUTATIONS: false,
    PARALLEL_SOURCING: true,
    PARTIAL_HYDRATION: false,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Preordine festa`,
        short_name: `Preordine festa`,
        start_url: `/`,
        description: `Portale per i preordini alle feste di paese`,
        lang: `it`,
        background_color: `#ffffff`,
        theme_color: `#870000`,
        display: `standalone`,
        icon: `src/assets/icon.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://preordinifeste.it/`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/sw.js": ["Cache-Control: no-cache"],
          "/*": [
            "Permissions-Policy: autoplay=(),camera=(),fullscreen=(self),geolocation=(),microphone=(),payment=()",
            "Strict-Transport-Security: max-age=63072000; preload",
            "X-Frame-Options: DENY",
            "X-Content-Type-Options: nosniff",
            "Referrer-Policy: no-referrer",
          ],
        },
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-sqlite`,
      options: {
        fileName: databasePath,
        queries: [
          {
            statement: "SELECT * FROM articoli",
            idFieldName: "id",
            name: "items",
            parentName: "categories",
            foreignKey: "id_tipologia",
            cardinality: "OneToMany",
          },
          {
            statement: "SELECT * FROM tipologie",
            idFieldName: "id",
            name: "categories",
          },
        ],
      },
    },
  ],
};
