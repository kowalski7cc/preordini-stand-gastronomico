import * as React from "react";
import { navigate } from "gatsby";
import QRCode from "react-qr-code";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";

const OrderPage = ({ location }) => {
  return (
    <Layout className="mb-5" back={true} title="Ordine">
      <h1 className="mb-4">Grazie per aver ordinato!</h1>
      <div className="text-center">
        <QRCode
          className="mb-2"
          value={encodeURIComponent(JSON.stringify(location.state))}
        />
        <p className="mb-4">
          <small>Mostra il codice QR al bar per pagare il tuo ordine.</small>
        </p>
        <div className="d-grid gap-2 mt-4">
          <Button onClick={() => navigate("/", { state: {} })}>
            Nuovo ordine
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;

export const Head = () => <title>Ordine - Sagra</title>;
