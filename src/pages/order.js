import * as React from "react";
import { navigate } from "gatsby";
import QRCode from "react-qr-code";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Seo from "../components/seo";

const OrderPage = ({ location }) => {
  if (typeof window !== "undefined" && !location.state) {
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
      buttons={
        <Button
          onClick={() => {
            // Fullscreen API is not supported by all browsers
            if (document.fullscreenEnabled) {
              // Put qrcode-div in fullscreen
              document.getElementById("qrcode-div").requestFullscreen();
            }
          }}
          variant="outline-dark"
        >
          <i className="bi bi-fullscreen"></i>
        </Button>
      }
    >
      <div className="h-100">
        <div
          id="qrcode-div"
          className="d-flex align-items-center justify-content-center h-100 w-100 p-3 bg-body"
        >
          <div>
            {location.state && (
              <QRCode
                className="mb-2 w-100"
                value={encodeURIComponent(JSON.stringify(location.state))}
              />
            )}
            <p className="mb-4 text-center">
              <small>
                Mostra il codice QR in cassa per confermare e pagare il tuo
                ordine
              </small>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;

export const Head = () => <Seo title={"Ordine"} />;
