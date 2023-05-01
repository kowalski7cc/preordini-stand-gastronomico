import * as React from "react";
import { navigate } from "gatsby";
import QRCode from "react-qr-code";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Ratio from "react-bootstrap/Ratio";

const OrderPage = ({ location }) => {
  if (!location.state) {
    navigate("/");
    return null;
  }

  return (
    <Layout
      className="mb-5 align-items-center"
      back={true}
      title="Ordine"
      bottom={
        <div className="d-grid gap-2 mt-4">
          <Button onClick={() => navigate("/", { state: {} })}>
            Nuovo ordine
          </Button>
        </div>
      }
    >
      <div className="h-100">
        <h1 className="mb-4">Grazie per aver ordinato!</h1>
        <div>
          <QRCode
            className="mb-2 w-100"
            value={encodeURIComponent(JSON.stringify(location.state))}
          />
          <p className="mb-4 text-center">
            <small>Mostra il codice QR al bar per pagare il tuo ordine.</small>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;

export const Head = () => <title>Ordine - Sagra</title>;
