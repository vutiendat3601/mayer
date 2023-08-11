import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectTotalPageProject,
  selectPageProject,
  getProjectList,
} from "../../../store/slice/projectSlice";

import { Pagination } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

export const ProjectPagination = (props) => {
  const dispatch = useDispatch();
  const total_page = useSelector(selectTotalPageProject);
  const page = useSelector(selectPageProject);

  const { totalPages = total_page, size = "md", disablePrev = false } = props;

  const onPrevItem = () => {
    const prevActiveItem = page === 1 ? page : page - 1;

    const params = {
      page: prevActiveItem,
    };

    // dispatch({ type: "GET_PROJECT_LIST", payload: params });
    dispatch(getProjectList(params));
  };

  const onNextItem = (totalPages) => {
    const nextActiveItem = page === totalPages ? page : page + 1;

    const params = {
      page: nextActiveItem,
    };

    dispatch(getProjectList(params));
    // dispatch({ type: "GET_PROJECT_LIST", payload: params });
  };

  const items = [];
  for (let number = 1; number <= totalPages; number++) {
    const isItemActive = page === number;

    const params = {
      page: number,
    };

    const handlePaginationChange = () => {
      dispatch(getProjectList(params));
      // dispatch({ type: "GET_PROJECT_LIST", payload: params });
    };

    items.push(
      <Pagination.Item
        active={isItemActive}
        key={number}
        onClick={handlePaginationChange}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination size={size} className="mt-3">
      <Pagination.Prev disabled={disablePrev} onClick={onPrevItem}>
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
      </Pagination.Prev>
      {items}
      <Pagination.Next onClick={() => onNextItem(totalPages)}>
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </Pagination.Next>
    </Pagination>
  );
};
