<!--- css计数器 新属性counter-reset，counter-increment --->
<template>
  <div class="cssCounter-template">
    <span>counter</span>
    <h1>这是h1的标签啊</h1>
    <h3>这是会h3的标签啊</h3>
    <h3>这是会h3的标签啊</h3>
    <h3>这是会h3的标签啊</h3>
    <h3>这是会h3的标签啊</h3>
    <h1>这是h1的标签啊</h1>
    <h1>这是h1的标签啊</h1>
    <h3>这是会h3的标签啊</h3>

    <hr/>
    <span>counters计数器嵌套</span>
    <ol>
      <li>item</li>
      <li>item</li>
      <li>item
        <ol>
          <li>item</li>
          <li>item</li>
        </ol>
      </li>
      <li>item
        <ol>
          <li>item</li>
          <li>item
            <ol>
              <li>item</li>
              <li>item</li>
            </ol>
          </li>
        </ol>
      </li>
      <li>item
        <ol>
          <li>item</li>
          <li>item
            <ol>
              <li>item</li>
              <li>item
                <ol>
                  <li>item</li>
                  <li>item</li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class CssCounter extends Vue {}
</script>

<style lang="scss">
// counter-reset 必需值，用于选择器，主要用来标识改作用域，其值可以自定义。(默认值none)
// counter-reset:[<indentifier> <integer>?]+ | none | inherit ;
// <indentifier>:定义计数器名称，这个名称可以是自定义的；<integer>:设置计数器的起始值，默认值为0，（如果设置为0，那计数从1开始；如果设置为-5，那计数从-4开始...）
// 亲测counter-reset必须放在要展示计数器的父元素或父级以上元素上 否则每渲染一个展示计数器的元素都会reset 并不会达到预期效果

//counter-increment 用标识计数器与实际相关联的范围。（默认值none）
// counter-increment:[<indentifier> <integer>?]+ | none | inherit ;
// <indentifier>:计数器名称，就调用counter-reset声明的计数器名称; <integer>:设置计数器的增长值，默认值为1，（可正可负）

// content 用来生成内容，其为:before、:after(::before、::after)的一个属性，在生成计数器内容，主要配合counter()一起使用

// counter() 用来设置插入计数器的值;

// counters() 实现计数器嵌套
.cssCounter-template {
  counter-reset: apple pier 2;
  span{
    color: rgb(93, 116, 218);
  }
  h1 {
    &::before {
      counter-increment: apple;
      content: counter(apple)".";
    }
  }
  h3{
    &::before{
      content: counter(pier)".";
      counter-increment: pier 3;
    }
  }

  ol{
    counter-reset: olli 0;
    list-style: none;
    li{
      &::before{
        counter-increment: olli 1;
        content: counters(olli,".");
      }
    }
  }
}
</style>