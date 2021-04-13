import Vue from "vue";
import App from "./App.vue";
import router from "@/routes/router";
import store from "./store/store";
import i18n from "@/lang";
import "prismjs/themes/prism.css";
import "github-markdown-css";
 
/** ElementUI */
Vue.use(ElementUI, {
  i18n: (key: string, value: string) => i18n.t(key, value),
});

/**组件拖拽自定义指令 */
import "@/utils/v-dialogDrag";
// import "@/authorization/permission";
/**添加全局filters */
import "@/utils/filters";

/**element-ui */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI, { size: "small" });

/**全局样式 （reset，common，theme）*/
import "@/assets/css/style.scss";

// import highcharts from 'highcharts';
// Vue.prototype.$Highcharts = highcharts;

/**elementui-verify校验插件安装 */
// import elementUIVerify from 'element-ui-verify';
// Vue.use(elementUIVerify);

import "@/dataDeploy/fix/fixService";
import "@/dataDeploy/mock/mockService";
/**animate.css */
import animated from "animate.css";
//窗体v-if过渡动画
Vue.prototype.$animateEnter = "animated fadeInRightBig";
Vue.prototype.$animateLeave = "animated fadeOutRightBig";

Vue.use(animated);

// import { getPermissionBtn } from "@/utils/permissionBtn";
// Vue.prototype.permissionBtn = getPermissionBtn;
//Vue.use(getPermissionBtn as any);
// 引入Echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(echarts as any);

// 引入AVUE
import AvueFormDesign from "@/components/packages/";
import AvueUeditor from "avue-plugin-ueditor";
import AvueMap from "./components/packages/AvueMap/index";
// import AvueMap from 'avue-plugin-map';
// 从 avue-plugin-map 0.0.8 移植出来，为了解决打开预览时的此报错：
// Invalid prop: type check failed for prop "value". Expected Object, got String with value "".

Vue.use(window.AVUE);
Vue.use(AvueFormDesign);
Vue.use(AvueUeditor);
Vue.use(AvueMap);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
