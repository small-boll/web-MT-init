<template>
  <svg :class="class_name" aria-hidden="true">
    <use :xlink:href="icon_name" />
  </svg>
</template>
 

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";

@Component({})
export default class MTSvgIcon extends Vue {
  @Prop({ default: "" }) iconClass!: string; // 图片地址
  @Prop({ default: "" }) className!: string; // 预览图片地址

  mounted() {
    this.icon_name = `#icon-${this.iconClass}`;
    if (this.className) {
      this.class_name = "svg-icon " + this.className;
    } else {
      this.class_name = "svg-icon";
    }
  }
  private icon_name: string = "";
  private class_name: string = "svg-icon";

  @Watch("iconClass", {
    deep: true
  })
  private iconName(newVal: string, oldVal: string) {
    this.icon_name = `#icon-${this.iconClass}`;
  }

  @Watch("className", {
    deep: true
  })
  private svgClass(newVal: string, oldVal: string) {
    if (this.className) {
      this.class_name = "svg-icon " + this.className;
    } else {
      this.class_name = "svg-icon";
    }
  }
}
</script>
 
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>