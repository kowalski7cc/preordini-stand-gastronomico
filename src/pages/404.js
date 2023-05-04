import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";

const ErrorPage = () => {
  return (
    <Layout className="mb-5" back={false} title="Pagina inesistente">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-1">404</h1>
        <h2 className="display-6">Pagina inesistente</h2>
      </div>
    </Layout>
  );
};

export default ErrorPage;
export const Head = () => <Seo title="Pagina inesistente" />;
