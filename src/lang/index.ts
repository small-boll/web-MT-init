import Vue from "vue";
import VueI18n from "vue-i18n";

import { getLanguage } from "@/utils/cookies";

// element-ui built-in lang
import elementEnLocale from "element-ui/lib/locale/lang/en";
import elementZhLocale from "element-ui/lib/locale/lang/zh-CN";
import elementZhTwLocale from "element-ui/lib/locale/lang/zh-TW"

// User defined lang
import lang from "./lang";

Vue.use(VueI18n);

/** 繁体放在简体前，避免覆盖 */
const messages = {
  en: {
    ...lang.en,
    ...elementEnLocale,
  },
  zh_tw: {
    ...lang.zh_tw,
    ...elementZhTwLocale
  },
  zh: {
    ...lang.zh,
    ...elementZhLocale,
  },
};

export const getLocale = () => {
  const cookieLanguage = getLanguage();
  if (cookieLanguage) {
    return cookieLanguage;
  }

  // 获取浏览器语言
  var language = navigator.language.toLowerCase();
  // 繁体 浏览器 zh-tw
  if (language === 'zh-tw') {
    language = language.split('-').join('_');
  }
  console.log(language);
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      console.log(locale);
      return locale;
    }
  }

  // Default language is english
  return "en";
};

const i18n = new VueI18n({
  locale: getLocale(),
  messages,
});

export default i18n;
