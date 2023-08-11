/* eslint-disable no-unreachable */
import axios from "axios";

import { REQUEST } from "../configs/appConfig";
import { getSessionItem } from "./storageHelper";

export function authHeader() {
  const token = getSessionItem("accountToken");

  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}

const instance = axios.create({
  method: "GET",
  baseURL: REQUEST.SERVER_HOST,
  headers: authHeader(),
});

instance.interceptors.response.use(
  function (response) {
    const res = response.data;
    let obj = {};

    if (res.errors && Array.isArray(res.errors)) {
      if (res.errors.length > 0) {
        for (let i = 0; i < res.errors.length; i++) {
          const { code, reason } = res.errors[i];
          if (obj[reason] === undefined) {
            obj[reason] = [code];
          } else {
            obj[reason].push(code);
          }
        }

        response.data.errors = obj;
      }
    }

    // if (res.data && Array.isArray(res.data)) {
    //   if (res.data.length > 0) {
    //     for (let i = 0; i < res.data.length; i++) {
    //       const data = res.data[i];

    //       if (obj[i] === undefined) {
    //         obj[i] = data;
    //       } else {
    //         obj[i].push(data);
    //       }
    //     }

    //     response.data.data = obj;
    //   }
    // }

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// export function* createApi({ api }) {
//   const response = yield instance.request(api);

//   return response;
// }

export function createApi({ api }) {
  return instance.request(api);
}
