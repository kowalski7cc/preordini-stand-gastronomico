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
            className="me-3"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <i className="fs-5 bi bi-arrow-left" />
          </Button>
        )}
        <Navbar.Brand className="text-white text-truncate flex-grow-1">
          {title}
        </Navbar.Brand>
        <div id="nav-buttons">{buttons}</div>
      </Container>
    </Navbar>
    <Container className="h-100 mb-auto">
      {children}
    </Container>
    <footer className="bg-body mt-auto sticky-bottom">
      <Container className="mt-3 mb-3">{bottom}</Container>
    </footer>
  </div>
);

export default Layout;
