module.exports = {
    siteMetadata: {
      siteUrl: `https://www.yourdomain.tld`,
    },
    plugins: [
        `gatsby-plugin-image`,
        `gatsby-plugin-sass`,
        {
          resolve: `gatsby-source-sqlite`,
          options: {
            fileName: './database.db',
            queries: [
              {
                statement: 'SELECT * FROM articoli',
                idFieldName: 'id',
                name: 'items',
                parentName: 'categories',
                foreignKey: 'id_tipologia',
                cardinality: 'OneToMany'
              },
              {
                statement: 'SELECT * FROM tipologie',
                idFieldName: 'id',
                name: 'categories'
              },
            ]
          }
        }
    ],
  }