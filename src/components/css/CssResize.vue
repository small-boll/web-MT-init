<template>
  <div class="CssResize-template">
    <!-- 拉动初始版1.0 -->
    <p class="drag">使用 resize 实现拖拽功能什么是 resize ？将 resize 运用于图片拖拽切换借助多一层嵌套及绝对定位实现隐藏滚动条借助伪元素，显示拖拽条总结一下最后</p>

    <!-- 拉动初始版1.1 -->
    <div class="outer1">
      <div class="inner1"></div>
    </div>

    <!-- 拉动初始版1.2 去除滚动条 -->
    <div class="outer2">
      <div class="inner2">
        <div class="resize2"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class CssResize extends Vue {}
</script>

<style lang="scss">
.CssResize-template {
  width: 100%;
  height: 100%;
  margin: auto 0;
  .drag {
    width: 200px;
    height: 200px;
    resize: horizontal;
    overflow: scroll;
  }
  .outer {
    width: 800px;
    height: 500px;
    background-image: url("~@/assets/images/components/gridLayout/img8.jpg");
    background-size: 100% 100%;
    margin: 26px;
    border: 6px solid rgb(202, 202, 202);
  }
  .inner {
    width: 788px;
    min-height: 18px;
    max-height: 488px;
    background-image: url("~@/assets/images/components/gridLayout/img8.jpg");
    background-size: 100%;
    filter: grayscale(1);
    resize: vertical;
    overflow: scroll;
  }
  .outer1 {
    @extend .outer;
    .inner1 {
      @extend .inner;
    }
  }

  .outer2 {
    @extend .outer;
    position: relative;
    .inner2 {
      // @extend .inner;
      position: absolute;
      top: 0;
      left: 0;
      height: 488px;
      min-width: 18px;
      max-width: 788px;
      background-image: url("~@/assets/images/components/gridLayout/img8.jpg");
      background-size: cover;
      filter: grayscale(1);
      .resize2 {
        width: 0;
        height: 488px;
        min-width: 18px;
        max-width: 788px;
        resize: horizontal;
        overflow: scroll;
      }
      
    }
  }
}
//resize取值none,both(横向纵向皆可拖动),horizontal(可横向拖动),vertical(可纵向拖动),block,inline,
//resize的生效需要配合 overflow：scroll使用。
// 不过 准确的说法是：overflow不是visible,或者可以直接作用于替换元素如图像、<video>、<iframe>、<textarea>等
// 可配合容器的max-height,max-width,min-height,min-width限制可拖拽改变的一个范围
</style>