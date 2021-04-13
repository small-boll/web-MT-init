<template>
  <div id="app">
      <router-view
        v-watermark="{
          text: 'MThanos 3.0',
          textColor: 'rgba(153, 153, 153, .5)',
        }"
      />

    <div id="dragHideDiv"></div>
    <!-- 全局大图预览 -->
    <MTGlobalImgView></MTGlobalImgView>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import MTGlobalImgView from "@/controls/MTGlobalImgView.vue";
import "@/controls/base/Directives";
import MThanosColorMixin from "@/controls/mixins/MThanosColor";
import MThanosThemeMixin from "@/controls/mixins/MThanosTheme";

@Component({
  components: {
    MTGlobalImgView,
  },
  mixins: [MThanosColorMixin, MThanosThemeMixin], //颜色控件混入,主题控件混入
})
export default class App extends Vue {

}
</script>

<style lang="scss"></style>
