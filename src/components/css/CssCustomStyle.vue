<!--
css自定义属性传值
一直想从js里面传值给到css 的想法 可以用这个实现了 才发现有这用法
放在style属性里面 并且变量名 一定要以--开头,css里面使用var()引用 
--->
<template>
  <div class="CssCustomStyle-template">
    <el-button class="btn1" :style="{'--btn-width1':btnWidth1}">自定义样式-宽度</el-button>
    <div class="bgcolor" style="--my-color:#ff0"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default class CssCustomStyle extends Vue {
  private btnWidth1:string="300px"
}
</script>

<style lang="scss">
.CssCustomStyle-template{
  .btn1{
    width: var(--btn-width1);
  }
  @property --my-color{
    syntax:'<color>';
    inherit:false;
    initial-value:#c0ffee;
    // syntax：语法
    // @property --my-color：声明一个自定义属性 --mycolor
    // inherits：是否允许继承
    // initial-value：初始值
  }
  // .bgcolor:{}
}
</style>