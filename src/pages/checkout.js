import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

const CheckoutPage = ({ data }) => {
  return (
    <Layout className="mb-5" title="Preordine">
      Test
    </Layout>
  );
};

export const query = graphql`
  query Orders {
    categorie: allSqliteCategories(filter: { visibile: { eq: 1 } }) {
      nodes {
        sqliteId
        descrizione
        items {
          sqliteId
          prezzo
          descrizione
        }
      }
    }
  }
`;

export default CheckoutPage;
export const Head = () => <title>Resoconto</title>;
