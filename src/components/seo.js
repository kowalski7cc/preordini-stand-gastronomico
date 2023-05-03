import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

function Seo({ description, title, children }) {
  const [theme, setTheme] = React.useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  if (typeof window !== "undefined") {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        setTheme(newColorScheme);
      });
  }

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
  const defaultTitle = site.siteMetadata?.title;

  return (
    <>
      <html data-bs-theme={theme} lang={site.siteMetadata?.lang} />
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
      {children}
    </>
  );
}

export default Seo;
