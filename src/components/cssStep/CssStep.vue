<!--纯css制作步骤条-->
<template>
  <div class="CssStep-template">
    <div class="type-contain">
      <div class="tc-item"
           v-for="item in typeList"
           :key="item.id">
        {{item.name}}
      </div>
    </div>
    <div class="step-contain"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator"

@Component({})
export default class CssStep extends Vue {
  private typeList: Array<any> = [];
  private stepList = Array<any>();
  private mounted() {
    this.init();
  }
  private init() {
    this.typeList = [
      {
        id: 0,
        name: "全部",
      },
      {
        id: 1,
        name: "飞机票",
      },
      {
        id: 2,
        name: "火车票",
      },
      {
        id: 3,
        name: "住宿",
      },
      {
        id: 4,
        name: "上网",
      },
      {
        id: 5,
        name: "违法犯罪",
      },
      {
        id: 6,
        name: "在逃人员",
      },
    ];
    this.stepList = [
      {
        id: 1,
        summary: "天门 发现王大杰 聚众吸毒",
        time: "2019-10-28",
        reslut: "10月28日某某KTV聚众吸毒，抓捕过程中逃跑。",
      },
      {
        id: 2,
        summary: "购买火车票天门南 开往 汉口 03车厢",
        time: "2019-10-30 14:33:21",
        reslut: "布控过程中了解到，会跟其他吸毒人员碰头，暂缓抓捕行动",
      },
      {
        id: 3,
        summary: "到达 汉口站",
        time: "2019-10-31 10:21:00",
        reslut: "全程布控",
      },
      {
        id: 4,
        summary: "住宿 徐东 某某小区 某某地址中",
        time: "2019-10-31 21:00:00",
        reslut: "",
      },
      {
        id: 1,
        summary: "上网 某某网吧",
        time: "2019-10-31 21:42:41",
        reslut: "跟贩毒团伙QQ沟通，约见碰头地点",
      },
      {
        id: 1,
        summary: "收网抓捕",
        time: "2019-10-31 23:40:11",
        reslut: "犯罪团伙一网打尽，抓获贩毒人员3名",
      },
    ];
  }
}
</script>

<style lang="scss">
.CssStep-template {
  width: 100%;
  height: 100%;
  display: flex;
  .type-contain {
    width: 20%;
    height: 100%;
    margin: 0 5%;
    .tc-item{
      width: 100%;
      height: 40px;
      margin-bottom: 10px;
      text-align: center;
      position: relative;
      &::after{
        content: "";
        position: absolute;
        bottom: 0;
        left: calc(100%/ 2 - 2px);
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background-color: #0F6CD6;
      }
    }
  }
  .step-contain {
    width: 80%;
    height: 100%;
    background-color: cadetblue;
  }
}
</style>