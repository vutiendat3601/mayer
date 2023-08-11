import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faAdd } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Table,
  Nav,
  Form,
  Button,
  Container,
  Row,
  Col,
} from "@themesberg/react-bootstrap";
import { SchemaPagination } from "../Pagination/SchemaPagination";
import { CreateSchemaModal } from "../Modal/CreateSchemaModal";
import { DeleteSchemaModal } from "../Modal/DeleteSchemaModal";

import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  // action api
  getListSchema,
  // action select
  selectDataSchema,
  selectSelectedIdsSchema,
  //orther action
  updateSelectedIdsSchema,
  addSelectedIdSchema,
  removeSelectedIdSchema,
  updateShowModalCreateSchema,
  updateShowModalDeleteSchema,
} from "../../../store/slice/schemaSlice";
import { selectTokenLogin } from "../../../store/slice/sessionSlice";

export function SchemaTable() {
  const dispatch = useDispatch();

  const t = useSelector(selectTranslations);
  const tokenRedux = useSelector(selectTokenLogin);

  useEffect(() => {
    if (tokenRedux) {
      dispatch(getListSchema());
    }
  }, [dispatch, tokenRedux]);

  const schemas = useSelector(selectDataSchema);
  const selectedId = useSelector(selectSelectedIdsSchema);

  const handelCheckBoxId = (event) => {
    if (event.target.checked) {
      dispatch(addSelectedIdSchema(parseInt(event.target.id, 10)));
    } else {
      dispatch(removeSelectedIdSchema(parseInt(event.target.id, 10)));
    }
  };

  const handleCheckBoxAllIds = (event) => {
    if (event.target.checked) {
      dispatch(updateSelectedIdsSchema([]));
      schemas.forEach((data) => dispatch(addSelectedIdSchema(data.id)));
    } else {
      dispatch(updateSelectedIdsSchema([]));
    }
  };

  const handleOpenCreateModal = () =>
    dispatch(updateShowModalCreateSchema(true));
  const handleOpenDeleteModal = () =>
    dispatch(updateShowModalDeleteSchema(true));

  const getIDProjectDeleteOne = (id) => {
    dispatch(updateSelectedIdsSchema([]));
    dispatch(addSelectedIdSchema(id));
    handleOpenDeleteModal();
  };

  const TableRow = (props) => {
    const { id, name, inserted_at } = props;

    return (
      <tr>
        <td>
          <Form>
            <Form.Check
              id={id}
              htmlFor={id}
              checked={selectedId.find((temp) => temp === id)}
              onChange={(e) => handelCheckBoxId(e)}
            />
          </Form>
        </td>
        <td colSpan={5}>
          <Link to={`/schema/${id}`}>{name}</Link>
        </td>
        <td colSpan={4}>
          <span className="fw-normal">{inserted_at.slice(0, 10)}</span>
        </td>
        <td className="w-0 text-center">
          <Button
            as={Link}
            to={`/schema/${id}`}
            bsPrefix="text"
            href=""
            variant="info"
            className="m-0"
          >
            <FontAwesomeIcon icon={faEdit} className="me-0" /> {t.button.update}
          </Button>
          <Button
            bsPrefix="text"
            href="#"
            variant="danger"
            className="m-3 "
            onClick={() => {
              getIDProjectDeleteOne(id);
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} className="me-0" />{" "}
            {t.button.remove}
          </Button>
          <DeleteSchemaModal />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Container className="table-settings mb-3 mt-3">
        <Row className="justify-content-between align-items-center">
          <Col xs={8} md={6}>
            <Button
              variant="outline-success"
              className="m-1"
              onClick={handleOpenCreateModal}
            >
              <FontAwesomeIcon icon={faAdd} className="me-0" /> Create Schema
            </Button>
            <CreateSchemaModal />
            {Array.isArray(schemas) && schemas.length > 0 && (
              <Button
                variant="outline-danger"
                className="m-1"
                onClick={handleOpenDeleteModal}
                disabled={Array.isArray(selectedId) && !selectedId.length}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="me-0" /> Remove
                Schema
              </Button>
            )}
            <DeleteSchemaModal />
          </Col>
        </Row>
      </Container>

      <Card.Body className="pt-0">
        <Table
          hover
          className="user-table align-items-center"
          striped="columns"
        >
          <thead>
            <tr>
              <th className="border-bottom">
                <Form>
                  <Form.Check
                    id="all"
                    htmlFor="all"
                    checked={
                      selectedId.length !== 0 &&
                      selectedId.length === schemas.length
                    }
                    onChange={(e) => handleCheckBoxAllIds(e)}
                  />
                </Form>
              </th>
              <th className="border-bottom" colSpan={5}>
                {t.project.table.name_project}
              </th>
              <th className="border-bottom" colSpan={4}>
                {t.project.table.created_date}
              </th>
              <th className="border-bottom" colSpan={1}></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(schemas) &&
              schemas.map((p) => <TableRow key={`project-${p.id}`} {...p} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            {Array.isArray(schemas) && schemas.length > 0 && (
              <SchemaPagination withIcons />
            )}
          </Nav>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
}
