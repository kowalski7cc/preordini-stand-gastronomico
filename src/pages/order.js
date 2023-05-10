import * as React from "react";
import { graphql, navigate } from "gatsby";
import QRCode from "react-qr-code";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Seo from "../components/seo";

function optimize(obj) {
  const o = Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ""
    )
  );
  let { id, key, orderDate, ...rest } = o;
  return rest;
}

const OrderPage = ({ location, data }) => {
  const [hasFullScreen, setHasFullScreen] = React.useState(false);
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      setHasFullScreen(
        document.fullscreenEnabled || document.webkitFullscreenEnabled
      );
    }
  }, []);

  // React state for full screen
  const [fullScreen, setFullScreen] = React.useState(false);
  React.useEffect(() => {
    if (document.fullscreenEnabled) {
      document.onfullscreenchange = () => {
        setFullScreen(document.fullscreenElement !== null);
      };
    }
  });

  React.useEffect(() => {
    console.log(JSON.stringify(optimize(location.state)));
  }, [location.state]);

  if (typeof window !== "undefined" && !location.state) {
    navigate("/");
    return null;
  }

  return (
    <Layout
      className="mb-5 align-items-center"
      back={false}
      title="Preordine"
      bottom={
        <div className="d-grid gap-2 mt-4">
          <Button onClick={() => navigate("/", { state: {} })}>
            Nuovo preordine
          </Button>
        </div>
      }
      buttons={
        hasFullScreen && (
          <Button
            title="Schermo intero"
            aria-label="Schermo intero"
            onClick={() => {
              const qrcodeDiv = document.getElementById("qrcode-div");
              // Fullscreen API is not supported by all browsers
              if (document.fullscreenEnabled) {
                // Put qrcode-div in fullscreen
                qrcodeDiv.requestFullscreen();
              } else if (document.webkitFullscreenEnabled) {
                qrcodeDiv.webkitRequestFullscreen();
              }
            }}
            variant="accent"
          >
            <i aria-hidden="true" className="bi bi-fullscreen"></i>
          </Button>
        )
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
                  viewBox={`0 0 256 256`}
                  size={256}
                  level="L"
                  style={
                    fullScreen
                      ? { maxHeight: "6cm", maxWidth: "6cm" }
                      : { maxHeight: "5cm", maxWidth: "5cm" }
                  }
                  value={
                    data.site.siteMetadata.features?.use_encode_uri === true
                      ? encodeURIComponent(
                          JSON.stringify(optimize(location.state))
                        )
                      : JSON.stringify(optimize(location.state))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    site {
      siteMetadata {
        features {
          use_encode_uri
        }
      }
    }
  }
`;

export default OrderPage;

export const Head = () => <Seo title="Ordine" />;
