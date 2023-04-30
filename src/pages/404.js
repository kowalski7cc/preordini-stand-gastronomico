import * as React from "react";
import Layout from "../components/layout";

const ErrorPage = ({ data }) => {
  return (
    <Layout className="mb-5" back={false} title="Pagina non trovata"></Layout>
  );
};

export default ErrorPage;
