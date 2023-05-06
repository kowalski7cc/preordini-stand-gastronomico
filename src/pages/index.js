import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Seo from "../components/seo";

const ItemComponent = ({ item, onChange, value }) => {
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
        <strong>{item.descrizione}</strong>
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
            disabled={true}
            readOnly={true}
            min="0"
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
  const [state, setState] = React.useState({
    cliente:
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("cliente")) ||
      "",
    numeroTavolo: null,
    coperti: 1,
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

  React.useEffect(() => {
    if (state) {
      sessionStorage.setItem("currentOrderCart", JSON.stringify(state.righe));
      sessionStorage.setItem("currentOrderNotes", state.note);
    }
  }, [state]);

  const feature_coperti_enabled =
    data.site.siteMetadata.features.coperti_enabled;

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
        <Button
          variant="accent"
          aria-label="Cronologia ordini"
          onClick={() => navigate("/history")}
        >
          <i className="bi bi-clock-history" />
        </Button>
      }
      bottom={
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            onClick={() => {
              if (localStorage) {
                localStorage.setItem("cliente", state.cliente);
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
                min="0"
                required
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
                required
                min="1"
                defaultValue="1"
                placeholder="Coperti"
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
            <Accordion.Header>{categoria.descrizione}</Accordion.Header>
            <Accordion.Body className="d-grid gap-4">
              {categoria.items.length > 0
                ? categoria.items.map((item, index) => (
                    <ItemComponent
                      key={index}
                      item={item}
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
        features {
          coperti_enabled
        }
      }
    }
  }
`;

export default IndexPage;
export const Head = () => <Seo title="Nuovo preordine" />;
