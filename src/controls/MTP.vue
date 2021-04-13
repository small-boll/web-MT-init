<!--文本溢出组件-->
<template>
  <el-tooltip
    :disabled="!showTooltip"
    class="item"
    effect="dark"
    :content="String(text)"
    :placement="placement"
  >
    <p :ref="refName" class="MTP-template" :class="{moreRow:row != 1}" :style="{'-webkit-line-clamp': String(row)}">
      <slot></slot>
      {{ text }}
    </p>
  </el-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import moment from "moment";

@Component({})
export default class MTP extends Vue {
  @Prop({ default: "" }) text!: any; //文字内容
  @Prop({ default: 1 }) row!: number; //几行，默认1行
  @Prop({ default: false }) noTooltip!: boolean; //是否禁用tooltip
  @Prop({ default: "top-start" }) placement!: string; //tooltip出现的位置


  private refName: string = "refName"; //ref
  private showTooltip: boolean = false; //是否显示Tooltip，根据文字长度来判断是否显示

  created(){
    //给dom设置唯一ref
    this.refName = 'refName_'+ moment().valueOf() + Math.floor(Math.random()*1000000000) 
    let that:any = this;
    window.addEventListener("resize", function() {
      that.ifShowTooltip()
    });
  }

  @Watch('text')
  private WatchText(){
    this.$nextTick(()=>{
      this.ifShowTooltip()
    })
  }

  @Watch('row')
  private WatchRow(){
    this.$nextTick(()=>{
      this.ifShowTooltip()
    })
  }

  /**
   * 组件加载完成
   */
  private mounted() {
    this.ifShowTooltip()
        
  }

  /** 
   * 是否显示tooltip
  */
  private ifShowTooltip(){
    this.showTooltip = false

    let $target:any = this.$refs[this.refName];
    
            
    if(this.noTooltip == true){
        this.showTooltip = false
    }else {
        if(this.row == 1){
          let scrollWidth =  $target.scrollWidth;
          let domWidth =  $target.offsetWidth;
          // console.log('$target---->',$target)
          // console.log('scrollWidth---->',scrollWidth)
          // console.log('domWidth---->',domWidth)
          if(scrollWidth > domWidth ){
              this.showTooltip = true;
          }
        }else {
          let scrollHeight =  $target.scrollHeight;
          let domHeight =  $target.offsetHeight;
          // console.log('$target---->',$target)
          // console.log('scrollHeight---->',scrollHeight)
          // console.log('domHeight---->',domHeight)
          if(scrollHeight > domHeight ){
              this.showTooltip = true;
          }

        }
    }
    // console.log('this.showTooltip----->',this.showTooltip)
  }
}
</script>
<style lang="scss">
    .MTP-template {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.moreRow {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            white-space: normal;
        }

    }
</style>
