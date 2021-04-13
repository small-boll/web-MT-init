<!-- 系统框架 --总入口-->

<template>
  <div class="layout-section">
    <!-- 头部 -->
    <LayoutHeader
      :menuDatas="menuDatas"
      @handleMenuClick="handleMenuClick"
    ></LayoutHeader>
    <!-- 正文 -->
    <div class="layout-container">
      <!-- 侧栏 -->
      <LayoutMenu
        :menuDatas="menuDatas"
        :currentRoute="onRoutes"
        @handleMenuClick="handleMenuClick"
        @handleClick_flexBtn="handleClick_flexBtn"
      ></LayoutMenu>
      <!-- 右侧 -->
      <section
        class="main-section"
        :class="{ sidebarCollapse: !isShowSidebar }"
      >
        <div class="main-wrapper">
          <div class="main-top">
            <!-- 面包屑 -->
            <LayoutBreadcrumb
              :currentMenuObj="currentMenuObj"
            ></LayoutBreadcrumb>

            <!-- 当前打开的页面tab -->
            <LayoutOpenTag
              :menuDatas="menuDatas"
              :currentMenuObj="currentMenuObj"
              @handleMenuClick="handleMenuClick"
            ></LayoutOpenTag>
          </div>

          <!-- 内容板块 -->
          <section class="content-section">
            <el-scrollbar class="common-scroll-y">
              <router-view></router-view>
            </el-scrollbar>
          </section>
        </div>
      </section>
    </div>

    <!-- 帮助组件 -->
    <LayoutHelp @handleClick_funcName="handleClick_funcName"></LayoutHelp>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import path from "path";

import { loginService } from "@/bll/sysManage/loginService";

//基础组件
import MTTheme from "@/controls/MTTheme.vue"; //换肤
import MTColor from "@/controls/MTColor.vue"; //换颜色

//板块组件
import LayoutHeader from "@/components/Layout/layout_header.vue"; //头部
import LayoutMenu from "@/components/Layout/layout_menu.vue"; //侧栏菜单
import LayoutBreadcrumb from "@/components/Layout/layout_breadcrumb.vue"; //面包屑
import LayoutOpenTag from "@/components/Layout/layout_openTag.vue"; //当前打开的页面tag
import LayoutHelp from "@/components/Layout/layout_help.vue"; //帮助组件

@Component({
  components: {
    LayoutHeader,
    LayoutMenu,
    LayoutBreadcrumb,
    LayoutOpenTag,
    LayoutHelp,
  },
})
export default class LayoutIndex extends Vue {
  @Action("setTokenAction") setTokenActionCommand!: any;

  private menuDatas: any = new Array(); //菜单

  private isShowSidebar: boolean = true; //是否折叠侧栏

  private onRoutes: any = "";
  private currentMenuObj: any = ""; //当前菜单对象  {menuData:{},menuItem:{}}

  private created() {
    //直接从登录进来
    this.menuDatas = JSON.parse(
      (sessionStorage as any).getItem("PermissionMenu")
    ).filter((menuData: any) => !menuData.hidden); // 过滤隐藏的菜单

    let curRouteObj = this.$router.currentRoute;

    if (curRouteObj.path == "/layout") {
      let defaultOpeneds = Array.of(this.menuDatas[0]);
      let defaultActiveMenu =
        defaultOpeneds[0].children.find(
          (item: any) => item.name == "个人工作台"
        ) || defaultOpeneds[0].children[0];

      this.onRoutes = defaultActiveMenu.component;
      this.$router.push({ path: this.onRoutes }); //重定向
      this.handleMenuClick(defaultOpeneds[0], defaultActiveMenu);
    } else {
      this.onRoutes = curRouteObj.path;
      this.menuDatas.find((item: any) => {
        if (item.children) {
          item.children.find((sub: any) => {
            if (sub.component == this.onRoutes) {
              this.handleMenuClick(item, sub);
              return;
            }
          });
        }
      });
    }
  }

  /**
   * 组件加载完成
   */
  private mounted() {}

  /**
   * 点击菜单按钮
   */

  private handleMenuClick(menuData: any, menuItem: any) {
    this.onRoutes = menuItem.component;
    //当前菜单路由
    let currentMenuObj = {
      menuData: menuData,
      menuItem: menuItem,
    };
    this.currentMenuObj = currentMenuObj;
  }

  /**
   * 点击侧栏伸缩按钮
   */
  private handleClick_flexBtn() {
    this.isShowSidebar = !this.isShowSidebar;
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

  /**
   * 点击工作指引中的功能按钮
   */
  private handleClick_funcName(item: any) {
    console.log("点击了----》", item);
  }
}
</script>

<style lang="scss">
@import "~@/assets/css/components/layout/layout.scss";
</style>
