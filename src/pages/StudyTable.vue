<template>
  <div class="StudyTable-template">
    <el-button @click="goStudy('/GoStudy1')">查看gojs第一课</el-button>
    <el-button @click="goStudy('/MyCKEdit')">查看富文本第一课</el-button>
    <el-button @click="goStudy('/GridLayout')">查看3D动画</el-button>
    <el-button @click="goStudy('/CssStep')">css步骤条</el-button>
    <el-button @click="goStudy('/CssCounter')">css计数器</el-button>
    <el-button @click="goStudy('/GExample1')">网格布局1</el-button>
    <el-button @click="goStudy('/ClipPath')">裁减</el-button>
    <el-button @click="goStudy('/GridAndClipPath')">多图片不规则拼接</el-button>
    <el-button @click="goStudy('/MultipleColumnLayot')">分栏</el-button>
    <el-button @click="goStudy('/CssResize')">宽度拖拽</el-button>
    <el-button @click="goStudy('/AnimationSvg')">svg</el-button>
    <el-button @click="goStudy('/CssCustomStyle')">css自定义属性传值</el-button>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
Component({});
export default class StudyTable extends Vue {
  private goStudy(pathP) {
    this.$router.push({path:pathP});
  }
}
</script>

<style></style>
