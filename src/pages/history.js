import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Seo from "../components/seo";
import DbManager from "../utils/dbmanager";

const HistoryPage = ({ data }) => {
  const itemsNames = data.allSqliteItems.nodes.reduce((acc, item) => {
    acc[item.id] = { description: item.description, price: item.price };
    return acc;
  }, {});

  const [loaded, setLoaded] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [db, setDb] = React.useState(null);
  React.useEffect(() => {
    if (!db) {
      const ordersDB = new DbManager();
      ordersDB.open().then((db) => {
        setDb(db);
      });
    }
  }, [db]);

  React.useEffect(() => {
    if (db) {
      db.getOrders().then((orders) => {
        setOrders(orders);
        setLoaded(true);
      });
    }
  }, [db]);

  return (
    <Layout
      title="Cronologia ordini"
      back={true}
      buttons={
        <Button
          variant="accent"
          title="Cancella cronologia"
          id="btn-clear-history"
          disabled={!orders.length}
          onClick={() => {
            const confirm = window.confirm(
              "Sei sicuro di voler cancellare la cronologia?"
            );
            // remove button focus
            document.getElementById("btn-clear-history").blur();
            if (!confirm) return;
            if (db) {
              db.deleteAllOrders().then(() => {
                console.log("Orders cleared");
                setOrders([]);
              });
            }
          }}
        >
          <i className="bi bi-trash" />
        </Button>
      }
    >
      {loaded &&
        orders.map((order, index) => (
          <div className="mb-5" key={index}>
            <div className="d-flex align-middle align-items-center">
              <h3 className="flex-fill">{`Ordine ${order.id}`}</h3>
              <Button
                title="Visualizza QR code"
                onClick={() => {
                  navigate("/order", { state: order });
                }}
              >
                <i className="bi bi-qr-code" />
              </Button>
            </div>
            <small>Del {order.orderDate.toLocaleString()}</small>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Prodotto</th>
                    <th>Q.tà</th>
                    <th>Prezzo</th>
                  </tr>
                </thead>
                <tbody>
                  {order.righe.map((row, index) => (
                    <tr key={index}>
                      <td>
                        {itemsNames[row.id]?.description ||
                          "Descrizione mancante"}
                      </td>
                      <td>{row.qta}</td>
                      <td> {(itemsNames[row.id]?.price || 0).toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ))}
      {loaded && (!db || !orders.length) && (
        <div className="text-center mt-3">
          <i className="bi bi-clock-history" style={{ fontSize: "10rem" }} />
          <h3 className="mt-3">Nessun ordine recente</h3>
        </div>
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

export default HistoryPage;
export const Head = () => <Seo title="Cronologia ordini" />;
