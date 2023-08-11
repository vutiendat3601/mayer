import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

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
import { ProjectPagination } from "../Pagination/ProjectPagination";
import { CreateProjectModal } from "../Modal/CreateProjectModal";
import { DeleteProjectModal } from "../Modal/DeleteProjectModal";
import { UpdateProjectModal } from "../Modal/UpdateProjectModal";

import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  selectDataProject,
  selectSelectedIdsProject,
  updateShowModalCreateProject,
  updateShowModalDeleteProject,
  updateSelectedIdsProject,
  updateSelectedIdProject,
  removeSelectedIdProject,
  getProjectList,
  getProject,
} from "../../../store/slice/projectSlice";
import { selectTokenLogin } from "../../../store/slice/sessionSlice";

export default function TableProject() {
  const t = useSelector(selectTranslations);
  const tokenRedux = useSelector(selectTokenLogin);

  const dispatch = useDispatch();
  useEffect(() => {
    if (tokenRedux) {
      dispatch(getProjectList());
    }
  }, [dispatch, tokenRedux]);

  const projects = useSelector(selectDataProject);
  const selectedId = useSelector(selectSelectedIdsProject);

  const getIDProjectDelete = (event, item) => {
    if (event.target.checked) {
      dispatch(updateSelectedIdProject(item));
    } else {
      dispatch(removeSelectedIdProject(item));
    }
  };

  const getCheckAllId = (event) => {
    if (event.target.checked) {
      dispatch(updateSelectedIdsProject([]));
      projects.forEach((data) => dispatch(updateSelectedIdProject(data.id)));
    } else {
      dispatch(updateSelectedIdsProject([]));
    }
  };

  const getIDProjectUpdate = (event, id) => {
    if (event.target.onclick) {
      dispatch(getProject(id));
    }
  };

  const getIDProjectDeleteOne = (id) => {
    dispatch(updateSelectedIdProject(id));
    handleOpenDeleteModal();
  };

  const handleOpenCreateModal = () =>
    dispatch(updateShowModalCreateProject(true));
  const handleOpenDeleteModal = () =>
    dispatch(updateShowModalDeleteProject(true));

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
              onChange={(e) => getIDProjectDelete(e, id)}
            />
          </Form>
        </td>
        <td colSpan={5}>
          <span className="fw-normal">{name}</span>
        </td>
        <td colSpan={4}>
          <span className="fw-normal">{inserted_at.slice(0, 10)}</span>
        </td>
        <td className="w-0 text-center">
          <Button
            bsPrefix="text"
            href="#"
            variant="info"
            className="m-0"
            onClick={(e) => {
              getIDProjectUpdate(e, id);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="me-0" /> {t.button.update}
          </Button>
          <UpdateProjectModal />
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
          <DeleteProjectModal />
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
              <FontAwesomeIcon icon={faAdd} className="me-0" />{" "}
              {t.button.create_project}
            </Button>
            <CreateProjectModal />

            {Array.isArray(projects) && projects.length > 0 && (
              <Button
                variant="outline-danger"
                className="m-1"
                onClick={handleOpenDeleteModal}
                disabled={Array.isArray(selectedId) && !selectedId.length}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="me-0" />{" "}
                {t.button.remove_project}
              </Button>
            )}
            <DeleteProjectModal />
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
                      selectedId.length === projects.length
                    }
                    onChange={(e) => getCheckAllId(e)}
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
            {Array.isArray(projects) &&
              projects.map((p) => <TableRow key={`project-${p.id}`} {...p} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            {Array.isArray(projects) && projects.length > 0 && (
              <ProjectPagination withIcons />
            )}
          </Nav>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
}
