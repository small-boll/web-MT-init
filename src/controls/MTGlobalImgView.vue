<!--图片全局放大预览--【放在App.vue】-->
<template>
    <el-image
      v-if="isShowImage"
      class="GlobalImgView-template"
      ref="imgRef"
      :src="imgUrl"
      :preview-src-list="imgList"
    >
    </el-image>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component
export default class MTGlobalImgView extends Vue {
  @Action("setImgViewUrl") setImgViewUrl!: any;
  @Getter("getImgViewUrl") getImgViewUrl!: any;

  /**data */
  private imgUrl: any = ""; //原始图片地址
  private imgList: Array<any> = []; //预览大图数组

  private isShowImage: boolean = true; //是否显示大图预览,

  @Watch("getImgViewUrl", { deep: true })
  private watchImgView() {
    this.isShowImage = false;

    this.$nextTick(() => {
      this.isShowImage = true;
      console.log("this.getImgViewUrl", this.getImgViewUrl);
      //初始化
      this.imgList = [];
      //原始图
      this.imgUrl = this.getImgViewUrl.imgSrc;
      //预览图
      let previewSrc = this.getImgViewUrl.previewSrc;
      this.imgList.push(previewSrc);

      console.log("this.imgList======>", this.imgList);
      //展示大图
      this.$nextTick(() => {
        (this.$refs.imgRef as any).showViewer = true;
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.GlobalImgView-template {
  position: fixed;
  top: -10000px;
  left: -10000px;
  z-index: 10000;
  width: 0px;
  height: 0px;
}
</style>
