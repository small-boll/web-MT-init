<template>
  <div class="StudyTable-template">
    <el-button @click="goStudy('/GoStudy1')">查看gojs第一课</el-button>
    <el-button @click="goStudy('/MyCKEdit')">查看富文本第一课</el-button>
    <el-button @click="goStudy('/GridLayout')">查看3D动画</el-button>
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
