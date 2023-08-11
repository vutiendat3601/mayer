// Request configs
const REQUEST = {
  SERVER_HOST: "http://localhost:4001/",
};

const PAGE_DEFAULT = 1;

const PAGE_SIZE_DEFAULT = 5;

const TOTAL_PAGE = 0;

export const defaultLang = "en";

export const supportedLangs = {
  en: "English",
  vi: "Việt Nam",
};

export const langUrl = "/language/{lang}.json";

export const typeUrl = "/type/{lang}.json";

export { REQUEST, PAGE_DEFAULT, PAGE_SIZE_DEFAULT, TOTAL_PAGE };
