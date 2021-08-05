<!--Grid布局例子1-->
<template>
  <div class="GExample1-template">
    <div class="a">A</div>
    <div class="b">B</div>
    <div class="c">C</div>
    <div class="d">D</div>
    <div class="e">E</div>
    <div class="f">F</div>
  </div>
</template>

<script lang="ts">
import {Component,Vue} from "vue-property-decorator";

@Component({})
export default class GExample1 extends Vue{

}
</script>

<style lang="scss">
.GExample1-template{
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 5px 5px;
  grid-template-areas: "A A A B E"
                       "C C C B E"
                       "F F D D D";

  .a{
    grid-area: A;
    background-color: aquamarine;
  }
  .b{
    grid-area: B;

    background-color: rgb(174, 255, 127);

  }
  .c{
    grid-area: C;
    background-color: rgb(255, 210, 127);

  }
  .d{
    grid-area: D;

    background-color: rgb(255, 157, 127);

  }
  .e{
    grid-area: E;

    background-color: rgb(127, 161, 255);

  }
  .f{
    grid-area: F;

    background-color: rgb(244, 127, 255);

  }

}
</style>