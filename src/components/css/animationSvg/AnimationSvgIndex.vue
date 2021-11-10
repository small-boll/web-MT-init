<template>
  <div class="AnimationSvgIndex-template">
    <h1>svg初接触</h1>
    <text>SVG 指的是可伸缩矢量图形 (Scalable Vector Graphics),
      它用来定义用于网络的基于矢量的图形，使用 XML 格式定义图形;SVG 文件必须使用 .svg 后缀来保存</text>
    <div>
      <svg version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           xml:space="preserve"
           class="circle-load-rect-svg"
           width="300"
           height="200"
           viewbox="0 0 600 400">
        <!-- <polyline points="5 5, 575 5, 575 200, 5 200"
                  class="g-rect-path" />
        <polyline points="5 5, 575 5, 575 200, 5 200"
                  class="g-rect-fill" /> -->
                  <path d="M10 10"></path>
      </svg>
      <!-- svg 标签属性介绍
          version: 表示<svg>的版本，目前只有1.0,1.1两种
          xmlns: http://www.w3.org/2000/svg 固定值
          xmlns:xlink :http://www.w3.org/1999/xlink 固定值
          xml:space :preserve 固定值，以上三个固定值表示命名空间，当数据单独存在svg文件内，三者不可省略
          class :就是咱熟知的class
          heiht|width :规定画布的大小
          viewbox :规定画布上可以显示的区域，当viewbox和svg不同时，viewbox会缩放至svg同等大小

          定义好svg标签之后就可以在svg里面添加图形标签了，例如：path,rect,circle,polyline等

          svg基本形状介绍
          path:是svg的基本形状中最强大的一个，可以创造 任何形状。
          polyline：是svg的一个基本形状，用来创建一系列直线连接多个点。
          （polyline 是个相对 不常用的形状，较为常用的是path,rect,circle等，
          但是polyline 的stroke-linejoin和stroke-linecap属性 能在线段）

      
          vue中如何使用svg请查看教程
      
      
       -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class AnimationSvgIndex extends Vue {}
</script>

<style>
</style>