import {
  login_ui_model,
  login_par_model,
  login_result_model,
  login_result_model_detail,
} from "@/model/sysManage/login_result_model.ts";
import { loginNetwork } from "@/network/sysManage/loginNetwork";
import { mtConsole } from "@/utils/mtConsole";

export class loginService {
  /**
   *构造函数
   */
  public constructor() {}

  /**
   * 登录接口
   * @param prarms 入参
   */
  public async login(params: login_ui_model) {
    let parameters = <login_par_model>params;
    let startDateTime = new Date().getTime();

    // let headers = {
    //   "Tenant-Id": parameters.tenantId,
    //   "Captcha-Key": parameters.key,
    //   "Captcha-Code": parameters.code
    // };
    // sessionStorage.setItem("headers", JSON.stringify(headers));

    //let queryParams = JSON.parse(JSON.stringify(parameters));
    // delete queryParams.key;
    //delete queryParams.code;
    let param = new login_par_model();
    param.name = params.username;
    param.password = params.password;
    param.key = params.key;
    param.loadingTarget = params.loadingTarget;
    const resultData = await new loginNetwork().login(param);
    var endDateTime = new Date().getTime();
    let data = new login_result_model();
    let login: any = <login_result_model_detail>resultData;
    if (login) {
      data.code = login.code;
      data.data = login.data;
      data.message = login.msg;
      data.success = login.success;
    } else {
      data.code = "400";
      data.message = resultData.error_description;
    }
    data.expendTime = endDateTime - startDateTime;
    mtConsole.log("【login】data", data);

    return data;
  }

  /**
   * 验证码接口
   * @param prarms 入参
   */
  public async getCaptcha() {
    let params = new login_par_model();
    params.loadingTarget = ".login-code";
    var startDateTime = new Date().getTime();
    const resultData = await new loginNetwork().getCaptcha(params);
    var endDateTime = new Date().getTime();
    var data = new login_result_model();
    data.code = resultData.code;
    data.data = <login_result_model_detail>resultData;
    data.message = resultData.message;
    data.expendTime = endDateTime - startDateTime;
    mtConsole.log("getCodeImg", data);

    return data;
  }

  /**
   * 验证码接口
   * @param prarms 入参
   */
  public async getAuthInfo(name: string) {
    var startDateTime = new Date().getTime();
    let par = new login_par_model();
    par.name = name;
    par.loadingTarget = ".login-form";
    const resultData = await new loginNetwork().getAuthInfo(par);
    var endDateTime = new Date().getTime();
    //debugger;
    var data = new login_result_model();
    data.code = resultData.code;
    data.data = resultData.data;
    data.message = resultData.message;
    data.expendTime = endDateTime - startDateTime;
    mtConsole.log("getCodeImg", data);

    return data;
  }

  /**
   * 验证码接口
   * @param prarms 入参
   */
  public async loginOut() {
    let params = new login_par_model();
    params.loadingTarget = "body";
    var startDateTime = new Date().getTime();
    const resultData = await new loginNetwork().loginOut(params);
    var endDateTime = new Date().getTime();
    //debugger;
    var data = new login_result_model();
    data.code = resultData.code;
    data.data = resultData.data;
    data.message = resultData.message;
    data.expendTime = endDateTime - startDateTime;
    mtConsole.log("loginOut", data);
    return data;
  }

  /**
   * 用户修改密码
   * @param prarms 入参
   */
  public async updatePassWord(params: login_par_model) {
    //debugger;

    var startDateTime = new Date().getTime();
    const resultData = await new loginNetwork().updatePassWord(params);
    var endDateTime = new Date().getTime();
    //debugger;
    var data = new login_result_model();
    data.code = resultData.code;
    data.data = resultData.data;
    data.message = resultData.message;
    data.expendTime = endDateTime - startDateTime;
    mtConsole.log("用户修改密码service", data);
    return data;
  }
}
