<template>
  <div class="loginAnimation-template">
    <!-- 动画部分 -->
    <div class="lms-animation-contain">
      <div class="lms-ac-inner">
        <!-- 国徽 -->
        <div class="icon-item guohui">
          <div class="icon-block"></div>
        </div>
        <!-- wifi -->
        <div class="icon-item wifi">
          <div class="icon-block">
            <i class="icon-center"></i>
          </div>
        </div>
        <!-- face -->
        <div class="icon-item face">
          <div class="icon-block">
            <i class="icon-line"></i>
            <i class="icon-circle"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="lms-animation-bgline"></div>

    <!-- 表单部分 -->
    <div class="lms-form-contain">
      表单部分
    </div>

    <!-- 底部 -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MTConfig } from "@/config/MTConfig";
import { Component } from "vue-property-decorator";

//基础组件
// import { dictService } from "@/bll/common/dictService";

//model&service
import { login_ui_model } from "@/model/sysManage/login_result_model";
import { loginService } from "@/bll/sysManage/loginService";

// import { user_ui_model } from "@/model/sysManage/user_result_model.ts";
// import { UserService } from "@/bll/sysManage/UserService.ts";

// import { dict_ui_model } from "@/model/common/dict_result_model.ts";

@Component({
  components: {}
})
export default class Login extends Vue {
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
    // (this.$refs.inputRef as any).focus();
  }
}
</script>

<style lang="scss">
@import "~@/assets/css/pages/LoginAnimation.scss";
</style>
