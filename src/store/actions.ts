import * as types from "./mutation-types";

export const addCountAction = ({ commit }: any) => commit(types.ADD_COUNT);

/**设置token */
export const setTokenAction = ({ commit }: any, data: any) =>
  commit(types.SET_TOKEN, data);

export const setUserinfoAction = ({ commit }: any, data: any) =>
  commit(types.SET_USERINFO, data);

export const setPermissionMenu = ({ commit }: any, data: any) =>
  commit(types.SET_PERMISIONMENU, data);

export const setPermissionBtn = ({ commit }: any, data: any) =>
  commit(types.SET_PERMISIONBTN, data);

export const setHeaders = ({ commit }: any, data: any) =>
  commit(types.SET_HEADERS, data);

export const setLoadMenus = ({ commit }: any, data: any) =>
  commit(types.SET_LOADMENUS, data);

export const setImgViewUrl = ({ commit }: any, data: any) =>
  commit(types.SET_IMGVIEWURL, data);


export const setDict = ({ commit }: any, data: any) =>
  commit(types.SET_DICT, data);

  export const setThemeName = ({ commit }: any, data: any) =>
  commit(types.SET_THEMENAME, data);

  export const setColorName = ({ commit }: any, data: any) =>
  commit(types.SET_COLORNAME, data);