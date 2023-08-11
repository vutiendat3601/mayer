import React from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Button, Modal } from "react-bootstrap";

import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  selectShowModalCreateProject,
  updateShowModalCreateProject,
  createProject,
} from "../../../store/slice/projectSlice";

export const CreateProjectModal = () => {
  const t = useSelector(selectTranslations);
  const showCreateModal = useSelector(selectShowModalCreateProject);
  const dispatch = useDispatch();
  const handleCloseCreateModal = () =>
    dispatch(updateShowModalCreateProject(false));

  return (
    <Modal
      centered
      show={showCreateModal}
      onHide={handleCloseCreateModal}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
    >
      <Modal.Header className="border-0 m-0 px-4">
        <Button
          variant="close"
          aria-label="Close"
          onClick={handleCloseCreateModal}
        />
      </Modal.Header>
      <Modal.Body className="p-0">
        <Formik
          initialValues={{ name: "" }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = t.message.required;
            }  else if (!/^[^-\s][a-zA-Z0-9_\s-]+$/i.test(values.name)) {
              errors.name = "Invalid format name of schema";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const { name } = values;
            dispatch(createProject({ name: name, setSubmitting }));
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
            <Card className="px-md-4 border-0">
              <Card.Header className="border-0 text-center text-md-center mb-0 mt-md-0 p-0">
                <h4>{t.project.create_project}</h4>
              </Card.Header>
              <Card.Body>
                <Form href="" onSubmit={handleSubmit}>
                  <Form.Group id="exampleInputEmailCard1" className="mb-3">
                    <Form.Label className="mb-3">
                      {t.label.name_project}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="New Project"
                      isInvalid={!!errors.name && touched.name}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name && touched.name && errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="gray-800"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting === true
                        ? t.button.loading
                        : t.button.create_project}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <div className="d-block d-sm-flex justify-content-center align-items-center mt-0"></div>
      </Modal.Footer>
    </Modal>
  );
};
