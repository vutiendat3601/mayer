import React from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Button, Modal } from "react-bootstrap";

import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  selectShowModalUpdateProject,
  updateShowModalUpdateProject,
  selectSelectedUpdateProject,
  updateSelectedProject,
  updateProject,
} from "../../../store/slice/projectSlice";

export const UpdateProjectModal = () => {
  const t = useSelector(selectTranslations);
  const showUpdateModal = useSelector(selectShowModalUpdateProject);
  const projectUpdate = useSelector(selectSelectedUpdateProject);

  const dispatch = useDispatch();
  const handleCloseUpdateModal = () => {
    dispatch(updateSelectedProject(undefined));
    dispatch(updateShowModalUpdateProject(false));
  };

  return (
    <Modal
      centered
      show={showUpdateModal}
      onHide={handleCloseUpdateModal}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
    >
      <Modal.Header className="border-0 px-4">
        <Button
          variant="close"
          aria-label="Close"
          onClick={handleCloseUpdateModal}
        />
      </Modal.Header>
      <Modal.Body className="p-0">
        <Formik
          initialValues={{
            name:
              projectUpdate !== undefined && projectUpdate.name !== undefined
                ? projectUpdate.name
                : "",
          }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = t.message.required;
            }  else if (!/^[^-\s][a-zA-Z0-9_\s-]+$/i.test(values.name)) {
              errors.name = "Invalid format name of project";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const { name } = values;

            dispatch(updateProject({ name: name, setSubmitting }));
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
            <Card className="px-0 px-md-4 py-0 border-0">
              <Card.Header className="border-0 text-center text-md-center mb-0 mt-md-0 p-0">
                <h4>{t.project.create_project}</h4>
              </Card.Header>
              <Card.Body>
                <Form href="" onSubmit={handleSubmit}>
                  <Form.Group id="exampleInputEmailCard1" className="mb-4">
                    <Form.Label>{t.label.name_project}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Update Name Project"
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
                        : "Update Project"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <div className="d-block d-sm-flex justify-content-center align-items-center mt-2"></div>
      </Modal.Footer>
    </Modal>
  );
};
