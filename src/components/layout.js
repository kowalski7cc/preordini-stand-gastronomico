import * as React from "react";
import "../style/main.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const Layout = ({ title, children }) => (
  <>
    <Navbar className="mb-3" bg="light" variant="light">
      <Container>
        <Navbar.Brand>{title}</Navbar.Brand>
      </Container>
    </Navbar>
    <Container>
      <main>{children}</main>
    </Container>
  </>
);

export default Layout;
