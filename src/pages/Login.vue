<template>
  <div class="template-login">
    <!-- 登录框 -->
    <div class="login-form-section">
      <div class="login-form-wrapper">
        <div class="login-title">
          <em>MThanos 3.0</em>前端开放平台
          <MTLangSelect class="btn-lang"></MTLangSelect>
        </div>
        <el-form
          class="login-form"
          ref="loginForm"
          :model="loginUiModel"
          label-position="left"
          label-width="0px"
          :rules="loginRules"
          size="big"
        >
          <!-- <el-form-item prop="tenantId">
            <el-input
              ref="inputRef"
              v-model="loginUiModel.tenantId"
              type="text"
              auto-complete="off"
              :placeholder="$t('login.tenantId')"
              prefix-icon="el-icon-bank-card"
            ></el-input>
          </el-form-item>-->
          <el-form-item prop="username">
            <el-input
              ref="inputRef"
              v-model="loginUiModel.username"
              type="text"
              auto-complete="off"
              :placeholder="$t('login.username')"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginUiModel.password"
              type="password"
              :placeholder="$t('login.password')"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code" class="code-input">
            <el-input
              v-model="loginUiModel.code"
              :placeholder="$t('login.code')"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-key"
            ></el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCaptcha" />
            </div>
          </el-form-item>
          <div class="row-item">
            <el-checkbox
              v-model="loginUiModel.rememberMe"
              style="margin:0px 0px 25px 0px;"
              >{{ $t("login.tips") }}</el-checkbox
            >
            <span class="register-btn" @click="handleClick_registerBtn">
              {{ $t("login.register") }}
            </span>
          </div>
          <el-form-item style="width:100%;">
            <el-button
              class="submit-btn"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              {{ $t("login.btn") }}
              <!-- <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>-->
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 底部 -->
    <div class="login-bottom">
      <div id="el-login-footer">
        <span>湖北金鹏信息系统有限公司技术支持</span>
        <span>{{ currentVersion }}</span>
      </div>
    </div>

    <!-- 注册弹框 -->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$t('register.dialogTitle')"
      :before-close="handleClick_cancel"
      :visible.sync="isShowRegisterDialog"
      width="500px"
    >
      <el-form
        label-width="100px"
        ref="registerFromRef"
        :rules="registerFromRules"
        :model="registerForm"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item :label="$t('register.name')" prop="name">
          <el-input
            v-model="registerForm.name"
            :placeholder="$t('register.rulesName')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('register.loginName')" prop="loginName">
          <el-input
            v-model="registerForm.loginName"
            :placeholder="$t('register.rulesLoginName')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('register.email')" prop="email">
          <el-input
            v-model="registerForm.email"
            :placeholder="$t('register.rulesEmail')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('register.password')" prop="password">
          <el-input
            type="password"
            v-model="registerForm.password"
            :placeholder="$t('register.rulesPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('register.checkPassword')"
          prop="checkPassword"
        >
          <el-input
            type="password"
            v-model="registerForm.checkPassword"
            :placeholder="$t('register.rulesCheckPassword')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClick_cancel">
          {{ $t("register.cancelBtn") }}
        </el-button>
        <el-button type="primary" @click="handleClick_registerSubmit">
          {{ $t("register.submitBtn") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MTConfig } from "@/config/MTConfig";
import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { verify } from "@/utils/verify";

//基础组件
// import { dictService } from "@/bll/common/dictService";
import MTLangSelect from "@/controls/MTLangSelect.vue";

//model&service
import { login_ui_model } from "@/model/sysManage/login_result_model";
import { loginService } from "@/bll/sysManage/loginService";

// import { user_ui_model } from "@/model/sysManage/user_result_model.ts";
// import { UserService } from "@/bll/sysManage/UserService.ts";

// import { dict_ui_model } from "@/model/common/dict_result_model.ts";

@Component({
  components: {
    MTLangSelect
  },
  computed: {
    loginRules() {
      return {
        tenantId: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.tenantId")
          }
        ],
        username: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.username")
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.password")
          }
        ],
        code: [
          { required: true, trigger: "change", message: this.$t("login.code") }
        ]
      };
    },

    registerFromRules() {
      let validateEmail = (rule, value, callback) => {
        let that: any = this;
        if (value === "") {
          callback(new Error(that.$t("register.rulesEmail")));
        } else if (!verify.isEmail(value)) {
          callback(new Error(that.$t("register.rulesEmailCheck")));
        } else {
          callback();
        }
      };

      let validatePass = (rule, value, callback) => {
        let that: any = this;
        if (value === "") {
          callback(new Error(that.$t("register.rulesPassword")));
        } else {
          if (that.registerForm.checkPassword !== "") {
            (this.$refs.registerFromRef as any).validateField("checkPassword");
          }
          callback();
        }
      };

      let validateCheckPass = (rule, value, callback) => {
        let that: any = this;
        if (value === "") {
          callback(new Error(that.$t("register.rulesCheckPassword")));
        } else if (value !== that.registerForm.password) {
          callback(new Error(that.$t("register.rulesCheckPasswordCheck")));
        } else {
          callback();
        }
      };

      return {
        name: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("register.rulesName")
          }
        ],
        loginName: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("register.rulesLoginName")
          }
        ],
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        checkPassword: [
          { required: true, trigger: "blur", validator: validateCheckPass }
        ]
      };
    }
  }
})
export default class Login extends Vue {
  @Action("setTokenAction") setTokenActionCommand!: any;
  @Action("setUserinfoAction") setUserinfoActionCommand!: any;
  @Action("setPermissionMenu") setPermissionMenuActionCommand!: any;
  @Action("setDict") setDictActionCommand!: any;
  /**
   * 当前系统版本号
   */
  private currentVersion: string = "";
  private loginUiModel = new login_ui_model();
  private codeUrl: string = ""; // 验证码
  private version: string = ""; // 版本号

  private isShowRegisterDialog: boolean = false; //是否显示注册弹框
  private registerForm: any = {
    loginName: "",
    email: "",
    password: "",
    checkPassword: ""
  };

  /**
   * 加载完毕后的mouted事件（钩子函数）
   */
  created() {
    // 判断是否为调试状态
    this.ifDebug();
    this.getCaptcha();

    //给默认账号密码
    this.$set(this.loginUiModel, "tenantId", "000000");
    this.$set(this.loginUiModel, "username", "admin");
    this.$set(this.loginUiModel, "password", "123456");
  }

  /**
   * 加载完毕后的mouted事件（钩子函数）
   */
  mounted() {
    this.currentVersion = MTConfig.Instance().Version;
    //获取光标
    (this.$refs.inputRef as any).focus();
  }

  private async getCaptcha() {
    let bll = new loginService();
    let data: any = await bll.getCaptcha();
    //debugger;
    this.codeUrl = data.data.data.img;
    //this.loginUiModel.key = data.data.data.key;
  }

  /**
   * 点击登录按钮
   */
  private async handleLogin() {
    //验证
    const refForm = this.$refs.loginForm as HTMLFormElement;
    let that = this;
    refForm.validate((valid: boolean) => {
      if (valid) {
        that.login();
      }
    });
  }

  private  login() {
    this.loginUiModel.key = this.loginUiModel.code;
    let param: any = this.loginUiModel;

    param.loadingTarget = "body";

    // let bll = new loginService();
    // let data = await bll.login(param);
    // if (data.code == 200 && data.success) {
    //   //保存token值
    //   if (!!data.data && !!data.data.accessToken) {
    //     this.setTokenActionCommand(data.data.accessToken);
    //     // 保存到sessionStorage中
    //     sessionStorage.setItem("token", data.data.accessToken);
    //   }

    //   data = await bll.getAuthInfo(param.username);

    //   //存储用户信息
    //   const userinfo = data.data;
    //   this.setUserinfoActionCommand(userinfo);
    //   // 保存到sessionStorage中
    //   sessionStorage.setItem("userinfo", JSON.stringify(userinfo));

    //   //存储用户菜单信息
    //   this.getCurrentPermissionMenu(userinfo.menus);
    //   this.setDictList();
    // } else {
    //   this.$message.error(data.message);
    //   // this.getCaptcha();
    // }

    this.$router.push({ path: "/StudyTable" });
  }

  /**
   * 点击注册按钮
   */
  private handleClick_registerBtn() {
    this.isShowRegisterDialog = true;
    this.registerForm = {
      loginName: "",
      email: "",
      password: "",
      checkPassword: ""
    };
    this.$nextTick(() => {
      this.clearValidate();
    });
  }

  /**
   * 点击注册提交按钮
   */
  private handleClick_registerSubmit() {
    console.log("this.registerForm", this.registerForm);
    (this.$refs["registerFromRef"] as any).validate(valid => {
      if (valid) {
        this.registerEvent(this.registerForm, () => {
          this.$message.success("注册成功");
          this.handleClick_cancel();
        });
      } else {
        return false;
      }
    });
  }

  /**
   * 注册事件
   */
  private async registerEvent(param: any, callback: any) {
    console.log("param---->", param);
    // let params = new user_ui_model();
    // params.loginName = param.loginName;
    // params.email = param.email;
    // params.password = param.password;
    // params.name = param.name;
    // params.address = "a";
    // params.cellphone = "a";
    // params.sex = 0;
    // params.pic = "a";
    // params.theme = "theme-default";
    // params.language = "zh";

    // console.log("params---->", params);
    // let data = await new UserService().userRegister(params);
    // if (data.code == 200) {
    //   callback(data);
    // } else {
    //   this.$message.error(data.message);
    // }
  }

  /**
   * 点击取消按钮
   */
  private handleClick_cancel() {
    this.clearValidate();
    this.isShowRegisterDialog = false;
  }

  /**
   * 清除注册验证
   */
  private clearValidate() {
    (this.$refs.registerFromRef as any).clearValidate();
  }

  /**
   * 是否为调试状态
   */
  private ifDebug() {
    const IsDebugMode = MTConfig.Instance().IsDebugMode;
  }

  /**
   * @description: 获取当前用户菜单信息
   * @param {type}
   * @return:
   */
  private getCurrentPermissionMenu(menus: []) {
    if (!!menus) {
      this.setPermissionMenuActionCommand(menus);
      // 保存到sessionStorage中
      sessionStorage.setItem("PermissionMenu", JSON.stringify(menus));
    }

    // 跳转到导航页面
    this.$router.push({
      path: "/layout"
    });
  }

  /**
   * 获取字典
   */
  private async setDictList() {
    // let param = new dict_ui_model();
    // param.loadingTarget = ".login-form";
    // let data = await new dictService().getDictList(param);
    // if (data.code == 200) {
    //   this.setDictActionCommand(data.data);
    //   sessionStorage.setItem("dictList", JSON.stringify(data.data));
    // } else {
    //   this.$message.error(data.message);
    // }
  }
}
</script>

<style lang="scss">
@import "~@/assets/css/pages/login.scss";
</style>
