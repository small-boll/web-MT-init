<template>
  <div class="pdf">
    <div class="pdf-tab">
      <div class="btn-def btn-pre" @click.stop="prePage">上一页</div>
      <div class="btn-def btn-next" @click.stop="nextPage">下一页</div>
      <div class="btn-def" @click.stop="clock">顺时针</div>
      <div class="btn-def" @click.stop="counterClock">逆时针</div>
      <div class="btn-def" @click.stop="pdfPrintAll">全部打印</div>
      <div class="btn-def" @click.stop="pdfPrint">部分打印</div>
    </div>
    <div>{{pageNum}}/{{pageTotalNum}}</div>
    <div>进度：{{loadedRatio}}</div>
    <div>页面加载成功: {{curPageNum}}</div>
    <pdf
      ref="pdf"
      :src="pdfUrl"
      :page="pageNum"
      :rotate="pageRotate"
      @password="password"
      @progress="loadedRatio = $event"
      @page-loaded="pageLoaded($event)"
      @num-pages="pageTotalNum=$event"
      @error="pdfError($event)"
      @link-clicked="page = $event"
    ></pdf>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

import pdf from "vue-pdf";

@Component({
  components: {}
})
export default class MTPdfView extends Vue {
  private name: string = "MTPdfView";

  /**
   * prop参数
   */
  @Prop({ default: "" }) pdfViewSrc!: string; // pdf地址

  @Prop({ default: "" }) pdfPassword!: string; // pdf密码

  private pageNum: number = 1;
  private pageTotalNum: number = 1;
  private pageRotate: number = 0;
  // 加载进度
  private loadedRatio: number = 0;
  private curPageNum: number = 0;

  /**data */
  private imgUrl: any = ""; //图片地址

  /**
   *组件加载完毕
   */
  private mounted() {
    // this.watchSrc();
  }

  private prePage() {
    let p = this.pageNum;
    p = p > 1 ? p - 1 : this.pageTotalNum;
    this.pageNum = p;
  }

  private nextPage() {
    let p = this.pageNum;
    p = p < this.pageTotalNum ? p + 1 : 1;
    this.pageNum = p;
  }

  private clock() {
    this.pageRotate += 90;
  }
  private counterClock() {
    this.pageRotate -= 90;
  }

  private password(updatePassword: any, reason: any) {
    updatePassword(prompt('password is "' + this.pdfPassword + '"'));
    console.log("...reason...");
    console.log(reason);
    console.log("...reason...");
  }
  private pageLoaded(e: any) {
    this.curPageNum = e;
  }
  private pdfError(error: any) {
    console.error(error);
  }
  private pdfPrintAll() {
    (this.$refs.pdf as any).print();
  }
  private pdfPrint() {
    (this.$refs.pdf as any).print(100, [1, 2]);
  }
}
</script>
<style scoped lang="scss">
</style>
