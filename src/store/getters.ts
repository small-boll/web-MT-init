//import { areaList_model_detail } from "@/model/behaviorAnalysis/integralRule_result_model";

export const getCount = (state: any): number => state.count;

/**获取token值 */
export const getToken = (state: any): string => state.token;
export const getUserinfo = (state: any): any => state.userinfo;
export const getPermissionMenu = (state: any): any => state.permissionMenu;
export const getPermissionBtn = (state: any): any => state.permissionBtn;
export const getLoadMenus = (state: any): any => state.loadMenus;

export const getHeaders = (state: any): any => state.headers;
export const getImgViewUrl = (state: any): any => state.imgViewUrl;//获取全局大图预览的url

export const getDict = (state: any): any => state.dict;//获取全局大图预览的url



export const getThemeName = (state: any): any => state.themeName;//获取系统主题

export const getColorName = (state: any): any => state.colorName;//获取系统主题