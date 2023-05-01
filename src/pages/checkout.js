import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

const CheckoutPage = ({ data, location }) => {
  const itemsNames = data.allSqliteItems.nodes.reduce((acc, item) => {
    acc[item.id] = { description: item.description, price: item.price };
    return acc;
  }, {});

  if (!location.state) {
    navigate("/");
    return null;
  }

  let receipt = location.state || { righe: [] };

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
            onClick={() => navigate("/order", { state: receipt })}
          >
            <i className="bi bi-cart me-2" />
            Conferma ordine
          </Button>
        </div>
      }
    >
      <h2>Ordine per {receipt.cliente || "Anonimo"}</h2>
      <ul className="list-unstyled mb-4">
        <li key={"tavolo"}>
          <i className="bi bi-geo-alt me-2" />
          {receipt.numeroTavolo
            ? "Tavolo " + receipt.numeroTavolo
            : "Da asporto"}
        </li>
        <li key="coperti">
          <i className="bi bi-people me-2" />
          {receipt.coperti || 0}
        </li>
      </ul>
      <Table className="mb-5">
        <thead>
          <tr>
            <th>Prodotto</th>
            <th className="text-end">Quantità</th>
            <th>Prezzo</th>
          </tr>
          {receipt.righe.map((item, index) => (
            <tr key={index}>
              <td>{itemsNames[item.id].description}</td>
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
              {(
                receipt.righe.reduce(
                  (acc, item) => (acc += itemsNames[item.id].price * item.qta),
                  0
                ) || 0
              ).toFixed(2)}
              €
            </td>
          </tr>
        </thead>
      </Table>

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
  }
`;

export default CheckoutPage;
export const Head = () => <title>Riepilogo ordine - Sagra</title>;
