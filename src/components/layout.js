import * as React from "react";
import "../style/main.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { navigate } from "gatsby";

const Layout = ({ title, children, back, bottom, buttons }) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar className="sticky-top mb-3" bg="accent">
      <Container className="flex-row justify-content-start">
        {back && (
          <Button
            variant="accent"
            className="me-2"
            aria-label="Torna indietro"
            aria-haspopup="true"
            title="Indietro"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <i aria-hidden="true" className="fs-5 bi bi-arrow-left" />
          </Button>
        )}
        <Navbar.Brand className="text-white text-truncate flex-grow-1">
          {title}
        </Navbar.Brand>
        <div id="nav-buttons">{buttons}</div>
      </Container>
    </Navbar>
    <Container className="container-fluid flex-grow-1 p-0'">
      {children}
    </Container>
    {bottom && (
      <footer className="bg-body align align-middle sticky-bottom">
        <Container className="my-3">{bottom}</Container>
      </footer>
    )}
  </div>
);

export default Layout;
