import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Toast, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBootstrap } from "@fortawesome/free-brands-svg-icons";

export const ToastMessage = forwardRef((props, ref) => {
  const [showTertiary, setShowTertiary] = useState(false);
  const handleCloseTertiary = () => setShowTertiary(false);

  useImperativeHandle(ref, () => ({
    show() {
      setShowTertiary(true);
      setTimeout(() => {
        setShowTertiary(false);
      }, 3000);
    },
  }));
  return (
    <Toast
      id={showTertiary ? "show" : "hide"}
      show={showTertiary}
      onClose={handleCloseTertiary}
      className="bg-secondary text-white my-3"
    >
      <Toast.Header className="text-primary" closeButton={false}>
        <FontAwesomeIcon icon={faBootstrap} />
        <strong className="me-auto ms-2">Mayer</strong>
        <small>11 mins ago</small>
        <Button variant="close" size="xs" onClick={handleCloseTertiary} />
      </Toast.Header>
      <Toast.Body>{props.message}</Toast.Body>
    </Toast>
  );
});
