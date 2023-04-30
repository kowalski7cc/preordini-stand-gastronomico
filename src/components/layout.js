import * as React from "react";
import "../style/main.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { navigate } from "gatsby";

const Layout = ({ title, children, back }) => (
  <>
    <Navbar className="mb-3" bg="light" variant="light">
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
  </>
);

export default Layout;
