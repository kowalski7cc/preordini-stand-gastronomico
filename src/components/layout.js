import * as React from "react";
import "../style/main.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { navigate } from "gatsby";

const Layout = ({ title, children, back, bottom }) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar className="sticky-top mb-3" bg="light" variant="light">
      <Container>
        <Navbar.Brand>
          {back && (
            <Button
              variant="outline-dark"
              className="me-3"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left" />
            </Button>
          )}
          {title}
        </Navbar.Brand>
      </Container>
    </Navbar>
    <Container>
      <main>{children}</main>
    </Container>
    <footer className="bg-body mt-auto sticky-bottom">
      <Container className="mt-3 mb-3">{bottom}</Container>
    </footer>
  </div>
);

export default Layout;
