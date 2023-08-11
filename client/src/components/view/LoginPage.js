/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable import/no-anonymous-default-export */

import React, { useEffect, useRef } from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  selectTokenLogin,
  selectErrorSession,
  updateErrorSession,
  signIn,
} from "../../store/slice/sessionSlice";
import { selectTranslations } from "../../store/slice/i18nSlice";

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
import { ToastMessage } from "../core/Toast/MessageToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import BgImage from "../../assets/img/illustrations/signin.svg";

const ToastType = {
  success: "success",
  fail: "fail",
};

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastRef = useRef(null);

  useEffect(() => {
    dispatch(updateErrorSession({}));
  }, [dispatch]);
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
      <ToastMessage
        ref={toastRef}
        message="Login Successfully!"
        type={ToastType.success}
      />
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <Card.Link
              as={Link}
              to={Routes.Introduction.path}
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
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">{t.login.tagname}</h3>
                </div>

                {errors.null && (
                  <Alert variant="danger">
                    <strong>{t.message.incorrect_account}</strong>
                  </Alert>
                )}

                <Formik
                  initialValues={{ email: "", password: "" }}
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
                    }

                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    const { email, password } = values;

                    dispatch(
                      signIn({
                        email: email,
                        password: password,
                        setSubmitting,
                      })
                    );
                    // toastRef.current.show();
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
                          // type="email"
                          // required
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

                      <Form.Group>
                        <Form.Group id="password" className="mb-4">
                          <Form.Label>{t.label.password}</Form.Label>

                          <Form.Control
                            type="password"
                            name="password"
                            // required
                            placeholder={t.label.password}
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

                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <Form.Check type="checkbox">
                            <FormCheck.Input
                              id="defaultCheck5"
                              className="me-2"
                            />

                            <FormCheck.Label
                              htmlFor="defaultCheck5"
                              className="mb-0"
                            >
                              {t.label.remember_me}
                            </FormCheck.Label>
                          </Form.Check>

                          <Card.Link
                            className="small text-end"
                            as={Link}
                            to={Routes.ForgotPassword.path}
                          >
                            {t.label.lost_password}
                          </Card.Link>
                        </div>

                        <br />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting === true
                          ? t.button.loading
                          : t.button.login}
                      </Button>
                    </Form>
                  )}
                </Formik>

                <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">{t.label.login_with}</span>
                </div>

                <div className="d-flex justify-content-center my-4">
                  <Button
                    variant="outline-light"
                    className="btn-icon-only btn-pill text-google  me-2"
                  >
                    <FontAwesomeIcon icon={faGoogle} />
                  </Button>

                  <Button
                    variant="outline-light"
                    className="btn-icon-only btn-pil text-dark"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    {t.label.not_registered}
                    <Card.Link
                      as={Link}
                      to={Routes.Signup.path}
                      className="fw-bold"
                    >
                      {t.label.create_account}
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

export default LoginPage;
