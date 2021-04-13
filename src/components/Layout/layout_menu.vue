<!-- 系统框架--侧栏菜单 -->

<template>
  <aside class="aside-section" :class="{ hidden: !isShowSidebar }">
    <!-- 伸缩按钮 -->
    <div class="flex-btn">
      <i
        :class="{
          'el-icon-s-fold': isShowSidebar,
          'el-icon-s-unfold': !isShowSidebar,
        }"
        @click="handleClick_flexBtn"
      ></i>
    </div>
    
    <!-- 菜单 -->
    <div class="sidebar-menu">
      <el-scrollbar class="common-scroll-y">
        <el-menu
          class="aside-sidebar"
          :default-openeds="defaultOpeneds"
          :collapse-transition="sidebarCollapseTransition"
          :collapse="!isShowSidebar"
          :default-active="onRoutes"
          unique-opened
        >
          <el-submenu
            v-for="(menuData, index) in menuDatas"
            :key="index"
            :index="resolvePath(menuData.path)"
          >
            <template slot="title" v-if="!menuData.hidden">
              <svg-icon
                :iconClass="menuData.icon"
                style="height: 32px;width: 16px;"
              />
              <span class="name" slot="title">{{ menuData.name }}</span>
            </template>
            <template v-for="(menuItem, mentItemIdx) in menuData.children">
              <el-menu-item
                class="menu-item"
                :key="mentItemIdx"
                :index="resolvePath(menuItem.path)"
                v-if="!menuItem.hidden"
                @click="handleMenuClick(menuData, menuItem)"
              >
                <span>{{ menuItem.name }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import path from "path";

import { loginService } from "@/bll/sysManage/loginService";

//基础组件
import MTTheme from "@/controls/MTTheme.vue"; //换肤
import MTColor from "@/controls/MTColor.vue"; //换颜色

@Component({
  components: {
    MTTheme,
    MTColor,
  },
})
export default class LayoutMenu extends Vue {
  @Prop({ default: () => [] }) menuDatas!: any; //菜单
  @Prop({ default: "" }) currentRoute!: any; //当前菜单

  private sidebarCollapseTransition: boolean = false; //是否开启折叠动画
  private defaultOpeneds: any = new Array();
  private onRoutes: any = "";
  private isShowSidebar: boolean = true; //是否折叠侧栏

  private created() {
    this.onRoutes = this.currentRoute;
  }

  @Watch("currentRoute")
  private watchCurrentRoute(newVal: any, oldVal: any) {
    this.onRoutes = newVal;
  }

  /**
   * 组件加载完成
   */
  private mounted() {}

  private resolvePath(routePath: string) {
    if (/^(http?:|mailto:|tel:)/.test(routePath)) {
      return routePath;
    }
    return path.resolve(routePath);
  }

  /**
   * 点击菜单按钮
   */

  private handleMenuClick(menuData: any, menuItem: any) {
    //this.onRoutes = menuItem.component;
    this.$emit("handleMenuClick", menuData, menuItem);
    this.$router.push({ path: menuItem.path });
  }

  /** 
   * 点击侧栏伸缩按钮
  */
 private handleClick_flexBtn(){
   this.isShowSidebar = !this.isShowSidebar;
   this.$emit('handleClick_flexBtn',this.isShowSidebar)
 }
}
</script>
