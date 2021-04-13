<!--切换主题组件-->
<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      :content="$t('header.rightBtns.changeTheme')"
      placement="bottom"
    >
      <i class="el-icon-brush" @click="isShowDialogTheme = true"> </i>
    </el-tooltip>

    <el-dialog
      title="选择主题"
      :visible.sync="isShowDialogTheme"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-radio-group v-model="themeName" @change="handleChange_themeName">
        <el-radio
          v-for="(item, index) in themeArr"
          :key="index"
          :label="item.name"
          class="color-block"
          ><i class="color-i" :style="{ 'background-color': item.color }"></i
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import MThanosThemeMixin from "@/controls/mixins/MThanosTheme";

@Component({
  mixins: [MThanosThemeMixin], //主题混入
})
export default class MTTheme extends Vue {
  @Action("setThemeName") setThemeName!: any;
  @Getter("getThemeName") getThemeName!: string;

  private isShowDialogTheme: boolean = false; //是否显示主题弹框
  private themeArr: any = [
    //主题类型
    {
      name: "theme-default",
      color: "#409EFF",
      label: "默认主题,可更换颜色",
    },
    {
      name: "theme-custom",
      color: "#6a85f1",
      label: "定制主题,不可更换颜色",
    },
    {
      name: "theme-commonDark",
      color: "#28aaff",
      label: "公安系常用暗色主题,不可更换颜色",
    },
  ];

  /**
   * 组件加载完成
   */
  private mounted() {
    this.handleChange_themeName(this.getThemeName);
  }

  /**
   * 点击切换radio按钮
   */
  private handleChange_themeName(val: string) {
    console.log("val", val);
    this.setThemeName(val);
  }
}
</script>
<style scoped lang="scss"></style>
