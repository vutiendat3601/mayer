import { typeUrl } from "../configs/appConfig";

export function fetchTypeOfField(lang) {
  return new Promise((resolve) => {
    fetch(typeUrl.replace("{lang}", lang))
      .then((response) => response.json())
      .then((data) => resolve(data));
  });
}
