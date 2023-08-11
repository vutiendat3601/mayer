/* eslint-disable import/no-anonymous-default-export */
export default {
  LOG_IN: {
    url: "/api/v1/sign_in",
    method: "POST",
  },
  LOG_OUT: {
    url: "/api/v1/sign_out",
    method: "POST",
  },
  REGISTRATION: {
    url: "/api/v1/sign_up",
    method: "POST",
  },
  GET_LIST_PROJECTS: {
    url: "/api/v1/projects",
    method: "GET",
  },
  GET_PROJECT: {
    url: "/api/v1/projects",
    method: "GET",
  },
  CREATE_PROJECT: {
    url: "/api/v1/projects",
    method: "POST",
  },
  UPDATE_PROJECT: {
    url: "/api/v1/projects",
    method: "PUT",
  },
  DELETE_PROJECT: {
    url: "/api/v1/projects",
    method: "DELETE",
  },
  GET_LIST_SCHEMAS: {
    url: "/api/v1/schemas",
    method: "GET",
  },
  GET_SCHEMA: {
    url: "/api/v1/schemas/#{id}",
    method: "GET",
  },
  CREATE_SCHEMA: {
    url: "/api/v1/schemas",
    method: "POST",
  },
  UPDATE_SCHEMA: {
    url: "/api/v1/schemas/#{id}",
    method: "PUT",
  },
  DELETE_SCHEMA: {
    url: "/api/v1/schemas",
    method: "DELETE",
  },
  GET_FIELD_LIST: {
    url: "/api/v1/fields",
    method: "GET",
  },
  GET_FIELD: {
    url: "/api/v1/fields/#{id}",
    method: "GET",
  },
  CREATE_FIELD: {
    url: "/api/v1/fields",
    method: "POST",
  },
  UPDATE_FIELD: {
    url: "/api/v1/fields/#{id}",
    method: "PUT",
  },
  DELETE_FIELD: {
    url: "/api/v1/fields",
    method: "DELETE",
  },
};
