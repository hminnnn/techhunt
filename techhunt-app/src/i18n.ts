import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/translation.json";
import translationZH from "./locales/zh/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    supportedLngs: ["en"],
    // lng: "cn",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const i18n_detectLang = () => {
  // language check
  const supportedLangs = i18n.options.supportedLngs || [];
  const userLang = navigator.language;
  const langDetected = userLang.split("-")[0];
  if (!supportedLangs.includes(langDetected)) {
    return false;
  } else {
    i18n.changeLanguage(langDetected);
    return true;
  }
};

export default i18n;
