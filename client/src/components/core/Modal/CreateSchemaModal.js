import React, { useCallback, useEffect } from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Button, Modal } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";

import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  selectShowModalCreateSchema,
  selectSelectedSchema,
  selectIsCreateSchema,
  updateShowModalCreateSchema,
  createSchema,
} from "../../../store/slice/schemaSlice";
import {
  selectIsLoading,
  selectOptions,
  updateIsLoading,
  getProjectList,
} from "../../../store/slice/projectSlice";

export const CreateSchemaModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCreateSchema = useSelector(selectIsCreateSchema);
  const selectedSchema = useSelector(selectSelectedSchema);
  useEffect(() => {
    if (isCreateSchema) {
      navigate(`/schema/${selectedSchema.id}`);
    }
  }, [isCreateSchema, navigate, selectedSchema.id]);

  const t = useSelector(selectTranslations);
  const showCreateModal = useSelector(selectShowModalCreateSchema);

  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);
  const options = useSelector(selectOptions);

  const handleCloseCreateModal = () =>
    dispatch(updateShowModalCreateSchema(false));

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

  const filterBy = () => true;

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
          initialValues={{ name: "", projectID: "" }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = t.message.required;
            } else if (!/^[^-\s][a-zA-Z0-9_\s-]+$/i.test(values.name)) {
              errors.name = "Invalid format name of schema";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const { name, projectID } = values;
            dispatch(
              createSchema({ name: name, projectID: projectID, setSubmitting })
            );
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
            <Card className="px-md-4 border-0">
              <Card.Header className="border-0 text-center text-md-center mb-0 mt-md-0 p-0">
                <h4>Create Schema</h4>
              </Card.Header>
              <Card.Body>
                <Form href="" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="mb-3">Name Schema</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="New Schema"
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

                  <Form.Group className="mb-3">
                    <Form.Label>Select Project</Form.Label>
                    <AsyncTypeahead
                      filterBy={filterBy}
                      id="async-pagination-example"
                      isLoading={isLoading}
                      options={options}
                      labelKey="name"
                      maxResults={10}
                      minLength={1}
                      onSearch={handleSearch}
                      defaultSelected={["Select Project"]}
                      renderMenuItemChildren={(option) => option.name}
                      onChange={(selected) => {
                        const value = selected.length > 0 ? selected[0].id : "";
                        setFieldValue("projectID", value);
                      }}
                      onBlur={(e) => setFieldTouched("projectID", true)}
                    />
                  </Form.Group>

                  <div className="d-grid mt-3">
                    <Button
                      variant="gray-800"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting === true
                        ? t.button.loading
                        : "Create Schema"}
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
