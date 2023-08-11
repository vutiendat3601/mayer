import axios from "axios";
import { select } from "redux-saga/effects";
import { REQUEST } from "../../configs/appConfig";
import { selectTokenLogin } from "../slice/sessionSlice";

const axiosInstance = axios.create({
  method: "GET",
  baseURL: REQUEST.SERVER_HOST,
});

axiosInstance.interceptors.request.use((config) => {
  const { url, urlParams, ...rest } = config;
  if (!url || !urlParams) return config;

  return {
    url: Object.entries(urlParams).reduce((url, [k, v]) => {
      return url.replace(`#{${k}}`, encodeURIComponent(v));
    }, url),
    ...rest,
  };
});

export default function* httpSaga({
  api,
  urlParams,
  headers,
  params,
  data,
  onSuccess,
  onError,
  onFailure,
}) {
  try {
    const token = yield select(selectTokenLogin);
    if (token) {
      // inject authorization token
      headers = Object.assign({}, headers, {
        Authorization: `Bearer ${token}`,
      });
    }

    const axiosConfig = Object.assign({}, api, {
      urlParams,
      headers,
      params,
      data,
    });

    const response = yield axiosInstance.request(axiosConfig);
    const {
      data: { errors = [], ...responseData },
    } = response;

    if (errors.length > 0) {
      const errorObj = {};
      for (let i = 0; i < errors.length; i++) {
        const { code, reason } = errors[i];
        if (errorObj[reason] === undefined) {
          errorObj[reason] = [code];
        } else {
          errorObj[reason].push(code);
        }
      }

      yield onError &&
        onError(Object.assign({ errors: errorObj }, responseData), response);
    } else {
      yield onSuccess && onSuccess(responseData, response);
    }

    return response;
  } catch (error) {
    yield onFailure && onFailure(error);
  }
}
