import * as React from "react";
import { graphql, navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { Col, Row } from "react-bootstrap";

const ItemComponent = ({ item, onChange }) => {
  const [count, setCount] = React.useState(0);

  return (
    <Row>
      <Col xs={8} sm={9} lg={7} xl={8} className="d-flex align-items-center">
        <p>
          <strong>{item.descrizione}</strong>
        </p>
      </Col>
      <Col
        xs={"auto"}
        sm={2}
        lg={1}
        xl={1}
        className="d-flex align-items-center justify-content-end"
      >
        <p className="text-end">{item.prezzo.toFixed(2)}€</p>
      </Col>
      <Col xs={12} sm={12} md={12} lg={3} xl={2}>
        <div className="input-group btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              var c = count - 1 >= 0 ? count - 1 : 0;
              setCount(c);
              onChange && onChange({ id: item.sqliteId, amount: c });
            }}
          >
            <i className="bi bi-dash-lg" aria-label="rimuovi" />
          </button>
          <Form.Control
            className="text-center"
            type="number"
            disabled={true}
            readOnly={true}
            min="0"
            value={count}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              var c = count + 1;
              setCount(c);
              onChange && onChange({ id: item.sqliteId, amount: c });
            }}
          >
            <i className="bi bi-plus-lg" aria-label="aggiungi" />
          </button>
        </div>
      </Col>
    </Row>
  );
};

const IndexPage = ({ data }) => {
  const [state, setState] = React.useState({
    cliente: null,
    numeroTavolo: null,
    coperti: 1,
    righe: [],
  });

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
      bottom={
        <div className="d-grid gap-2 bg-light">
          <Button
            variant="primary"
            onClick={() => navigate("/checkout", { state: state })}
            className="w-100"
          >
            Vedi resoconto
          </Button>
        </div>
      }
    >
      <Form>
        <Row>
          <Col lg={4} md={12}>
            <Form.Group className="mb-3" controlId="orderName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo nome"
                onChange={(v) =>
                  setState({ ...state, cliente: v.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
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
          <Col lg={4} sm={6}>
            <Form.Group className="mb-3" controlId="orderPeople">
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
        </Row>

        <Accordion className="mb-4  " defaultActiveKey="0">
          {data.categorie.nodes.map((categoria, index) => (
            <Accordion.Item eventKey={index} key={index}>
              <Accordion.Header>{categoria.descrizione}</Accordion.Header>
              <Accordion.Body className="d-grid gap-4">
                {categoria.items.length > 0
                  ? categoria.items.map((item, index) => (
                      <ItemComponent
                        key={index}
                        item={item}
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
      </Form>
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
  }
`;

export default IndexPage;
export const Head = () => <title>Nuovo preordine - Sagra</title>;
