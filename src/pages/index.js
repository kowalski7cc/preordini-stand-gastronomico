import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Seo from "../components/seo";

import OrderDatabaseManager from "../utils/dbmanager";

const ItemComponent = ({ item, onChange, value, debug = false }) => {
  const [count, setCount] = React.useState(value || 0);

  return (
    <Row className="gap-3">
      <Col
        xs={8}
        sm={9}
        lg={7}
        xl={8}
        className="d-flex align-middle align-items-center"
      >
        <strong>
          {item.descrizione}
          {debug ? ` (itemid: ${item.sqliteId})` : ""}
        </strong>
      </Col>
      <Col
        xs={"auto"}
        sm={2}
        lg={1}
        xl={1}
        className="d-flex align-items-center justify-content-end"
      >
        {`${item.prezzo.toFixed(2)}€`}
      </Col>
      <Col xs={12} sm={12} md={12} lg={3} xl={2}>
        <div className="input-group btn-group" role="group">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="fs-5"
            onClick={() => {
              var c = count - 1 >= 0 ? count - 1 : 0;
              setCount(c);
              onChange && onChange({ id: item.sqliteId, amount: c });
            }}
          >
            <i className="bi bi-dash-lg" aria-label="rimuovi" />
          </Button>
          <Form.Control
            className="text-center"
            type="text"
            disabled={false}
            readOnly={true}
            tabIndex={-1}
            min="0"
            onSelect={(e) => e.target.blur()}
            value={count}
          />
          <Button
            type="button"
            className="fs-5"
            size="sm"
            variant="primary"
            onClick={() => {
              var c = count + 1;
              setCount(c);
              onChange && onChange({ id: item.sqliteId, amount: c });
            }}
          >
            <i className="bi bi-plus-lg fs-5" aria-label="aggiungi" />
          </Button>
        </div>
      </Col>
    </Row>
  );
};

const IndexPage = ({ data, location }) => {
  const [db, setDb] = React.useState(null);
  React.useEffect(() => {
    if (!db) {
      const ordersDB = new OrderDatabaseManager();
      ordersDB.open().then((db) => {
        setDb(db);
      });
    }
  }, [db]);

  const feature_coperti_enabled =
    data.site.siteMetadata.features.coperti_enabled;

  const [state, setState] = React.useState({
    cliente:
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("cliente")) ||
      "",
    numeroTavolo: feature_coperti_enabled
      ? location.status?.numeroTavolo ||
        (typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem("currentOrderTable") !== "" &&
          JSON.parse(sessionStorage.getItem("currentOrderTable"))) ||
        ""
      : null,
    coperti: feature_coperti_enabled
      ? location.status?.coperti ||
        (typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem("currentOrderCoperti")) ||
        1
      : null,
    righe:
      location.status?.righe ||
      (typeof sessionStorage !== "undefined" &&
        JSON.parse(sessionStorage.getItem("currentOrderCart"))) ||
      [],
    note:
      (typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("currentOrderNotes")) ||
      "",
  });

  const [imadev, setImadev] = React.useState(false);
  const [showDebug, setShowDebug] = React.useState(false);

  React.useEffect(() => {
    if (state) {
      sessionStorage.setItem("currentOrderCart", JSON.stringify(state.righe));
      sessionStorage.setItem("currentOrderNotes", state.note);
      sessionStorage.setItem("currentOrderTable", state.numeroTavolo);
      sessionStorage.setItem("currentOrderCoperti", state.coperti);
    }
  }, [state]);

  React.useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.getItem("imadev") === "true" && setImadev(true);
    }
  }, [imadev]);

  const updateRow = (row) => {
    const index = state.righe.findIndex((r) => r.id === row.id);
    if (index >= 0) {
      const righe = [...state.righe];
      if (row.qta === 0) {
        righe.splice(index, 1);
        setState({ ...state, righe });
      } else {
        righe[index] = row;
        setState({ ...state, righe });
      }
    } else if (row.qta > 0) {
      setState({ ...state, righe: [...state.righe, row] });
    }
  };

  return (
    <Layout
      className="mb-5"
      title="Nuovo preordine"
      buttons={
        <div className="d-grid gap-2 justify-content-md-end d-flex">
          {imadev && (
            <>
              <Button
                variant="accent"
                aria-label="Show debug info"
                onClick={() => setShowDebug(true)}
              >
                <i className="bi bi-bug" />
              </Button>
              <Modal
                centered
                show={showDebug}
                onHide={() => setShowDebug(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Debug informations</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <h5>App version</h5>
                  <code className="fs-5">
                    <pre>{data?.site?.siteMetadata?.version}</pre>
                  </code>
                  <h5>Features</h5>
                  <code className="fs-5">
                    <pre>
                      {JSON.stringify(
                        data?.site?.siteMetadata.features,
                        null,
                        2
                      )}
                    </pre>
                  </code>
                  <h5>State</h5>
                  <code className="fs-5">
                    <pre>{JSON.stringify(state, null, 2)}</pre>
                  </code>
                  <h5>Local Storage</h5>
                  <code className="fs-5">
                    <pre>{JSON.stringify(localStorage, null, 2)}</pre>
                  </code>
                  <h5>Session Storage</h5>
                  <code className="fs-5">
                    <pre>
                      {JSON.stringify(
                        Object.fromEntries(
                          Object.entries(sessionStorage).filter(
                            ([key, value]) => !key.startsWith("@@")
                          )
                        ),
                        null,
                        2
                      )}
                    </pre>
                  </code>
                  <h5>Orders database</h5>
                  {db ? (
                    <code className="fs-5">
                      <pre>{JSON.stringify(db, null, 2)}</pre>
                    </code>
                  ) : (
                    <code className="fs-5">
                      <pre>Database not ready</pre>
                    </code>
                  )}

                  <h5>Products</h5>
                  <code className="fs-5">
                    <pre>{JSON.stringify(data.categorie.nodes, null, 2)}</pre>
                  </code>
                </Modal.Body>
              </Modal>
            </>
          )}
          <Button
            variant="accent"
            aria-label="Cronologia ordini"
            onClick={() => navigate("/history")}
          >
            <i className="bi bi-clock-history" />
          </Button>
        </div>
      }
      bottom={
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            onClick={() => {
              if (localStorage) {
                localStorage.setItem("cliente", state.cliente);
              }
              if (state.coperti < 1 && feature_coperti_enabled) {
                alert("Numero di coperti non valido");
                return;
              }

              navigate("/checkout", { state: state });
            }}
            className="w-100 d-flex align-middle align-items-center justify-content-center"
          >
            <Badge pill bg="warning text-dark me-2">
              {state.righe?.reduce((acc, r) => acc + r.qta, 0) || 0}
            </Badge>
            Vedi il riepilogo
          </Button>
        </div>
      }
    >
      <Form className="mb-3">
        <Row>
          <Col lg={feature_coperti_enabled ? 4 : 12} md={12}>
            <Form.Group className="mb-3" controlId="orderName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo nome"
                onChange={(v) =>
                  setState({ ...state, cliente: v.target.value })
                }
                value={state.cliente || ""}
              />
            </Form.Group>
          </Col>
          <Col className={!feature_coperti_enabled && "d-none"} lg={4} sm={6}>
            <Form.Group className="mb-3" controlId="orderTable">
              <Form.Label>Tavolo</Form.Label>
              <Form.Control
                type="number"
                placeholder="Inserisci il numero del tavolo"
                min={0}
                required
                value={state.numeroTavolo || ""}
                onChange={(v) =>
                  setState({ ...state, numeroTavolo: v.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col
            className={!feature_coperti_enabled && "d-none"}
            lg={4}
            sm={feature_coperti_enabled ? 6 : 12}
          >
            <Form.Group className="" controlId="orderPeople">
              <Form.Label>Coperti</Form.Label>
              <Form.Control
                type="number"
                onChange={(v) =>
                  setState({ ...state, coperti: v.target.value })
                }
                value={state.coperti || ""}
                required
                min={1}
                placeholder="Inserisci il numero di vassoi"
              />
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Label>Note aggiuntive</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={state.note || ""}
              placeholder="Inserisci eventuali note aggiuntive"
              onChange={(v) => setState({ ...state, note: v.target.value })}
            />
          </Col>
        </Row>
      </Form>
      <Accordion className="mb-4" defaultActiveKey="0">
        {data.categorie.nodes.map((categoria, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>
              {categoria.descrizione +
                (imadev ? ` (categoryid: ${categoria.sqliteId})` : "")}
            </Accordion.Header>
            <Accordion.Body className="d-grid gap-4">
              {categoria.items.length > 0
                ? categoria.items.map((item, index) => (
                    <ItemComponent
                      key={index}
                      item={item}
                      debug={imadev}
                      value={
                        state?.righe?.find((r) => r.id === item.sqliteId)
                          ?.qta || 0
                      }
                      onChange={({ id, amount }) =>
                        updateRow({ id: id, qta: amount })
                      }
                    />
                  ))
                : "Nessun articolo disponibile in questa categoria"}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Layout>
  );
};

export const query = graphql`
  query Orders {
    categorie: allSqliteCategories(filter: { visibile: { eq: 1 } }) {
      nodes {
        sqliteId
        descrizione
        items {
          sqliteId
          prezzo
          descrizione
        }
      }
    }
    site {
      siteMetadata {
        version
        features {
          coperti_enabled
        }
      }
    }
  }
`;

export default IndexPage;
export const Head = () => <Seo title="Nuovo preordine" />;
