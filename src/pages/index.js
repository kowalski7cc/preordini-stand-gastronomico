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
      <Col xs={8} sm={9}>
        <p>
          <strong>{item.descrizione}</strong>
        </p>
      </Col>
      <Col xs={4} sm={3}>
        <p className="text-end">{item.prezzo.toFixed(2)}€</p>
      </Col>
      <div className="input-group w-100 btn-group" role="group">
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
    </Row>
  );
};

const IndexPage = ({ data }) => {
  const [validated, setValidated] = React.useState(false);
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
    <Layout className="mb-5" title="Nuovo preordine">
      <Form validated={validated}>
        <Form.Group className="mb-3" controlId="orderName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci il tuo nome"
            onChange={(v) => setState({ ...state, cliente: v.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="orderTable">
          <Form.Label>Numero del tavolo</Form.Label>
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
        <Form.Group className="mb-3" controlId="orderPeople">
          <Form.Label>Numero di persone</Form.Label>
          <Form.Control
            type="number"
            onChange={(v) => setState({ ...state, coperti: v.target.value })}
            required
            min="1"
            defaultValue="1"
            placeholder="Inserisci il numero di persone"
          />
        </Form.Group>
      </Form>

      <Accordion className="mb-4  " defaultActiveKey="0">
        {data.categorie.nodes.map((categoria, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{categoria.descrizione}</Accordion.Header>
            <Accordion.Body>
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

      <div className="d-grid gap-2 mb-3">
        <Button
          variant="primary"
          onClick={() => navigate("/checkout", { state: state })}
          className="w-100"
        >
          Vedi resoconto
        </Button>
      </div>
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
export const Head = () => <title>Nuovo preordine</title>;
