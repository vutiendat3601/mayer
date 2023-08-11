/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";

import { Routes } from "../../configs/routes";
import { useDispatch, useSelector } from "react-redux";
import { setLangAsync } from "../../store/slice/i18nSlice";

// pages
import Project from "./ProjectPage";
import Schema from "./SchemaPage";
import SchemaDetail from "./SchemaDetailPage";
import Introduction from "./IntroductionPage";
import Signin from "./LoginPage";
import Signup from "./RegistrationPage";

// components
import RouteWithLoader from "../core/Preloader/RouteWithLoader";

export default function Loader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLangAsync("en"));
  }, [dispatch]);

  const i18nStatus = useSelector((state) => state.i18n.status);

  let element = useRoutes([
    {
      path: Routes.Introduction.path,
      element: <RouteWithLoader component={Introduction} />,
    },
    {
      path: Routes.Project.path,
      element: <RouteWithLoader component={Project} />,
    },
    {
      path: Routes.Schema.path,
      element: <RouteWithLoader component={Schema} />,
    },
    {
      path: Routes.SchemaDetail.path,
      element: <RouteWithLoader component={SchemaDetail} />,
    },
    {
      path: Routes.Signin.path,
      element: (
        <RouteWithLoader component={Signin} />
      ),
    },
    {
      path: Routes.Signup.path,
      element: <RouteWithLoader component={Signup} />,
    },
  ]);

  if (i18nStatus === "idle") {
    return element;
  }
}
