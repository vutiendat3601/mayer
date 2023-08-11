import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Tab,
  InputGroup,
  Form,
  Button,
  ListGroup,
  Col,
  Container,
  Modal,
} from "@themesberg/react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  selectShowModalType,
  updateShowModalType,
  selectTypes,
  getTypesAsync,
} from "../../../store/slice/typeSlice";
import { selectSelectedField } from "../../../store/slice/fieldSlice";

export const ChooseTypeModal = () => {
  const dispatch = useDispatch();

  const t = useSelector(selectTranslations);

  // selected type
  const selectedField = useSelector(selectSelectedField);
  console.log(selectedField);

  const showModal = useSelector(selectShowModalType);
  const handleCloseModal = () => dispatch(updateShowModalType(false));

  const [q, setQ] = useState("");
  const [searchTerm] = useState(["name_type"]);
  function search(items) {
    return items.filter((item) => {
      return searchTerm.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  }

  const [birthday, setBirthday] = useState("");

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: "rgba(35, 49, 86, 0.8)",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  const CustomScrollbars = (props) => (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      {...props}
    />
  );

  // handle get types
  useEffect(() => {
    dispatch(getTypesAsync("en"));
  }, [dispatch]);
  const types = useSelector(selectTypes);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name_type: selectedField.name_type || "",
          code_type: selectedField.code_type || "",
          option_from: selectedField.option_from || "",
          option_to: selectedField.option_to || "",
          option_min: selectedField.option_min || "",
          option_max: selectedField.option_max || "",
          option_format: selectedField.option_format || "",
          option_decimals: selectedField.option_decimals || "",
          option_schema_name: selectedField.option_schema_name || "",
          option_field_name: selectedField.option_field_name || "",
          option_custom: selectedField.option_custom || "",
        }}
        validate={(values) => {
          const errors = {};

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const {
            name_type,
            code_type,
            option_from,
            option_to,
            option_min,
            option_max,
            option_format,
            option_decimals,
            option_schema_name,
            option_field_name,
            option_custom,
          } = values;

          console.log("Value", values);
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
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              dialogClassName="modal-90w"
              centered
              aria-labelledby="example-custom-modal-styling-title"
            >
              <Modal.Header closeButton className="border-1 m-0 px-4">
                <Modal.Title id="example-custom-modal-styling-title">
                  Choose Type Of Field
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tab.Container
                  id="list-group-tabs-example"
                  defaultActiveKey={`#${selectedField.code_type}`}
                >
                  <Container>
                    <Row>
                      <Col xs={12} md={6}>
                        <Row>
                          <Col xs={12} md={8}>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Search Type</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Search..."
                                defaultValue={q}
                                onChange={(e) => setQ(e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={8}>
                            <CustomScrollbars
                              style={{ height: 480 }}
                              autoHide
                              autoHideTimeout={500}
                              autoHideDuration={200}
                            >
                              <ListGroup className="mx-2">
                                {search(types).map((val, key) => {
                                  return (
                                    <ListGroup.Item
                                      action
                                      href={`#${val.code_type}`}
                                      key={`#type${key + 1}`}
                                    >
                                      {val.name_type}
                                    </ListGroup.Item>
                                  );
                                })}
                              </ListGroup>
                            </CustomScrollbars>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} md={6}>
                        <Row>
                          <Col xs={12} md={12} className="border-1">
                            <Tab.Content>
                              {types.map((val, key) => {
                                return (
                                  <Tab.Pane
                                    key={`#type${key + 1}}`}
                                    eventKey={`#${val.code_type}`}
                                  >
                                    <h5>{val.name_type}</h5>
                                    <p>{val.description}</p>
                                    <Col xs={12} md={8}>
                                      {val.code_type === "type_date_time" &&
                                      val.option_from ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>From</Form.Label>
                                          <Datetime
                                            timeFormat={false}
                                            closeOnSelect={true}
                                            onChange={setBirthday}
                                            renderInput={(
                                              props,
                                              openCalendar
                                            ) => (
                                              <InputGroup>
                                                <InputGroup.Text>
                                                  <FontAwesomeIcon
                                                    icon={faCalendarAlt}
                                                  />
                                                </InputGroup.Text>
                                                <Form.Control
                                                  required
                                                  type="text"
                                                  name="option_from"
                                                  value={
                                                    values.option_from
                                                      ? moment(
                                                          values.option_from
                                                        ).format("DD/MM/YYYY")
                                                      : ""
                                                  }
                                                  placeholder="mm/dd/yyyy"
                                                  onFocus={openCalendar}
                                                  onChange={(e) => {
                                                    console.log("Test");
                                                    e.preventDefault();
                                                    handleChange();
                                                  }}
                                                />
                                              </InputGroup>
                                            )}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.code_type !== "type_date_time" &&
                                      val.option_from ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>From</Form.Label>
                                          <Form.Control
                                            type="text"
                                            defaultValue={val.option_from}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.code_type === "type_date_time" &&
                                      val.option_to ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>To</Form.Label>
                                          <Datetime
                                            timeFormat={false}
                                            closeOnSelect={true}
                                            name="option_to"
                                            onChange={handleChange}
                                            renderInput={(
                                              props,
                                              openCalendar
                                            ) => (
                                              <InputGroup>
                                                <InputGroup.Text>
                                                  <FontAwesomeIcon
                                                    icon={faCalendarAlt}
                                                  />
                                                </InputGroup.Text>
                                                <Form.Control
                                                  required
                                                  type="text"
                                                  name="option_to"
                                                  value={
                                                    values.option_to
                                                      ? moment(
                                                          values.option_to
                                                        ).format("DD/MM/YYYY")
                                                      : ""
                                                  }
                                                  placeholder="mm/dd/yyyy"
                                                  onFocus={openCalendar}
                                                  onChange={handleChange}
                                                />
                                              </InputGroup>
                                            )}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.code_type !== "type_date_time" &&
                                      val.option_to ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>To</Form.Label>
                                          <Form.Control
                                            type="text"
                                            defaultValue={val.to}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.option_min ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>Min</Form.Label>
                                          <Form.Control
                                            type="text"
                                            defaultValue={val.min}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.option_max ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>Max</Form.Label>
                                          <Form.Control
                                            type="text"
                                            defaultValue={val.max}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.option_format ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>Format</Form.Label>
                                          <Form.Select>
                                            <option defaultValue>
                                              Open this select menu
                                            </option>
                                            {val.option_format.map(
                                              (item, index) => (
                                                <option
                                                  key={item + index}
                                                  value={item}
                                                >
                                                  {item}
                                                </option>
                                              )
                                            )}
                                          </Form.Select>
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.option_decimals ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>Decimals</Form.Label>
                                          <Form.Control
                                            type="text"
                                            defaultValue={val.decimals}
                                          />
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.option_name_schema ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>Select Schema</Form.Label>
                                          <Form.Select>
                                            <option defaultValue>
                                              Open this select menu
                                            </option>
                                            {val.option_name_schema.map(
                                              (item, index) => (
                                                <option
                                                  key={item + index}
                                                  value={item}
                                                >
                                                  {item}
                                                </option>
                                              )
                                            )}
                                          </Form.Select>
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                      {val.option_name_field ? (
                                        <Form.Group className="mb-3">
                                          <Form.Label>Select Field</Form.Label>
                                          <Form.Select>
                                            <option defaultValue>
                                              Open this select menu
                                            </option>
                                            {val.option_name_field.map(
                                              (item, index) => (
                                                <option
                                                  key={item + index}
                                                  value={item}
                                                >
                                                  {item}
                                                </option>
                                              )
                                            )}
                                          </Form.Select>
                                        </Form.Group>
                                      ) : (
                                        <></>
                                      )}
                                    </Col>
                                  </Tab.Pane>
                                );
                              })}
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </Tab.Container>
              </Modal.Body>
              <Modal.Footer className="border-1">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Choose Type
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  );
};
