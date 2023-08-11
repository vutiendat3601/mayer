/* eslint-disable import/no-anonymous-default-export */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { selectTokenLogin, signOut } from "../../../store/slice/sessionSlice";
import { Routes } from "../../../configs/routes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Nav, Image, Dropdown, Button } from "@themesberg/react-bootstrap";

import Profile from "../../../assets/img/profile-cover.jpg";

function AccountSetting(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tokenRedux = useSelector(selectTokenLogin);

  if (tokenRedux) {
    return (
      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link} className="pt-1 px-4">
          <div className="media d-flex align-items-center">
            <Image
              src={Profile}
              className="user-avatar md-avatar rounded-circle"
            />
            <div className="media-body ms-2 text-light align-items-center d-none d-lg-block">
              <span className="mb-0 font-small fw-bold">Bonnie Green</span>
            </div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
          <Dropdown.Item
            className="fw-bold text-dark"
            as={Link}
            to={Routes.Account.path}
          >
            <FontAwesomeIcon icon={faUserCircle} className="me-2" /> My Account
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item
            className="fw-bold text-dark"
            as={Link}
            to={Routes.Project.path}
            onClick={() => {
              dispatch(signOut());
              navigate(Routes.Introduction.path, { replace: true });
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" />{" "}
            Logout{" "}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  } else {
    return (
      <Button
        as={Link}
        to={Routes.Signin.path}
        variant="outline-white"
        className="ms-3"
      >
        {" "}
        Login{" "}
      </Button>
    );
  }
}

export default AccountSetting;
