import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Seo from "../components/seo";

import OrderDatabaseManager from "../utils/dbmanager";

const CheckoutPage = ({ data, location }) => {
  const itemsNames = data.allSqliteItems.nodes.reduce((acc, item) => {
    acc[item.id] = { description: item.description, price: item.price };
    return acc;
  }, {});

  React.useEffect(() => {
    if (typeof window !== "undefined" && !location.state) {
      navigate("/");
    }
  }, [location.state]);

  const [db, setDb] = React.useState(null);
  React.useEffect(() => {
    if (!db) {
      const ordersDB = new OrderDatabaseManager();
      ordersDB.open().then((db) => {
        setDb(db);
      });
    }
  }, [db]);

  const receipt = React.useRef(location.state || { righe: [] });

  const coperti_enabled = React.useRef(
    data.site.siteMetadata.features.coperti_enabled || false
  );

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
            disabled={!receipt.current.righe.length}
            onClick={() => {
              if (db) {
                db.addOrder({
                  ...receipt.current,
                  orderDate: new Date(),
                }).then((id) => {
                  console.log("Order added: ", id);
                });
              }
              if (localStorage) {
                sessionStorage.removeItem("currentOrder");
              }
              navigate("/order", { state: receipt.current });
            }}
          >
            <i aria-hidden="true" className="bi bi-cart me-2" />
            Conferma ordine
          </Button>
        </div>
      }
    >
      <h2>
        {`Prerdine ${
          receipt.current.cliente ? `per ${receipt.current.cliente}` : "anonimo"
        }
        `}
      </h2>
      <ul className="list-unstyled mb-4">
        {coperti_enabled.current && (
          <li key={"tavolo"}>
            <i className="bi bi-geo-alt me-2" />
            {receipt.current.numeroTavolo
              ? "Tavolo " + receipt.numeroTavolo
              : "Da asporto"}
          </li>
        )}
        {coperti_enabled.current && (
          <li key="coperti">
            <i className="bi bi-people me-2" />
            {receipt.current.coperti || 0}
          </li>
        )}
      </ul>
      <div className="table-responsive">
        <Table className="mb-5" striped hover>
          <thead>
            <tr>
              <th className="text-truncate">Prodotto</th>
              <th className="text-end text-truncate">Q.tà</th>
              <th className="text-truncate">Prezzo</th>
            </tr>
            {receipt.current.righe.map((item, index) => (
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
                    receipt.current.righe.reduce(
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
      {!receipt.current.righe.length && (
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
