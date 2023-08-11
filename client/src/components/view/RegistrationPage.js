/* eslint-disabled import/no-anonymous-default-export */

import React, { useEffect } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectTranslations } from "../../store/slice/i18nSlice";
import {
  selectTokenLogin,
  selectErrorSession,
  signUp,
} from "../../store/slice/sessionSlice";

import { Routes } from "../../configs/routes";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  FormCheck,
  Container,
  Alert,
} from "@themesberg/react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import BgImage from "../../assets/img/illustrations/signin.svg";

function RegistrationPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = useSelector(selectErrorSession);

  const t = useSelector(selectTranslations);
  const tokenRedux = useSelector(selectTokenLogin);

  useEffect(() => {
    if (tokenRedux) {
      navigate(Routes.Project.path, { replace: true });
    }
  }, [navigate, tokenRedux]);

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <Card.Link
              as={Link}
              to={Routes.Project.path}
              className="text-gray-700"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" />{" "}
              {t.button.back}
            </Card.Link>
          </p>

          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">{t.registration.tagname}</h3>
                </div>

                {errors.null && (
                  <Alert variant="danger">
                    <strong>{t.message.account_exists}</strong>
                  </Alert>
                )}

                <Formik
                  initialValues={{ email: "", password: "", cfpassword: "" }}
                  validate={(values) => {
                    const errors = {};

                    if (!values.email) {
                      errors.email = t.message.required;
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                      )
                    ) {
                      errors.email = t.message.invalid_email;
                    }

                    if (!values.password) {
                      errors.password = t.message.required;
                    } else if (
                      !/(?=(.*[0-9]))(?=.*[@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,.?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/i.test(
                        values.password
                      )
                    ) {
                      errors.password = t.message.invalid_password;
                    }

                    if (!values.cfpassword) {
                      errors.cfpassword = t.message.required;
                    } else if (
                      values.cfpassword &&
                      values.password !== values.cfpassword
                    ) {
                      errors.cfpassword = t.message.incorrect_comfirm_password;
                    }

                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    const { email, password } = values;

                    dispatch(
                      signUp({
                        email: email,
                        password: password,
                        setSubmitting,
                      })
                    );
                    navigate(Routes.Signin.path, { replace: true });
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <Form className="mt-4" onSubmit={handleSubmit}>
                      <Form.Group id="email" className="mb-4">
                        <Form.Label>{t.label.email}</Form.Label>

                        <Form.Control
                          // required
                          // type="email"
                          name="email"
                          placeholder="example@company.com"
                          isInvalid={!!errors.email && touched.email}
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.email && touched.email && errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group id="password" className="mb-4">
                        <Form.Label>{t.label.password}</Form.Label>

                        <Form.Control
                          // required
                          type="password"
                          placeholder={t.label.password}
                          name="password"
                          isInvalid={!!errors.password && touched.password}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group id="confirmPassword" className="mb-4">
                        <Form.Label>{t.label.comfirm_password}</Form.Label>

                        <Form.Control
                          // required
                          type="password"
                          placeholder="Confirm Password"
                          name="cfpassword"
                          isInvalid={!!errors.cfpassword && touched.cfpassword}
                          value={values.cfpassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.cfpassword &&
                            touched.cfpassword &&
                            errors.cfpassword}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <FormCheck type="checkbox" className="d-flex mb-4">
                        <FormCheck.Input id="terms" className="me-2" />

                        <FormCheck.Label htmlFor="terms">
                          {t.label.check_term}{" "}
                          <Card.Link>{t.label.term_and_condition}</Card.Link>
                        </FormCheck.Label>
                      </FormCheck>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting === true
                          ? t.button.loading
                          : t.button.registration}
                      </Button>
                    </Form>
                  )}
                </Formik>

                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    {t.label.have_account}
                    <Card.Link
                      as={Link}
                      to={Routes.Signin.path}
                      className="fw-bold"
                    >
                      {"  "} {t.label.login_here}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default RegistrationPage;
