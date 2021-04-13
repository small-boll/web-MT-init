<!-- 系统框架--头部 -->

<template>
  <header class="head-seciton">
    <div class="header-wrapper">
      <div class="logo">
        <span>{{ $t("header.title") }}</span>
      </div>
      <div class="head-right">
        <!-- 全局搜索 -->
        <div class="head-global-search">
          <el-autocomplete
            popper-class="search-autocomplete"
            class="inline-input"
            v-model="searchValue"
            :fetch-suggestions="querySearch"
            :placeholder="$t('header.globalSearch')"
            @select="handleSelect"
            size="small"
            suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
              <div class="path">{{ item.path }}</div>
            </template>
          </el-autocomplete>
        </div>

        <!-- 用户信息下拉 -->
        <el-dropdown
          class="head-user"
          trigger="click"
          @command="handleClick_dropdown"
        >
          <div class="user-wrapper">
            <div class="user-img">
              <img src="~@/assets/images/layout/logo.png" class="user-photo" />
            </div>
            <span class="user-name">{{ uerName }}</span>
            <i class="el-icon-arrow-down" />
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item command="changePassword">{{
              $t("header.rightBtns.userDropdown")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 头部按钮组 -->
        <div class="header-btns">
          <MTColor></MTColor>
          <MTTheme></MTTheme>
          <i class="btn-lang">
            <MTLangSelect></MTLangSelect>
          </i>

          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('header.rightBtns.msgCenter')"
            placement="bottom"
          >
            <i class="el-icon-bell" v-if="false">
              <em class="badge">12</em>
            </i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('header.rightBtns.quit')"
            placement="bottom"
          >
            <i class="el-icon-switch-button" @click="handleQuit"></i>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 修改密码弹框 -->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$t('changePassword.dialogTitle')"
      :before-close="handleClick_cancel"
      :visible.sync="isShowChangePasswordDialog"
      width="500px"
    >
      <el-form
        label-width="100px"
        ref="changePasswordFromRef"
        :rules="changePasswordFromRules"
        :model="changePasswordForm"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item :label="$t('changePassword.labelOld')" prop="old">
          <el-input
            type="password"
            v-model="changePasswordForm.old"
            :placeholder="$t('changePassword.rulesOld')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('changePassword.labelPassword')"
          prop="password"
        >
          <el-input
            type="password"
            v-model="changePasswordForm.password"
            :placeholder="$t('changePassword.rulesPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('changePassword.labelCheckPassword')"
          prop="checkPassword"
        >
          <el-input
            type="password"
            v-model="changePasswordForm.checkPassword"
            :placeholder="$t('changePassword.rulesCheckPassword')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClick_cancel">{{
          $t("changePassword.cancelBtn")
        }}</el-button>
        <el-button type="primary" @click="handleClick_changePasswordSubmit">{{
          $t("changePassword.submitBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import path from "path";

//基础组件
import MTTheme from "@/controls/MTTheme.vue"; //换肤
import MTColor from "@/controls/MTColor.vue"; //换颜色
import MTLangSelect from "@/controls/MTLangSelect.vue"; //语言配置

//model&service
import { login_ui_model } from "@/model/sysManage/login_result_model";
import { loginService } from "@/bll/sysManage/loginService";

@Component({
  components: {
    MTTheme,
    MTColor,
    MTLangSelect,
  },
  computed: {
    changePasswordFromRules() {
      let validatePass = (rule, value, callback) => {
        let that: any = this;
        if (value === "") {
          callback(new Error(that.$t("changePassword.rulesPassword")));
        } else {
          if (that.changePasswordForm.checkPassword !== "") {
            (this.$refs.changePasswordFromRef as any).validateField(
              "checkPassword"
            );
          }
          callback();
        }
      };

      let validateCheckPass = (rule, value, callback) => {
        let that: any = this;
        if (value === "") {
          callback(new Error(that.$t("changePassword.rulesCheckPassword")));
        } else if (value !== that.changePasswordForm.password) {
          callback(
            new Error(that.$t("changePassword.rulesCheckPasswordCheck"))
          );
        } else {
          callback();
        }
      };

      return {
        old: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("changePassword.rulesOld"),
          },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
        checkPassword: [
          { required: true, trigger: "blur", validator: validateCheckPass },
        ],
      };
    },
  },
})
export default class LayoutHeader extends Vue {
  @Prop({ default: () => [] }) menuDatas!: any; //菜单
  @Action("setTokenAction") setTokenActionCommand!: any;
  private searchMenuArr: any = []; //全局搜索功能数组
  private searchValue: any = ""; //全局搜索
  private isShowChangePasswordDialog: boolean = false; //是否显示修改密码弹窗
  private uerName: string = "";

  private changePasswordForm: any = {
    old: "",
    password: "",
    checkPassword: "",
  };

  private created() {
    this.uerName = JSON.parse((sessionStorage as any).getItem("userinfo")).name;
    this.getMenuList();
  }

  /**
   * 组件加载完成
   */
  private mounted() {}

  /**
   * 全局功能搜索下拉匹配
   */
  private querySearch(queryString: any, cb: any) {
    var searchMenuArr = this.searchMenuArr;
    var results = queryString
      ? searchMenuArr.filter(this.createFilter(queryString))
      : searchMenuArr;
    // 调用 callback 返回建议列表的数据
    cb(results);
  }

  /**
   * 全局搜索
   */
  private createFilter(queryString: any) {
    return (menuItem: any) => {
      return (
        menuItem.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    };
  }

  /**
   * 全局功能change事件
   */
  private handleSelect(item: any) {
    console.log("item======>", item);
    this.searchValue = item.name;
    this.$emit("handleMenuClick", item.parentObj, item);
    // this.handleMenuClick(item.parentObj, item);
    this.$router.push({
      path: item.path,
    });
  }

  /**
   * 点击下拉菜单功能
   */
  private handleClick_dropdown(type: string) {
    switch (type) {
      case "changePassword":
        this.isShowChangePasswordDialog = true;
        this.changePasswordForm = {
          old: "",
          password: "",
          checkPassword: "",
        };

        this.$nextTick(() => {
          this.clearValidate();
        });
        break;
      default:
        break;
    }
  }

  /**
   * 获取全局功能搜索的功能菜单
   */
  @Watch("menuDatas")
  private getMenuList() {
    let menuList: any = [];
    let findMenu = (list: any, parent: any) => {
      for (let i = 0; i < list.length; i++) {
        let menuItem = Object.assign({}, list[i]);
        if (list[i].children && list[i].children.length > 0) {
          findMenu(list[i].children, list[i]);
        } else {
          menuItem.parentObj = parent;
          menuList.push(menuItem);
        }
      }
    };
    findMenu(this.menuDatas, null);
    this.searchMenuArr = menuList;
  }

  /**
   * 点击取消按钮
   */
  private handleClick_cancel() {
    this.clearValidate();
    this.isShowChangePasswordDialog = false;
  }

  /**
   * 清除修改密码验证
   */
  private clearValidate() {
    (this.$refs.changePasswordFromRef as any).clearValidate();
  }

  /**
   * 点击修改密码的提交按钮
   */
  private handleClick_changePasswordSubmit() {
    console.log("this.changePasswordForm", this.changePasswordForm);
    (this.$refs["changePasswordFromRef"] as any).validate((valid) => {
      if (valid) {
        this.changePasswordEvent(this.changePasswordForm, () => {
          this.$message.success("修改密码成功,请重新登录");
          this.handleClick_cancel();
          setTimeout(() => {
            this.$router.push({
              path: "/Login",
            });
          }, 1000);
        });
      } else {
        return false;
      }
    });
  }

  /**
   * 修改密码事件
   */
  private async changePasswordEvent(param: any, callback: any) {
    let userInfo = JSON.parse((sessionStorage as any).getItem("userinfo"));
    let params = new login_ui_model();
    params.loginName = userInfo.loginName;
    params.password = param.old;
    params.newPassword = param.password;
    console.log("params---->", params);
    let data = await new loginService().updatePassWord(params);
    if (data.code == 200) {
      callback(data);
    } else {
      this.$message.error(data.message);
    }
  }

  /**
   * 点击退出按钮
   */
  private handleQuit = () => {
    this.$confirm("请确认是否退出登录？", "提示", {
      type: "warning",
    })
      .then(() => {
        new loginService().loginOut().then((res: any) => {
          //清除token值
          this.setTokenActionCommand("");
          //清除sessionStorage的token值
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userinfo");
          sessionStorage.removeItem("PermissionMenu");
          //跳转到登录页
          this.$root.$router.push({
            path: "/Login",
          });
        });
      })
      .catch(() => {});
  };
}
</script>
