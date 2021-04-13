declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "socket.io-client";
declare module "vue-video-player";
declare module "video.js";
declare module "vue-picture-input";
declare module "animate.css";
declare module "qs";
declare module "echarts";
declare module "js-base64";
declare module "vuedraggable";
declare module "@riophae/vue-treeselect";
declare module "sortablejs";
declare module "vue-pdf";
declare module "js-cookie";
declare module 'avue-plugin-ueditor';
declare module 'avue-plugin-map';

declare module 'video.js';
declare module 'video.js/dist/lang/zh-CN.json';

declare module '*.png'
declare module '*.jpg'
declare module '*.gif'

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}

interface Window {
  AVUE: any;
  AMap: any;
  AMapUI: any;
  poiPicker: any;
}
