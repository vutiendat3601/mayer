/* eslint-disable import/no-anonymous-default-export */
import React from "react";
// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// import { selectTranslations } from "../../store/slice/i18nSlice";
import { Routes } from "../../configs/routes";
import {
  Col,
  Row,
  Image,
  Container,
  Navbar,
  Nav,
} from "@themesberg/react-bootstrap";
import AccountSetting from "../core/Setting/AccountSetting";
import { Footer } from "../core/Footer/Footer";

import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";

function IntroductionPage() {
  // const t = useSelector(selectTranslations);

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

      <section className="section section-lg line-bottom-soft">
        <Container>
          <Row className="justify-content-center mb-5 mb-lg-6 ">
            <Col xs={12} className="text-center">
              <h2 className="px-lg-5 mb-5">
                Mock your back-end API and start coding your UI today.
              </h2>
              <p className="px-lg-0">
                It's hard to put together a meaningful UI prototype without
                making real requests to an API. By making real requests, you'll
                uncover problems with application flow, timing, and API design
                early, improving the quality of both the user experience and
                API. With Mockaroo, you can design your own mock APIs, You
                control the URLs, responses, and error conditions. Paralellize
                UI and API development and start delivering better applications
                faster today!
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mb-5 mb-lg-6 ">
            <Col xs={12} className="text-center">
              <h2 className="px-lg-5 mb-5">Why is test data important?</h2>
              <p className="px-lg-0">
                If you're developing an application, you'll want to make sure
                you're testing it under conditions that closely simulate a
                production environment. In production, you'll have an army of
                user banging away at your app and filling your database with
                data, which puts stress on your code. If you're hand-entering
                data into a test environment one record at a time using the UI,
                you're never going to build up the volume and variety of data
                that your app will accumulate in a few days in production.
                Worse, the data you enter will be biased towards your own usage
                patterns and won't match real-world usage, leaving important
                bugs undiscovered.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mb-5 mb-lg-6 ">
            <Col xs={12} className="text-center">
              <h2 className="px-lg-5 mb-5">Why is realistic data important?</h2>
              <p className="px-lg-0">
                When your test database is filled with realistic looking data,
                you'll be more engaged as a tester. When you demonstrate new
                features to others, they'll understand them faster. Real data is
                varied and will contain characters that may not play nice with
                your code, such as apostrophes, or unicode characters from other
                languages. Testing with realistic data will make your app more
                robust because you'll catch errors that are likely to occur in
                production before release day.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
}

export default IntroductionPage;
