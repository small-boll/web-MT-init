<!--纯css制作步骤条-->
<template>
  <div class="CssStep-template">
    <div class="type-contain">
      <div class="tc-item"
           v-for="typeItem in typeList"
           :key="typeItem.id"
           @click="filter(typeItem.name)">
        {{typeItem.name}}
      </div>
    </div>
    <div class="step-contain">
      <div v-for="stepItem in stepList"
           :key="stepItem.id"
           class="step-item"
           :class="{'active-step-item':stepItem.type=='b'}">
        <div class="step-style-contain">
          <div class="circle"
               :class="{'active-circle':stepItem.type=='b'}">
            <div class="inner-circle"
                 :class="{'active-inner-circle':stepItem.type=='b'}"></div>
          </div>
          <div class="dashed-contain">
            <template v-if="stepItem.type!='b'">
              <div v-for="deshedI in 6"
                   :key="deshedI"
                   class="deshed"></div>
            </template>

          </div>
        </div>
        <div class="step-content">
          <div class="title">
            <span>{{stepItem.time}}</span>
            <span>{{stepItem.summary}}</span>
          </div>
          <div class="reslut">
            <span>{{stepItem.reslut}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

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
        type: "a",
      },
      {
        id: 2,
        summary: "购买火车票天门南 开往 汉口 03车厢",
        time: "2019-10-30 14:33:21",
        reslut: "布控过程中了解到，会跟其他吸毒人员碰头，暂缓抓捕行动",
        type: "b",
      },
      {
        id: 3,
        summary: "到达 汉口站",
        time: "2019-10-31 10:21:00",
        reslut: "全程布控",
        type: "b",
      },
      {
        id: 4,
        summary: "住宿 徐东 某某小区 某某地址中",
        time: "2019-10-31 21:00:00",
        reslut: "",
        type: "a",
      },
      {
        id: 5,
        summary: "上网 某某网吧",
        time: "2019-10-31 21:42:41",
        reslut: "跟贩毒团伙QQ沟通，约见碰头地点",
        type: "b",
      },
      {
        id: 6,
        summary: "收网抓捕",
        time: "2019-10-31 23:40:11",
        reslut: "犯罪团伙一网打尽，抓获贩毒人员3名",
        type: "b",
      },
    ];
  }
  private filter(name) {
    this.stepList = [
      {
        id: 1,
        summary: "购买火车票天门南 开往 汉口 03车厢",
        time: "2019-10-30 14:33:21",
        reslut: "布控过程中了解到，会跟其他吸毒人员碰头，暂缓抓捕行动",
      },
      {
        id: 2,
        summary: "到达 汉口站",
        time: "2019-10-31 10:21:00",
        reslut: "全程布控",
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
  color: #fff;
  background: #142c47;
  .type-contain {
    width: 20%;
    height: 100%;
    margin: 0 5%;
    .tc-item {
      width: 100%;
      height: 40px;
      margin-bottom: 10px;
      text-align: center;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: calc(100% / 2 - 2px);
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background-color: #0f6cd6;
      }
    }
  }
  .step-contain {
    width: 80%;
    height: 100%;
    .step-item {
      display: flex;
      &.active-step-item {
        &:nth-of-type(2n) {
          // .circle {
          //   position: relative;
          //   z-index: 2;
          // }
          .step-style-contain {
            position: relative;
            z-index: 1;
            .dashed-contain {
              position: absolute;
              top: 7px;
              left: 0;
              height: 100%;
              width: 100%;
              background: #f7b500;
              .deshed {
                background-color: #f7b500;
              }
            }
          }
        }
      }
      .step-style-contain {
        width: 14px;
        margin: 0 14px;
        .circle {
          position: relative;
          z-index: 2;
          width: 14px;
          height: 14px;
          border-radius: 7px;
          background-color: #0f6cd687;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active-circle {
            background-color: #fff;
          }
          .inner-circle {
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #0f6cd6;
            &.active-inner-circle {
              background-color: #f7b500;
            }
          }
        }
        .dashed-contain {
          width: 14px;
          .deshed {
            width: 2px;
            height: 6px;
            margin: 2px 6px;
            background-color: #0f6cd6;
          }
        }
      }
      .step-content {
        font-family: STHeitiSC-Medium, STHeitiSC;
        .title {
          margin-bottom: 6px;
          font-size: 14px;
        }
        .reslut {
          font-size: 12px;
        }
      }
    }
  }
}
</style>