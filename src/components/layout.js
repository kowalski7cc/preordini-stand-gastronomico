import * as React from "react";
import "../style/main.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { navigate, useStaticQuery, graphql } from "gatsby";

const Layout = ({ title, children, back, bottom, buttons }) => {
  let imadev = false;

  if (typeof localStorage !== "undefined") {
    if (typeof window !== "undefined") {
      // get query string params imadev value
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("imadev")) {
        localStorage.setItem("imadev", urlParams.get("imadev"));
      }
    }
    imadev = localStorage.getItem("imadev") === "true";
  }

  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          features {
            site_enabled
          }
        }
      }
    }
  `);

  const nextSagra = new Date("2023-08-31");

  const layoutEnabled = (
    <div className="d-flex flex-column min-vh-100">
      <header className="mb-3">
        <Navbar className={`sticky-top`} bg="accent">
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
            <Navbar.Brand className="text-white d-flex align-items-center text-truncate flex-grow-1">
              {title}
              {imadev && (
                <Badge
                  className="ms-2 d-none d-sm-block"
                  bg="warning"
                  text="dark"
                >
                  DEV
                </Badge>
              )}
            </Navbar.Brand>

            <div id="nav-buttons">{buttons}</div>
          </Container>
        </Navbar>
        <Navbar bg="warning" className="py-0 d-block d-sm-none">
          <Container className="flex-row justify-content-center">
            <Navbar.Text className="me-2 text-black fw-bold">
              Developer mode
            </Navbar.Text>
          </Container>
        </Navbar>
      </header>

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

  const layoutDisabled = (
    <div className="d-flex flex-column min-vh-100">
      <Navbar className="sticky-top mb-3" bg="accent">
        <Container className="flex-row justify-content-start">
          <Navbar.Brand className="text-white text-truncate flex-grow-1">
            Preordini Feste
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="container-fluid justify-content-center d-flex align-items-center flex-grow-1 p-0'">
        <div className="text-center">
          <h1 className="display-1 mb-4">🎉</h1>

          {nextSagra > Date.now() ? (
            <h3 className="display-6">
              Partecipa all'allegria della prossima festa da
              <br />
              <strong>
                {nextSagra.toLocaleDateString("it-IT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </h3>
          ) : (
            <h3 className="display-6">
              Al momento non c'è nessuna festa in programma.
            </h3>
          )}
        </div>
      </Container>
    </div>
  );

  return data.site.siteMetadata.features.site_enabled === true || imadev
    ? layoutEnabled
    : layoutDisabled;
};

export default Layout;
