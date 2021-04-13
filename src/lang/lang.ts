import Common from "./components/Common";
import login from "./components/login";
import layout from "./components/layout";
import MTeQuery from "./components/MTeQuery";

export default {
  en: {
    ...Common.en,
    ...login.en,
    ...layout.en,
    ...MTeQuery.en,
  },
  zh: {
    ...Common.zh,
    ...login.zh,
    ...layout.zh,
    ...MTeQuery.zh,
  },
  zh_tw: {
    ...Common.zh_tw,
    ...login.zh_tw,
    ...layout.zh_tw,
    ...MTeQuery.zh_tw,
  },
};
