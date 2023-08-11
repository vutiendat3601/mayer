/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../../configs/routes";
import {
  Col,
  Row,
  Image,
  Container,
  Navbar,
  Nav,
} from "@themesberg/react-bootstrap";

import { ProfileCardWidget } from "../core/Widget/Widgets";
import { GeneralInfoForm } from "../core/Form/Forms";
import { Footer } from "../core/Footer/Footer";
import AccountSetting from "../core/Setting/AccountSetting";

import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";

function AccountPage() {
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
            to={Routes.Project.path}
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
              <div className="react-big-icon d-none d-lg-block">
                <span className="fab fa-react"></span>
              </div>
              <h1 className="fw-bolder text-secondary">
                Mayer Account Profile Page
              </h1>
            </Col>
          </Row>
        </Container>
      </section>

      <div className="section pt-0">
        <Container className="mt-n10 mt-lg-n12 z-2">
          <Row className="justify-content-center">
            <Col xs={12}>
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4"></div>

              <Row>
                <Col xs={12} xl={8}>
                  <GeneralInfoForm />
                </Col>

                <Col xs={12} xl={4}>
                  <Row>
                    <Col xs={12}>
                      <ProfileCardWidget />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default AccountPage;
