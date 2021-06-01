<!--grid布局-->
<template>
  <div class="GridLayout-template">
    <h3>grid布局</h3>
    <div class="warpper">
      <div class="item div1">1</div>
      <div class="item div2">2</div>
      <div class="item div3">3</div>
      <div class="item div4">4</div>
      <div class="item div5">5</div>
      <div class="item div6">6</div>
      <div class="item div7">7</div>
      <div class="item div8">8</div>
      <div class="item div9">9</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
Component({});
export default class GridLayout extends Vue {
  private goStudy(pathP) {
    this.$router.push({ path: pathP });
  }
}
</script>

<style lang="scss" socped>
.GridLayout-template {
  .warpper {
    display: grid;
    grid-template-columns: 100px 100px 100px 200px 20px;
    grid-template-rows: 100px 50px 100px;
    //grid-template-columns指定每列的列宽 一个参数就只有一列 两个参数有两列 n个参数有n列
    //grid-template-rows指定每行的行宽 一个参数就只有一行 两个参数有两行 n个参数有n行
    //单位 可以是px %

    //repeat() 简化重复的值
    //grid-template-columns: 100px 100px 100px;(等同于grid-template-columns: repeat(3,100px))
      
    //auto-fill关键字 有时单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格
    //grid-template-columns: repeat(auto-fill, 100px);表示每列宽度100px，然后自动填充，直到容器不能放置更多的列。
     
    //fr 关键字 表示比例关系，也可以与绝对长度的单位结合使用，这时会非常方便。  
    //grid-template-columns: 1fr 2fr;表示列宽度后者是前者的两倍。
    //grid-template-columns: 150px 1fr 2fr;

    //minmax()函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。
    //grid-template-columns: 1fr 1fr minmax(100px, 1fr); minmax(100px, 1fr)表示列宽不小于100px，不大于1fr。

    //auto 关键字 表示由浏览器自己决定长度
    //grid-template-columns: 100px auto 100px;第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了min-width，且这个值大于最大宽度

    //grid-template-columns属性和grid-template-rows属性里面，还可以使用方括号，指定每一根网格线的名字，方便以后的引用
    //grid-template-columns:[c1] 100px [c2] 100px [c3]auto [c4];
    //grid-template-rows:[r1] 100px [r2] 100px [r3] auto [r4];
    //3行x3列 故有四根垂直网格线和四根水平网格线，方括号中依次是这八根线的名字，网格布局允许一根线有多个名字 如[fifth-line row-5]
   
    //grid-row-gap属性设置行间距，grid-columns-gap属性设置列间距
    .item {
      &.div1 {
        background-color: coral;
      }
      &.div2 {
        background-color: rgb(207, 172, 13);
      }
      &.div3 {
        background-color: rgb(80, 255, 133);
      }
      &.div4 {
        background-color: rgb(80, 170, 255);
      }
      &.div5 {
        background-color: rgb(200, 80, 255);
      }
      &.div6 {
        background-color: rgb(218, 3, 121);
      }
      &.div7 {
        background-color: rgb(243, 166, 0);
      }
      &.div8 {
        background-color: rgb(55, 168, 3);
      }
      &.div9 {
        background-color: rgb(255, 0, 0);
      }
    }
  }
}
</style>