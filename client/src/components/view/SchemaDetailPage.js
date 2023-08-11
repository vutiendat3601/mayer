import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Formik, FieldArray } from "formik";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { v1 as uuidv1 } from "uuid";

import {
  Col,
  Row,
  Image,
  Container,
  Navbar,
  Nav,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { Footer } from "../core/Footer/Footer";
import AccountSetting from "../core/Setting/AccountSetting";
import { ChooseTypeModal } from "../core/Modal/ChooseTypeModal";

import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faPercent, faX } from "@fortawesome/free-solid-svg-icons";

import {
  // action api
  updateSchema,
  getSchema,
  // action update
  updateSelectedSchemas,
  updateIsCreateSchema,
  // action select
  selectSelectedSchema,
} from "../../store/slice/schemaSlice";
import {
  // action api
  createField,
  updateField,
  deleteField,
  getFieldList,
  // action select
  selectDataField,
  selectFieldList,
  // action update
  updateSelectedField,
} from "../../store/slice/fieldSlice";
import {
  selectIsLoading,
  selectOptions,
  updateIsLoading,
  getProjectList,
} from "../../store/slice/projectSlice";
import { selectTranslations } from "../../store/slice/i18nSlice";
import {
  // action update
  updateShowModalType,
} from "../../store/slice/typeSlice";

import { Routes } from "../../configs/routes";

function SchemaDetailPage() {
  const dispatch = useDispatch();
  function handleOpenModalChoose(type) {
    dispatch(updateShowModalType(true));
    dispatch(updateSelectedField(type));
  }

  const t = useSelector(selectTranslations);

  // handle get schema
  const { schemaId } = useParams();
  useEffect(() => {
    dispatch(updateSelectedSchemas({}));
    dispatch(getSchema({ schemaId: schemaId }));
  }, [dispatch, schemaId]);
  const thisSchema = useSelector(selectSelectedSchema);

  // handle data fields
  useEffect(() => {
    dispatch(getFieldList({ schemaId: schemaId }));
  }, [dispatch, schemaId]);
  const dataFields = useSelector(selectDataField);
  const newFields = useSelector(selectFieldList);

  // handle select project
  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);
  const options = useSelector(selectOptions);
  const thisProject = options.filter(
    (project) => project.id === parseInt(thisSchema.project_id, 10)
  );
  const handleSearch = useCallback(
    (q) => {
      dispatch(updateIsLoading(true));

      const params = {
        page: 1,
        search: q,
      };

      dispatch(getProjectList(params));
    },
    [dispatch]
  );

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
              <h1 className="fw-bolder text-secondary">Schema</h1>
              <p className="mt-5">{t.project.description}</p>
            </Col>
          </Row>
        </Container>
      </section>

      <Formik
        enableReinitialize={true}
        initialValues={{
          name: !!thisSchema && !!thisSchema.name ? thisSchema.name : "",
          projectID:
            !!thisSchema && !!thisSchema.name ? thisSchema.project_id : "",
          fields: dataFields.length > 0 ? dataFields : newFields,
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = t.message.required;
          } else if (!/^[^-\s][a-zA-Z0-9_\s-]+$/i.test(values.name)) {
            errors.name = "Invalid format name of schema";
          }

          for (let i = 0; i < values.fields.length; i++) {
            if (!values.fields[i].name) {
              errors[`fields.${i}.name`] = t.message.required;
            } else if (!/^[^-\s][a-zA-Z0-9_-]+$/i.test(values.fields[i].name)) {
              errors[`fields.${i}.name`] = "Invalid format name of field";
            } else {
              for (let j = i + 1; j < values.fields.length - 1; j++) {
                if (values.fields[i].name === values.fields[j].name) {
                  errors[`fields.${i}.name`] = "Must not be duplicated";
                  errors[`fields.${j}.name`] = "Must not be duplicated";
                }
              }
            }

            if (
              !values.fields[i].null_percentage &&
              values.fields[i].null_percentage !== 0
            ) {
              errors[`fields.${i}.null_percentage`] = t.message.required;
            } else if (
              !/^([0-9]|([1-9][0-9])|100)$/i.test(
                values.fields[i].null_percentage
              )
            ) {
              errors[`fields.${i}.null_percentage`] =
                "Invalid format null percentage";
            }
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const { name, projectID, fields } = values;
          console.log("Field", fields);

          fields.map(function (field, index) {
            if (values.fields[index].id !== undefined) {
              // update fields of this schema
              return dispatch(updateField(field));
            } else {
              // create fields of this schema
              return dispatch(createField(field));
            }
          });

          // update schema
          dispatch(
            updateSchema({
              id: schemaId,
              name: name,
              projectID: projectID,
              setSubmitting,
            })
          );

          // update isCreate
          dispatch(updateIsCreateSchema(false));
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
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form href="" onSubmit={handleSubmit}>
            <Card
              border="light"
              className="table-wrapper table-responsive shadow-sm mt-n10 mt-lg-n50 z-2 mx-10 mb-3"
            >
              <Card.Header>
                <Card.Link
                  as={Link}
                  to={Routes.Schema.path}
                  className="text-gray-700"
                >
                  <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back
                  to schema
                </Card.Link>
              </Card.Header>
              <Card.Body>
                <Container className="mb-3 mt-3">
                  <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
                    <Col sm={5} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="mb-3">Name Schema</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          isInvalid={!!errors.name && touched.name}
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name && touched.name && errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col sm={3} className="mb-5">
                      <Form.Group>
                        <Form.Label className="mb-3">Select Project</Form.Label>
                        <AsyncTypeahead
                          as={Form.Select}
                          filterBy={() => true}
                          id="async-typeahead"
                          isLoading={isLoading}
                          options={options}
                          defaultSelected={
                            thisProject.length > 0
                              ? thisProject
                              : ["Select Project"]
                          }
                          labelKey="name"
                          maxResults={10}
                          minLength={1}
                          onSearch={handleSearch}
                          renderMenuItemChildren={(option) => option.name}
                          onChange={(selected) => {
                            const value =
                              selected.length > 0 ? selected[0].id : "";
                            setFieldValue("projectID", value);
                          }}
                          onBlur={(e) => setFieldTouched("projectID", true)}
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                  </div>

                  <h5 className="my-4">Field</h5>

                  <Row>
                    <Col sm={3} className="mb-3">
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col sm={3} className="mb-3">
                      <Form.Group className="mb-2">
                        <Form.Label>Type</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col sm={2}>
                      <Form.Group>
                        <Form.Label>Null Percentage</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col sm={2}>
                      <Form.Group>
                        <Form.Label>Options</Form.Label>
                      </Form.Group>
                    </Col>
                  </Row>

                  <FieldArray name="fields">
                    {({ insert, remove, push }) => (
                      <div>
                        {values.fields.length > 0 &&
                          values.fields.map((field, index) => (
                            <div key={index}>
                              <Row>
                                <Col sm={3} className="mb-3">
                                  <Form.Group id="name-field">
                                    <Form.Control
                                      required
                                      type="text"
                                      placeholder="New Name Field"
                                      name={`fields.${index}.name`}
                                      value={values.fields[index].name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      disabled={isSubmitting}
                                      isInvalid={
                                        !!errors[`fields.${index}.name`]
                                      }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors[`fields.${index}.name`] &&
                                        errors[`fields.${index}.name`]}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col sm={3} className="mb-3">
                                  <Button
                                    variant="outline-gray"
                                    className="w-100"
                                    disabled={isSubmitting}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleOpenModalChoose(field);
                                    }}
                                  >
                                    {field.name_type}
                                  </Button>
                                  <ChooseTypeModal key={field.code_type} />
                                </Col>
                                <Col sm={2} className="mb-3">
                                  <Form.Group id="null-percentage-field">
                                    {errors[
                                      `fields.${index}.null_percentage`
                                    ] ? (
                                      <>
                                        <Form.Control
                                          type="text"
                                          name={`fields.${index}.null_percentage`}
                                          placeholder="Blank"
                                          max={100}
                                          min={0}
                                          value={field.null_percentage}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          disabled={isSubmitting}
                                          isInvalid={
                                            !!errors[
                                              `fields.${index}.null_percentage`
                                            ]
                                          }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {
                                            errors[
                                              `fields.${index}.null_percentage`
                                            ]
                                          }
                                        </Form.Control.Feedback>
                                      </>
                                    ) : (
                                      <InputGroup>
                                        <Form.Control
                                          type="text"
                                          name={`fields.${index}.null_percentage`}
                                          placeholder="Blank"
                                          max={100}
                                          min={0}
                                          value={field.null_percentage}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          disabled={isSubmitting}
                                          isInvalid={
                                            !!errors[
                                              `fields.${index}.null_percentage`
                                            ]
                                          }
                                        />
                                        <InputGroup.Text>
                                          <FontAwesomeIcon icon={faPercent} />
                                        </InputGroup.Text>
                                      </InputGroup>
                                    )}
                                  </Form.Group>
                                </Col>
                                <Col sm={1} className="me-2">
                                  <Button
                                    variant="outline-dark"
                                    disabled={isSubmitting}
                                  >
                                    Formula
                                  </Button>
                                </Col>
                                <Col sm={1} className="mx-3">
                                  <Button
                                    variant="outline-none"
                                    onClick={() => {
                                      if (field.id !== undefined) {
                                        dispatch(
                                          deleteField({
                                            fieldID: field.id,
                                            schemaID: field.schema_id,
                                          })
                                        );
                                      }
                                      remove(index);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faX} />
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ))}

                        <div className="mt-3">
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() =>
                              // push({
                              //   code_type: "type_row_number",
                              //   name: "id",
                              //   schema_id: thisSchema.id,
                              //   null_percentage: 0,
                              //   name_type: "Row Number",
                              //   formula: "",
                              // })
                              dispatch(
                                createField({
                                  code_type: "type_row_number",
                                  name: "id",
                                  schema_id: thisSchema.id,
                                  null_percentage: 0,
                                  name_type: "Row Number",
                                  formula: "",
                                })
                              )
                            }
                            disabled={isSubmitting}
                          >
                            Add New Field
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </Container>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col>
                    <div className="mt-1 text-center ">
                      {/* <Button
                        className="mx-2"
                        variant="outline-secondary"
                        type="button"
                        disabled={isSubmitting}
                      >
                        Preview Data
                      </Button> */}
                      <Button
                        className="mx-2"
                        variant="outline-tertiary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting === true
                          ? t.button.loading
                          : "Save Schema"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Form>
        )}
      </Formik>

      <Footer />
    </>
  );
}

export default SchemaDetailPage;
