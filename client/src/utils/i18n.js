import { langUrl } from "../configs/appConfig";

export function fetchTranslations(lang) {
  return new Promise((resolve) => {
    fetch(langUrl.replace("{lang}", lang))
      .then((response) => response.json())
      .then((data) => resolve(data));
  });
}
