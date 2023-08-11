import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";

// import { selectTranslations } from "../../../store/slice/i18nSlice";
import {
  selectShowModalDeleteProject,
  updateShowModalDeleteProject,
  updateSelectedIdsProject,
  deleteProject,
} from "../../../store/slice/projectSlice";

export const DeleteProjectModal = () => {
  // const t = useSelector(selectTranslations);
  const showDeleteModal = useSelector(selectShowModalDeleteProject);

  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(updateSelectedIdsProject([]));
    dispatch(updateShowModalDeleteProject(false));
  };

  return (
    <Modal
      centered
      show={showDeleteModal}
      className="modal-normal"
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
    >
      <Modal.Header className="border-0 px-4">
        <Button variant="close" aria-label="Close" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="py-3 text-center pt-0">
          {/* <span className="modal-icon display-1">
              <XCircleIcon className="" />
            </span> */}

          <Modal.Title className="h1 my-3">Confirm deletion</Modal.Title>
          <p>Are you sure do you want to delete this task?</p>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center align-items-center">
        <Button
          variant="outline-danger"
          className="m-1"
          onClick={() => {
            dispatch(deleteProject());
            handleClose();
          }}
        >
          Delete Selected
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
      <div className="d-block d-sm-flex justify-content-center align-items-center mt-4"></div>
    </Modal>
  );
};
