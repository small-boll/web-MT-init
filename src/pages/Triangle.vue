<!--绘制三角形-->
<template>
  <div class="triangle-template">
      <div class="conatin">
          <p>border 绘制（绘制三角形的容器不给定宽高）</p>
          <div class="triangle1">
          </div>
      </div>
      <div class="conatin">
          <p>linear-gradient 绘制（线性渐变）</p>
          <div class="triangle2"></div>
      </div>
      <div class="conatin"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default class Triangle extends Vue {}
</script>

<style lang="scss">
@import "~@/assets/css/pages/Triangle.scss";
</style>
