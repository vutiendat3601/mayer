/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { selectTokenLogin } from "../../store/slice/sessionSlice";
import { selectTranslations } from "../../store/slice/i18nSlice";

import { Routes } from "../../configs/routes";

import {
  Col,
  Row,
  Image,
  Container,
  Navbar,
  Nav,
} from "@themesberg/react-bootstrap";
import { Footer } from "../core/Footer/Footer";
import AccountSetting from "../core/Setting/AccountSetting";
import ProjectTable from "../core/Table/ProjectTable";

import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";

function ProjectPage() {
  const t = useSelector(selectTranslations);
  const navigate = useNavigate();

  const tokenRedux = useSelector(selectTokenLogin);

  useEffect(() => {
    if (!tokenRedux) {
      navigate(Routes.Introduction.path, { replace: true });
    }
  }, [navigate, tokenRedux]);

  return (
    <>
      <Navbar
        variant="dark"
        expand="lg"
        bg="dark"
        className="navbar-transparent navbar-theme-primary sticky-top"
      >
        <Container className="position-relative justify-content-between px-3">
          <Navbar.Brand
            as={Link}
            to={Routes.Introduction.path}
            className="me-lg-3 d-flex align-items-center"
          >
            <Image src={ReactHero} />
            <span className="ms-2 brand-text d-none d-md-inline">Mayer</span>
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            <Navbar.Collapse id="navbar-default-primary">
              <Nav className="navbar-nav-hover align-items-lg-center">
                <Nav.Link as={Link} to={Routes.Project.path}>
                  Project
                </Nav.Link>
                <Nav.Link as={Link} to={Routes.Schema.path}>
                  Schema
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={Routes.Dataset.path}
                  className="d-sm-none d-xl-inline"
                >
                  Dataset
                </Nav.Link>
                <Nav.Link as={Link} to={Routes.MockAPI.path}>
                  Mock API
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>

            <AccountSetting />
          </div>
        </Container>
      </Navbar>

      <section
        className="section-header overflow-hidden pt-5 pt-lg-6 pb-9 pb-lg-12 bg-primary text-white"
        id="home"
      >
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <h1 className="fw-bolder text-secondary">{t.project.tag}</h1>
              <p className="mt-5">{t.project.description}</p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="mt-n10 mt-lg-n50 z-2">
        <Row className="justify-content-center">
          <Col xs={15}>
            <ProjectTable />
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default ProjectPage;
