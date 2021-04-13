import * as types from "./mutation-types";

export default {
  [types.ADD_COUNT](state: any) {
    state.count++;
  },

  /**获取token值 */
  [types.SET_TOKEN](state: any, data: any) {
    state.token = data;
  },

  [types.SET_USERINFO](state: any, data: any) {
    state.userinfo = data;
  },

  [types.SET_PERMISIONMENU](state: any, data: any) {
    state.permissionMenu = data;
  },
  [types.SET_PERMISIONBTN](state: any, data: any) {
    state.permissionBtn = data;
  },
  [types.SET_HEADERS](state: any, data: any) {
    state.headers = data;
  },
  [types.SET_LOADMENUS](state: any, data: any) {
    state.loadMenus = data;
  },
  [types.SET_IMGVIEWURL](state: any, data: any) {
    state.imgViewUrl = data;
  },
  [types.SET_DICT](state: any, data: any) {
    state.dict = data;
  },
  [types.SET_THEMENAME](state: any, data: any) {
    state.themeName = data;
    localStorage.setItem('themeName',data);
    document.body.className = data;
  },
  [types.SET_COLORNAME](state: any, data: any) {
    state.colorName = data;
    localStorage.setItem('colorName',data);
  }
};
