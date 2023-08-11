/* eslint-disable import/no-anonymous-default-export */

import React from "react";
import { Row, Col, Card, Image, Container, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "../../../configs/routes";

import ReactHero from "../../../assets/img/technologies/react-hero-logo.svg";

export const Footer = () => {

  return (
    
    <footer className="footer py-6 bg-dark text-white">
      <Container>
        <Row>
          <Col md={4}>
            <Navbar.Brand as={Link} to={Routes.Introduction.path} className="me-lg-3 mb-3 d-flex align-items-center">
              <Image src={ReactHero} />
              <span className="ms-2 brand-text">Mayer</span>
            </Navbar.Brand>
            <p>Mayer is a free and open source admin dashboard template powered by React.js and Bootstrap 5.</p>
          </Col>
          <Col xs={6} md={2} className="mb-5 mb-lg-0">
            <span className="h5">Website</span>
            <ul className="links-vertical mt-2">
              <li><Card.Link as= { Link } target="_blank" to={Routes.Project.path} >Project</Card.Link></li>
              <li><Card.Link as= { Link } target="_blank" to={Routes.Schema.path} >Schema</Card.Link></li>
              <li><Card.Link as= { Link } target="_blank" to={Routes.Dataset.path} >Dataset</Card.Link></li>
              <li><Card.Link as= { Link } target="_blank" to={Routes.MockAPI.path} >Mock API</Card.Link></li>
            </ul>
          </Col>
          <Col xs={6} md={2} className="mb-5 mb-lg-0">
            <span className="h5">Other</span>
            <ul className="links-vertical mt-2">
              <li><Card.Link as= { Link } to={Routes.Project.path} target="_blank" >Getting started</Card.Link></li>
              <li><Card.Link as= { Link } to={Routes.Project.path} target="_blank" >License</Card.Link></li>
            </ul>
          </Col>
          <Col xs={12} md={4} className="mb-5 mb-lg-0">
            <span className="h5 mb-3 d-block">Subscribe</span>
            <form action="#">
              <div className="form-row mb-2">
                <div className="col-12">
                  <input type="email" className="form-control mb-2" placeholder="example@company.com" name="email" aria-label="Subscribe form" required />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-secondary text-dark shadow-soft btn-block" data-loading-text="Sending">
                    <span>Subscribe</span>
                  </button>
                </div>
              </div>
            </form>
            <p className="text-muted font-small m-0">We’ll never share your details. See our <Card.Link className="text-white" href="#">Privacy Policy</Card.Link></p>
          </Col>
        </Row>
        <hr className="bg-gray my-5" />
        <Row>
          <Col className="mb-md-2">
            <div className="d-flex text-center justify-content-center align-items-center" role="contentinfo">
              <p className="font-weight-normal font-small mb-0">Copyright © Mayer 2022-<span className="current-year">2023</span>. All rights reserved.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
