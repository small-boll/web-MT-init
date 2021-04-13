import { base_model } from "@/model/base_model";
import { base_loading_model } from "@/model/base_loading_model";

/**
 * 【入参】测试请求入参model
 */
class login_par_model extends base_loading_model {
  /**默认构造函数 */
  public constructor() {
    super();
  }

  /**验证码 */
  public code!: string;

  /**密码 */
  public password!: string;

  /**账号 */
  public username!: string;

  /**账号 */
  public name!: string;

  /**uuid */
  public uuid!: string;
  /**租户ID */
  public tenantId!: string;

  /**账户类型 */
  public type!: string;

  public key!: string;

  //登录名
  public loginName!: string;
  //新密码
  public newPassword!: string;
  

}

/**
 * 【输出】测试输出结果model
 */
class login_result_model extends base_model {
  /**默认构造函数 */
  public constructor() {
    super();
  }

  /**明细数据 */
  public data!: login_result_model_detail;
}

/**
 * 【明细数据】
 */
class login_result_model_detail {
  /**默认构造函数 */
  public constructor() { }

  /**uuid */
  public uuid!: string;

  /**验证码 */
  public img!: string;

  /**token */
  public token!: string;

  /**userinfo */
  public user!: any;

  /**key */
  public key!: string;

  /**验证码 */
  public image!: string;

  public grant_type!: string;

  public scope!: string;


  public access_token!: string;
  public token_type!: string;
  public refresh_token!: string;
  public expires_in!: string;
  //public scope!: string;
  public tenant_id!: string;
  public role_name!: string;
  public license!: string;
  public user_id!: string;
  public role_id!: string;
  public user_name!: string;
  public nick_name!: string;
  public real_name!: string;
  public avatar!: string;
  public dept_id!: string;
  public client_id!: string;
  public account!: string;
  public jti!: string;

  public accessToken!: string;
  public expiration!: number;

  public menus!: [];
}

/**
 * uiModel界面数据绑定
 */
class login_ui_model extends login_par_model {
  /**默认构造函数 */
  public constructor() {
    super();
  }
}

export {
  /**model部分 */
  login_par_model,
  login_result_model,
  login_result_model_detail,
  /**uimodel部分 */
  login_ui_model
};
