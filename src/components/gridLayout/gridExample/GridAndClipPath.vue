<!-- grid and clip-path 结合 制成不规则图片拼图 -->
<template>
  <div class="GridAndClipPath-template">
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc1.jpeg">
    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc2.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc3.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc4.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc5.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc6.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc7.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc8.jpeg">

    </div>
    <div class="gcpt-item">
      <img class="gcpt-i-img"
           src="~@/assets/images/components/gridLayout/GridClipPath/gc9.jpeg">

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class GridAndClipPath extends Vue {}
</script>

<style lang="scss">
.GridAndClipPath-template {
  padding: 0.8rem;
  background: black;
  height: 95vh;
  min-height: 500px;
  width: 100%;
  max-width: 600px;
  margin: auto;
  margin-top: 2.5vh;
  border: 1px solid #c9b473;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 0.7fr 0.3fr 1fr;
  grid-template-rows: 20% 40% 20% 20%;
  grid-template-areas:
    "one two two three"
    "four five five five"
    "six five five five"
    "six seven eight eight";
  .gcpt-item {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      .gcpt-i-img {
        width: 120%;
        height: 120%;
      }
    }
    &:first-child {
      grid-area: one;
      -webkit-clip-path: polygon(0 0, 93.24% 0%, 105.04% 110.16%, 0 90%);
    }
    &:nth-child(2) {
      grid-area: two;
      -webkit-clip-path: polygon(
        0 0,
        108.28% 0,
        94.45% 110.13%,
        10.55% 110.93%
      );
    }
    &:nth-child(3) {
      grid-area: three;
      -webkit-clip-path: polygon(15.05% 0, 100% 0, 99.35% 91.7%, 3.08% 108.48%);
    }
    &:nth-child(4) {
      grid-area: four;
      -webkit-clip-path: polygon(
        0 -0.85%,
        106.34% 9.98%,
        121.32% 65.63%,
        99.66% 109.89%,
        1.86% 124.41%
      );
      .gcpt-i-img {
        width: 135%;
        height: 135%;
      }
    }
    &:nth-child(5) {
      grid-area: five;
      -webkit-clip-path: polygon(
        6.4% 6.48%,
        47.24% 5.89%,
        100% 0,
        98.41% 96.85%,
        53.37% 100%,
        53% 63.21%,
        3.23% 73.02%,
        14.3% 44.04%
      );
    }
    &:nth-child(6) {
      grid-area: six;
      -webkit-clip-path: polygon(
        2.14% 29.3%,
        99.34% 15.42%,
        98.14% 100.82%,
        1.57% 101.2%
      );
    }
    &:nth-child(7) {
      grid-area: seven;
      -webkit-clip-path: polygon(
        7.92% 33.47%,
        96.31% 23.39%,
        95.38% 100%,
        5.03% 100.85%
      );
    }
    &:nth-child(8) {
      grid-area: eight;
      -webkit-clip-path: polygon(2.5% 22.35%, 100% 0, 100% 100%, 1.55% 100%);
    }
    &:nth-child(9) {
      grid-row-start: 3;
      grid-row-end: 4;
      grid-column-start: 2;
      grid-column-end: 4;
      -webkit-clip-path: polygon(
        5.94% 28.66%,
        100.61% -0.67%,
        101.1% 108.57%,
        5.4% 126.28%
      );
      .gcpt-i-img{
        object-position: 30% 50%;
        height: 135%;
      }
    }
    .gcpt-i-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 40% 0;
    }
  }
}
</style>