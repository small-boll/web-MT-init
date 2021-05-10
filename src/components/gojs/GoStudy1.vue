<!-- 流程图 第一课 -->
<template>
  <div class="gostudy1-template">
    <div class="gt-contain" id="myDiagramDiv"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import go from "gojs";
Component({});
export default class GoStudy1 extends Vue {
  private MAKE: any = new Object();
  private myDiagram: any = new Object();

  private mounted() {
    this.init();
  }
  private init() {
    this.MAKE = go.GraphObject.make;
    this.myDiagram = this.MAKE(go.Diagram, "myDiagramDiv", {
      "undoManager.isEnabled": true //启用Ctrl-Z撤消和Ctrl-Y重做
    });
    let myModel = this.MAKE(go.Model);
    myModel.nodeDataArray=[
        {key:"aa"},
        {key:"bb"},
        {key:"cc"},
        {key:"dd"},
    ];
    this.myDiagram.model = myModel;
  }
}
</script>

<style lang="scss" scoped>
.gostudy1-template {
  width: 100%;
  height: 100%;
  .gt-contain {
    width: 400px;
    height: 200px;
    background: darkcyan;
  }
}
</style>
