/**
 * 登录模块
 */
const LoginAPIS = {
  /**
   * 登录
   */
  mThanos_login_api: {
    baseUrl: "mtHttpUrl",
    url: "/authority/login",
    method: "post",
  },

  /**
   * 获取验证码
   */
  mThanos_getCaptcha_api: {
    baseUrl: "mtHttpUrl",
    url: "/authority/captcha",
    method: "get",
  },
  /**
   * 获取用户信息
   */
  mThanos_getAuthInfo_api: {
    baseUrl: "mtHttpUrl",
    url: "/authority/getAuthInfoByname",
    method: "get",
  },
  /**
   * 获取用户退出
   */
  mThanos_loginOut_api: {
    baseUrl: "mtHttpUrl",
    url: "/authority/loginOut",
    method: "post",
  },
  /**
   * 获取用户退出
   */
  mThanos_updatePassWord_api: {
    baseUrl: "mtHttpUrl",
    url: "/authority/updatePassWord",
    method: "post",
  },
};

export { LoginAPIS };
