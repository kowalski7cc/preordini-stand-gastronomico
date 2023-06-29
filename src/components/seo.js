import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

function Seo({ description, title, children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            lang
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const defaultTitle = site.siteMetadata?.titles;

  return (
    <>
      <html lang={site.siteMetadata?.lang} />
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="application-name" content={defaultTitle} />
      <meta name="author" content={site.siteMetadata?.author} />
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      {/* <meta
        name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no"
      /> */}
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      {children}
    </>
  );
}

export default Seo;
