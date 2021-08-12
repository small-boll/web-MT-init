<template>
  <div class="MultipleColumnLayot-template">
    <!-- <p>
      Madam Curie was born in Poland in 1867 and she is a French physicist. When studying in Paris, she lived a poor life but worked very hard. She married with Pierre Curie in 1859 when they
      discovered polonium and radium. Thanks to this great discovery, she and her husband won the Nobel Prize. In 1911, Madam Curie won the Nobel Prize again after the death of her husband, making her
      become the only woman who had won two Nobel Prizes in the word. As a pioneer of successful woman, Madam Curie’s example had a remarkable influence on the whole world. Although she was famous,
      she cared little about money and fame and still went on with her scientific research.
    </p>
    <p class="rule">
      Madam Curie was born in Poland in 1867 and she is a French physicist. When studying in Paris, she lived a poor life but worked very hard. She married with Pierre Curie in 1859 when they
      discovered polonium and radium. Thanks to this great discovery, she and her husband won the Nobel Prize. In 1911, Madam Curie won the Nobel Prize again after the death of her husband, making her
      become the only woman who had won two Nobel Prizes in the word. As a pioneer of successful woman, Madam Curie’s example had a remarkable influence on the whole world. Although she was famous,
      she cared little about money and fame and still went on with her scientific research.
    </p> -->
    <div class="mclt-span">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error pariatur suscipit facilis veritatis laborum dolorem ipsam totam accusamus rem non unde, blanditiis veniam quaerat porro dolor
        dolorum reiciendis temporibus tenetur.Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      <h2>Title Lorem ipsum dolor sit amet consectetur adipisicing elit title</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error pariatur suscipit facilis veritatis laborum dolorem ipsam totam accusamus rem non unde, blanditiis veniam quaerat porro dolor
        dolorum reiciendis temporibus tenetur.Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class MultipleColumnLayot extends Vue {}
</script>

<style lang="scss">
.MultipleColumnLayot-template {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  > p {
    width: 800px;
    // column-count分栏属性 column-count:3;指定分成三栏
    column-count: 3;
    font-size: 16px;
    line-height: 2;
    &.rule {
      // column-rule设置列与列之间的样式（与border写法类似），指定列之间的装饰线
      column-rule: 1px dashed #aaa;
      // column-gap设置列与列之间的间距 默认1em
      column-gap: 2em;
    }
  }
  .mclt-span{
    width: 850px;
    column-count: 3;
    font-size: 16px;
    line-height: 2;
    column-rule: 2px solid #aaa;
    column-gap: 2em;

    h2{
      font-weight: bold;
      margin: 14px 0;
      font-size: 24px;
      line-height: 1.4;
      // column-span设置元素能跨越多行多列展示,取值all,none,即代表要么跨越所有列，要么就不跨越;
      column-span: all;
    }
  }
}
</style>