<!-- clip-path裁减 例子 -->
<template>
  <div class="ClipPath-template">
    <h1>Images clipped with <code>clip-path</code>Property</h1>
    <div class="step1 left">
      <p class="text">SPORTS</p>
    </div>
    <div class="step1 top">
      <p class="text">TECHNOLOGY</p>
    </div>
    <div class="step1 right">
      <p class="text">FOOD</p>
    </div>
    <div class="step1 bottom">
      <p class="text">NATURE</p>
    </div>
    <hr>
    <div class="outer"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class ClipPath extends Vue {}
</script>

<style lang="scss">
.ClipPath-template {
  margin: 20px auto;
  padding: 40px 0;
  font-family: "Lato";
  max-width: 640px;
  > .step1 {
    display: inline-block;
    margin: 50px 0;
    width: 250px;
    height: 250px;
    border-radius: 200px;
    // filter滤镜 grayscale灰色滤镜 取值[0,1]之间
    filter: grayscale(0.9);
    cursor: pointer;
    .text {
      position: absolute;
      background: raba(200, 0, 0, 0.5);
      padding: 20px 0;
      top: 90px;
      width: 250px;
      opacity: 0;
      text-align: center;
      color: white;
      font-size: 1.4em;
      transition: .5s opacity;
    }
    &:hover {
      filter: none;
      & > .text {
        // 透明度，可控制某元素 显示隐藏
        opacity: 1;
      }
    }
  }
  .left .text {
    background: rgba(0, 0, 200, 0.5);
  }
  .right .text {
    background: rgba(200, 100, 0, 0.5);
  }
  .bottom .text {
    background: raba(0, 200, 0, 0.5);
  }
  .top {
    background: url("~@/assets/images/components/gridLayout/img7.jpg");
    background-size: 100% 100%;
    -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    position: relative;
    left: -125px;
    top: -130px;
  }
  .left {
    background: url("~@/assets/images/components/gridLayout/img8.jpg");
    background-size: 100% 100%;
    -webkit-clip-path: circle(50% at 50% 50%);
    position: relative;
  }
  .right {
    background: url("~@/assets/images/components/gridLayout/img10.jpg");
    background-size: 100% 100%;
    -webkit-clip-path: ellipse(20% 30% at 50% 50%);
    position: relative;
    top: -352px;
    left: 264px;
  }
  .bottom {
    background: url("~@/assets/images/components/gridLayout/img11.jpg");
    background-size: 100% 100%;
    -webkit-clip-path: inset(25% 0 25% 0 round 0 25%);
    position: relative;
    top: -220px;
    left: -126px;
  }

  // clip-path属性支持transition变形，但前提是相同的裁剪函数，及相同的参数个数
  .outer {
    width: 100px;
    height: 100px;
    background-color: coral;
    -webkit-clip-path: polygon(
      0 20%,
      20% 0,
      35% 0,
      45% 0,
      80% 0,
      100% 20%,
      100% 45%,
      100% 60%,
      100% 80%,
      80% 100%,
      20% 100%,
      0 80%
    );
    transition: 0.5s clip-path;
    &:hover {
      -webkit-clip-path: polygon(
        0 15%,
        15% 15%,
        15% 0,
        85% 0,
        85% 15%,
        100% 15%,
        100% 85%,
        85% 85%,
        85% 100%,
        15% 100%,
        15% 85%,
        0 85%
      );
    }
  }
}

// -webkit-clip-path 裁减
// 方法
// 1.使用polygon裁减多边形
// demo1:在一个宽高相等的div中裁减一个三角形 -webkit-clip-path:polygon(50% 0,100% 100%,0 100%)
// demo2:在一个宽高相等的div中裁减一个菱形 -webkit-clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)
// demo3:在一个宽高相等的div中裁减一个梯形 -webkit-clip-path:polygon(0 0,100% 0,75% 100%,25% 100%)

// 2.使用circle裁减一个圆形 需要传入三个值：半径 圆心坐标 at关键字定义圆心坐标
// demo1:在一个宽高相等的div中裁减一个最大的圆 -webkit-clip-path:circle(50% at 50% 50%)

// 3.使用ellipse裁减椭圆 需要传入四个字 x轴半径 y轴半径 圆心坐标 at关键字定义椭圆圆心坐标
// demo1:在一个宽高相等的div中裁减一个椭圆 -webkit-clip-path：ellipse(40% 30% at 50% 50% )

// 4.使用inset裁减一个矩形
// clip-path: inset(<距离元素上面的距离> <距离元素右面的距离> <距离元素下面的距离> <距离元素左面的距离> round <圆角边框> ），括号内的值类似于margin、padding值的写法，可以写一个值，也可以写多个值。
// demo1:在一个宽高相等的div中裁减一对角为圆角另一对角为直角的矩形 -webkit-clip-path:inset(25% 0 25% 0 round 0 25%)
</style>