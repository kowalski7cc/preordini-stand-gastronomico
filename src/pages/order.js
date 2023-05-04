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
          aria-label="Schermo intero"
          onClick={() => {
            // Fullscreen API is not supported by all browsers
            if (document.fullscreenEnabled) {
              // Put qrcode-div in fullscreen
              document.getElementById("qrcode-div").requestFullscreen();
            }
          }}
          variant="accent"
        >
          <i aria-hidden="true" className="bi bi-fullscreen"></i>
        </Button>
      }
    >
      <div className="h-100 my-auto align-items-center d-flex">
        <div className="d-flex align-items-center justify-content-center h-100 w-100 py-2 px-1">
          <div className="text-center">
            <p className="mb-4 mx-3">
              <small>
                Mostra il codice QR in cassa per confermare e pagare il tuo
                ordine
              </small>
            </p>
            {location.state && (
              <div
                className="bg-body flex-fill justify-content-center align-items-center d-flex"
                id="qrcode-div"
              >
                <QRCode
                  className="mb-2 w-100 border border-5 border-white"
                  style={{ maxHeight: "4cm", maxWidth: "4cm" }}
                  value={encodeURIComponent(JSON.stringify(location.state))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;

export const Head = () => <Seo title="Ordine" />;
