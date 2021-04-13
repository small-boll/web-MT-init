import { login_par_model } from "@/model/sysManage/login_result_model.ts";
import { GlobalAPI } from "@/api/GlobalAPI";
import { httpAsync } from "@/network/axiosHelper.ts";
import { mtConsole } from "@/utils/mtConsole";

export class loginNetwork {
  /**
   * 构造函数
   */
  public constructor() { }

  /**
   * 登录接口入参
   * @param params 入参
   */
  public async login(params: login_par_model) {
    const resultData: any = await httpAsync(
      GlobalAPI.LoginAPIS.mThanos_login_api.baseUrl,
      GlobalAPI.LoginAPIS.mThanos_login_api.url,
      GlobalAPI.LoginAPIS.mThanos_login_api.method,
      params
    );
    return resultData;
  }

  /**
   * 获取验证码
   * @param params 入参
   */
  public async getCaptcha(params: login_par_model) {
    //debugger;
    const resultData: any = await httpAsync(
      GlobalAPI.LoginAPIS.mThanos_getCaptcha_api.baseUrl,
      GlobalAPI.LoginAPIS.mThanos_getCaptcha_api.url,
      GlobalAPI.LoginAPIS.mThanos_getCaptcha_api.method,
      params
    );
    //debugger;
    return resultData;
  }



  /**
 * 获取用户信息
 * @param params 入参
 */
  public async getAuthInfo(params: login_par_model) {
    //debugger;
    const resultData: any = await httpAsync(
      GlobalAPI.LoginAPIS.mThanos_getAuthInfo_api.baseUrl,
      GlobalAPI.LoginAPIS.mThanos_getAuthInfo_api.url,
      GlobalAPI.LoginAPIS.mThanos_getAuthInfo_api.method,
      new login_par_model(),
      params
    );
    //debugger;
    return resultData;
  }


  /**
* 获取用户退出
* @param params 入参
*/
  public async loginOut(params: login_par_model) {
    //debugger;
    const resultData: any = await httpAsync(
      GlobalAPI.LoginAPIS.mThanos_loginOut_api.baseUrl,
      GlobalAPI.LoginAPIS.mThanos_loginOut_api.url,
      GlobalAPI.LoginAPIS.mThanos_loginOut_api.method,
      params
    );
    //debugger;
    return resultData;
  }

  /**
* 用户修改密码
* @param params 入参
*/
  public async updatePassWord(params: login_par_model) {
    //debugger;
    const resultData: any = await httpAsync(
      GlobalAPI.LoginAPIS.mThanos_updatePassWord_api.baseUrl,
      GlobalAPI.LoginAPIS.mThanos_updatePassWord_api.url,
      GlobalAPI.LoginAPIS.mThanos_updatePassWord_api.method,
      params
    );
    //debugger;
    return resultData;
  }


}
