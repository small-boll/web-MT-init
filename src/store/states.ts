import loadMenus from "@/routes/addRouter";

//import { areaList_model_detail } from "@/model/behaviorAnalysis/integralRule_result_model";

export default {
  /**
   * 全局http请求token
   */
  token: "",

  /**
   * 登录后用户信息
   */
  userinfo: null,

  /**
   * 权限菜单
   */
  permissionMenu: null,

  /**
   * 权限按钮
   */
  permissionBtn: null,

  /**
   * 初始化socket.io默认生成的客户端唯一guid
   */
  socketioClientId: "",

  /**头部参数 */
  headers: null,

  /**是否已加载菜单 */
  loadMenus: false,

  /**全局大图预览url */
  imgViewUrl: { imgSrc: "", previewSrc: "" },

  dict: null,

  /**系统主题 */
  themeName: localStorage.getItem('themeName') || 'theme-default',
  /**系统颜色 */
  colorName: localStorage.getItem('colorName') || '#409EFF',

};
