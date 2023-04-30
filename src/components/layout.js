import * as React from "react";
import "../style/main.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, navigate } from "gatsby";
import { Button } from "react-bootstrap";

const Layout = ({ title, children, back }) => (
  <>
    <Navbar className="mb-3" bg="light" variant="light">
      <Container>
        <Navbar.Brand>
          {back && (
            <i onClick={() => navigate(-1)} className="bi bi-arrow-left me-3" />
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
