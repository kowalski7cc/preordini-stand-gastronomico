import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Seo from "../components/seo";

const CheckoutPage = ({ data, location }) => {
  const itemsNames = data.allSqliteItems.nodes.reduce((acc, item) => {
    acc[item.id] = { description: item.description, price: item.price };
    return acc;
  }, {});

  const [db, setDb] = React.useState(null);
  React.useEffect(() => {
    if (typeof window !== "undefined" && !db) {
      const request = window.indexedDB.open("data", 1);
      request.onerror = function (event) {
        console.log("Database error: " + event.target.errorCode);
      };
      request.onsuccess = function (event) {
        setDb(event.target.result);
      };
    }
  }, [db]);

  if (typeof window !== "undefined" && !location.state) {
    navigate("/");
    return null;
  }

  let receipt = location.state || { righe: [] };
  const coperti_enabled = data.site.siteMetadata.features.coperti_enabled;

  return (
    <Layout
      className="mb-5"
      back={true}
      title="Riepilogo ordine"
      bottom={
        <div className="d-grid gap-2 ">
          <Button
            variant="success"
            className="d-block"
            disabled={!receipt.righe.length}
            onClick={() => {
              if (db) {
                const transaction = db.transaction(["orders"], "readwrite");
                const objectStore = transaction.objectStore("orders");
                const request = objectStore.add({
                  ...receipt,
                  orderdate: new Date(),
                });
                request.onsuccess = function (event) {
                  console.log("Order added to db");
                };
              }
              navigate("/order", { state: receipt });
            }}
          >
            <i className="bi bi-cart me-2" />
            Conferma ordine
          </Button>
        </div>
      }
    >
      <h2>Ordine {receipt.cliente ? "per " + receipt.cliente : "anonimo"}</h2>
      <ul className="list-unstyled mb-4">
        {coperti_enabled && (
          <li key={"tavolo"}>
            <i className="bi bi-geo-alt me-2" />
            {receipt.numeroTavolo
              ? "Tavolo " + receipt.numeroTavolo
              : "Da asporto"}
          </li>
        )}
        <li key="coperti">
          <i className="bi bi-people me-2" />
          {receipt.coperti || 0}
        </li>
      </ul>
      <div className="table-responsive">
        <Table className="mb-5" striped hover>
          <thead>
            <tr>
              <th className="text-truncate">Prodotto</th>
              <th className="text-end text-truncate">Q.tà</th>
              <th className="text-truncate">Prezzo</th>
            </tr>
            {receipt.righe.map((item, index) => (
              <tr key={index}>
                <td className="text-break">
                  {itemsNames[item.id].description}
                </td>
                <td className="text-end">{item.qta}</td>
                <td>{(itemsNames[item.id].price || 0).toFixed(2)}€</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Totale</strong>
              </td>
              <td></td>
              <td>
                <strong>
                  {(
                    receipt.righe.reduce(
                      (acc, item) =>
                        (acc += itemsNames[item.id].price * item.qta),
                      0
                    ) || 0
                  ).toFixed(2)}
                  €
                </strong>
              </td>
            </tr>
          </thead>
        </Table>
      </div>
      {!receipt.righe.length && (
        <p className="text-center text-danger">
          Non puoi proseguire senza prodotti
        </p>
      )}
    </Layout>
  );
};

export const query = graphql`
  query Items {
    allSqliteItems {
      nodes {
        description: descrizione
        id: sqliteId
        price: prezzo
      }
    }
    site {
      siteMetadata {
        features {
          coperti_enabled
        }
      }
    }
  }
`;

export default CheckoutPage;
export const Head = () => <Seo title="Riepilogo ordine" />;
