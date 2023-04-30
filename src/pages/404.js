import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

const ErrorPage = ({ data }) => {
  return (
    <Layout className="mb-5" back={true} title="Riepilogo ordine"></Layout>
  );
};

export default ErrorPage;
