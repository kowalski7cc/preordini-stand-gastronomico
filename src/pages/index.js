import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { Col, Container, Row } from "react-bootstrap";

const ItemComponent = ({ item }) => {
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
      <div class="input-group w-100 btn-group" role="group">
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => setCount(count - 1 >= 0 ? count - 1 : 0)}
        >
          -
        </button>
        <Form.Control type="number" readOnly={true} min="0" value={count} />
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
      </div>
    </Row>
  );
};

const IndexPage = ({ data }) => {
  return (
    <Layout className="mb-5" title="Preordine">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="email" placeholder="Inserisci il tuo nome" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Numero del tavolo</Form.Label>
          <Form.Control
            type="number"
            placeholder="Inserisci il numero del tavolo"
            min="0"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Numero di persone</Form.Label>
          <Form.Control
            type="number"
            value="1"
            required
            min="1"
            placeholder="Inserisci il numero di persone"
          />
        </Form.Group>
      </Form>

      <Accordion className="mb-5" defaultActiveKey="0">
        {data.categorie.nodes.map((categoria, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{categoria.descrizione}</Accordion.Header>
            <Accordion.Body>
              {categoria.items.length > 0
                ? categoria.items.map((item, index) => (
                    <ItemComponent key={index} item={item} />
                  ))
                : "Nessun articolo disponibile in questa categoria"}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div class="d-grid gap-2">
        <Button variant="primary" className="w-100">
          Vedi resoconto
        </Button>

        <Button variant="danger" className="w-100">
          Cancella ordine
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
export const Head = () => <title>Preordine</title>;
