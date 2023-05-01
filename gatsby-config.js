module.exports = {
  siteMetadata: {
    title: "Sagra",
    siteUrl: `https://preordini-sagra.netlify.app`,
    description: `Preordine sagra`,
    author: "kowalski7cc",
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Preordine Sagra`,
        short_name: `Preordine Sagra`,
        start_url: `/`,
        description: `Preordine sagra`,
        lang: `it`,
        background_color: `#ffffff`,
        theme_color: `#f8f9fa`,
        display: `standalone`,
        icon: `src/assets/icon.svg`,
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
        fileName: "./database.db",
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
