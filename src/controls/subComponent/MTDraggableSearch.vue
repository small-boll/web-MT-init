<template>
  <draggable :list="controlList" :options="dragOptions2">
    <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
      <MTSearchItem :controlList="controlList" :uiModel="uiModel"></MTSearchItem>
    </transition-group>
  </draggable>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

import draggable from "vuedraggable";
//注册组件
@Component({
  components: {
    draggable,
    MTSearchItem: resolve =>
      require(["@/controls/subComponent/MTSearchItem.vue"], resolve)
  }
})
export default class MTDraggableSearch extends Vue {
  private name: string = "MTDraggableSearch";

  @Prop({
    default: {}
  })
  uiModel!: any;

  @Prop({
    default: []
  })
  controlList!: any;

  // 拖拽表单2
  private dragOptions2: any = {
    animation: 0,
    ghostClass: "ghost",
    group: {
      // 只允许放置shared的控件,禁止pull
      put: ["shared"]
    }
  };

  /**
   *组件加载完毕
   */
  private mounted() {
    // this.watchSrc();
  }
}
</script>
<style scoped lang="scss">
</style>
