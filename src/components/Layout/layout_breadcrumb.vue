<!-- 系统框架--面包屑 -->

<template>
  <el-breadcrumb class="breadcrumb-seciton" separator="/">
    <i class="bread-dec"></i>
    <el-breadcrumb-item
      v-for="(breadcrumbItem, index) in curActiveMenu"
      :key="index"
      >{{ breadcrumbItem.label }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import path from "path";

//基础组件


@Component({
  components: {

  },
})
export default class LayoutBreadcrumb extends Vue {
  @Prop({ default: () => [] }) currentMenuObj!: any; //当前菜单对象  {menuData:{},menuItem:{}}

  private curActiveMenu: any = [];

  private created() {
    
  }

  /**
   * 组件加载完成
   */
  private mounted() {
    this.setActiveMenu(this.currentMenuObj)
  }

  @Watch("currentMenuObj",{deep:true})
  private watchCurrentMenuObj(newVal: any, oldVal: any) {
    this.setActiveMenu(newVal)
  }

  /**
   * 设置当前页面面包屑
   */
  private setActiveMenu(item:any){
    let menuData = item.menuData;
    let menuItem = item.menuItem;
    this.curActiveMenu = [
      { path: menuData.component, label: menuData.name },
      { path: menuItem.component, label: menuItem.name },
    ];
  }

}
</script>
