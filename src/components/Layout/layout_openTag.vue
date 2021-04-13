<!-- 系统框架--当前打开的页面tag -->

<template>
  <section class="router-btns">
    <el-tabs
      class="router-btns-tabs"
      closable
      v-model="onRoutes"
      @tab-remove="handleRemoveTab"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        v-for="(item, index) in openedTags"
        :key="index"
        :label="item.curItem.name"
        :name="item.curItem.path"
      ></el-tab-pane>
    </el-tabs>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import path from "path";

//基础组件

@Component({
  components: {},
})
export default class LayoutOpenTag extends Vue {
  @Prop({ default: () => [] }) menuDatas!: any; //菜单
  @Prop({ default: () => {} }) currentMenuObj!: any; //当前菜单对象  {menuData:{},menuItem:{}}

  private onRoutes: any = "";//当前页面路由
  private openedTags = new Array(); // 已打开的标签

  private created() {
    this.onRoutes = this.currentMenuObj.menuItem.component;
    this.addOpenTags(this.currentMenuObj.menuData,this.currentMenuObj.menuItem)
  }

  @Watch("currentMenuObj",{deep:true})
  private watchCurrentMenuObj(newVal: any, oldVal: any) {
    this.onRoutes = newVal.menuItem.component;
    this.addOpenTags(newVal.menuData,newVal.menuItem)
  }

  /** 
   * 增加打开的标签
  */
  private addOpenTags(menuData:any,menuItem:any){
    let ifHadOpened = this.openedTags.find(
      (item: any) => item.curItem.component == menuItem.component
    );
    if (!ifHadOpened) {
      this.openedTags.push({
        parent: menuData,
        curItem: menuItem,
      });
    }
  }

  /**
   * 点击打开的页面tab
   */
  private handleClickTab(item: any) {

    let param = this.openedTags.find((i: any) => {
      return i.curItem.path == item.name;
    });
    this.handleTagChange(param);
  }

  /**
   * 打开的页面tab点击事件
   */
  private handleTagChange(item: any) {


    let menuData = item.parent;
    let menuItem = item.curItem;
    
    this.$emit("handleMenuClick", menuData, menuItem);
    this.$router.push({ path: item.curItem.path });
  }

  /**
   * 点击打开的页面tab的关闭图标
   */
  private handleRemoveTab(targetName: any) {
    let param = this.openedTags.find((i: any) => {
      return i.curItem.path == targetName;
    });
    this.handleTagClose(param.curItem);
  }

  /**
   * tab关闭事件
   */
  private handleTagClose(item: any) {
    let closeTagIdx = 0;
    if (item.path == this.onRoutes) {
      if (this.openedTags.length > 0) {
        this.openedTags.find((tags: any, idx: any) => {
          if (tags.curItem.path == item.path) {
            closeTagIdx = idx;
          }
        });
      }
      this.openedTags = this.openedTags.filter(
        (tags: any) => tags.curItem.path != item.path
      );
      if (closeTagIdx) {
        // 关闭tag的前一个tag标签选中
        this.handleTagChange(this.openedTags[closeTagIdx - 1]);
      } else {
        if (this.openedTags.length == 0) {
          // 所有tag关闭时，打开第一个子菜单
          this.$emit(
            "handleMenuClick",
            this.menuDatas[0],
            this.menuDatas[0].children[0]
          );
          this.$router.push({ path: this.menuDatas[0].children[0].path });

        } else {
          //当关闭第一个tag 并且仍有打开的标签时，后一个选中
          this.handleTagChange(this.openedTags[closeTagIdx]);
        }
      }
    } else {
      
      // 关闭的tag不是当前active tag 时
      this.openedTags = this.openedTags.filter(
        (tags: any) => tags.curItem.path != item.path
      );
    }
  }
}
</script>
