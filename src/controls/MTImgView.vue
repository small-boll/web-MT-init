<!--图片全局放大预览--各功能引用-->
<template>
  <div >
    <img class="imgView-img" v-if="!!!imgSrc"  src="../../src/assets/images/empty_photo.png"/>
    <img class="imgView-img" v-else :src="imgUrl" @click="handleClick_img" style="cursor: pointer;" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component
export default class MTImgView extends Vue {
  private name:string="MTImgView";
   @Action("setImgViewUrl") setImgViewUrl!: any; //设置大图预览地址obj的全局状态
  /**
   * prop参数
   */
  @Prop({ default: "" }) imgSrc!: string; // 图片地址
  @Prop({ default: "" }) previewSrc!: string; // 预览图片地址

  /**data */
  private imgUrl: any =""; //图片地址

  /**
   *组件加载完毕
   */
  private mounted() {
    this.imgUrl = this.imgSrc;
    // this.watchSrc();
  }


  /** 
   * 监听图片地址变化
  */
  @Watch("imgSrc")
  private watchSrc(newVal:any,oldVal:any) {
    console.log('newVal',newVal);
    this.imgUrl = newVal;
    // this.imgUrl =  require("@/assets/"+this.imgSrc);
  }

  /** 
   * 点击图片
  */
  private handleClick_img(){
      //改变全局状态
      let param={
          imgSrc:this.imgSrc,
          previewSrc: this.previewSrc !== ""? this.previewSrc :this.imgSrc
        }
      console.log("----->param",param);
      this.setImgViewUrl(param)
  }
}
</script>
<style scoped lang="scss">
  .imgView-img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: inherit;
  }
</style>
