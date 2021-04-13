<!--切换整体颜色组件-->
<template>
  <el-tooltip class="item" effect="dark" :content="$t('header.rightBtns.changeColor')" placement="bottom">
    <i class="MTColor-template">
      <el-color-picker
        size="mini"
        style="padding-top:18px;"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
        v-model="colorVal"
      ></el-color-picker>
    </i>
  </el-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { mapGetters } from "vuex";
import MThanosColorMixin from "@/controls/mixins/MThanosColor";

@Component({
  mixins: [MThanosColorMixin], //颜色混入
})
export default class MTColor extends Vue {}
</script>
<style lang="scss">
.MTColor-template {
  display: flex !important;
  align-items: center;
  justify-content: center;
  .el-color-picker {
    padding: 0 !important;

    .el-color-picker__trigger {
      border: none;
      padding: 2px;
      .el-color-picker__color {
        border-radius: 50%;
        border: none;

        .el-color-picker__color-inner {
          border-radius: inherit;
        }
      }
    }
  }
}
</style>
