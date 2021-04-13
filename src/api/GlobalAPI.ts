import { LoginAPIS } from "./LoginAPIS";
import { CommonAPIS } from "./CommonAPIS";
import { SocketIoAPIS } from "./SocketIoAPIS";

/**
 * 全局访问接口
 */
export const GlobalAPI = {
  /**
   * 公共API（字典，上传）
   **/
  CommonAPIS,

  /**
   * 登录模块 
   **/
  LoginAPIS,

  SocketIoAPIS
};
