<!-- 帮助 -->
<template>
  <div class="LayoutHelp-template">
    <el-button class="help-btn" type="primary" @click="drawer = true"
      >工作指引</el-button
    >

    <el-drawer
      title="工作指引"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      :modal="false"
      size="350px"
    >
      <div class="help-quick">
        <el-button type="primary" icon="el-icon-guide" >新手指引</el-button>
      </div>
      <div class="help-wrapper">
        
        <el-scrollbar class="common-scroll-y">
          <ul>
            <li
              class="help-block"
              v-for="(item, index) in helpArr"
              :key="index"
            >
              <el-button type="primary" class="help-index">{{
                index + 1
              }}</el-button>
              <div class="help-body">
                <el-button
                  type="primary"
                  size="small"
                  class="fun-name"
                  plain
                  @click="handleClick_func(item)"
                  >{{ item.funcName }}</el-button
                >
                <p>{{ item.intro }}</p>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import path from "path";

//基础组件

@Component({
  components: {},
})
export default class LayoutHelp extends Vue {
  @Prop({ default: () => [] }) currentMenuObj!: any; //当前菜单对象  {menuData:{},menuItem:{}}

  private drawer: boolean = false;

  private helpArr: any = [
    {
      funcName: "集成配置",
      intro: "配置个人工作账号",
    },
    {
      funcName: "工作日志",
      intro: "记录每天工作内容和明日计划",
    },
    {
      funcName: "个人工作台",
      intro: "查看个人工作概况及待办事项",
    },
    {
      funcName: "前端技术栈",
      intro: "集成各种前端网站，方便培训学习",
    },
    {
      funcName: "集成配置",
      intro: "配置个人工作账号",
    },
    {
      funcName: "切换皮肤",
      intro: "选择自己喜欢的系统皮肤",
    },
    {
      funcName: "用户管理",
      intro: "查看系统用户状态",
    },
  ];

  private created() {}

  /**
   * 组件加载完成
   */
  private mounted() {}

  /**
   * 点击功能名称按钮
   */
  private handleClick_func(item: any) {
    this.$emit("handleClick_funcName", item);
  }

  /**
   * 点击关闭按钮
   */
  private handleClose() {
    this.drawer = false;
  }
}
</script>
<style lang="scss">
.LayoutHelp-template {
  .help-btn {
    position: fixed;
    top: 70px;
    right: 0;
    height: 30px;
    padding: 0 5px 0 10px;
    border-radius: 15px 0 0 15px;
  }
  .el-drawer__body {
    width: 100%;
    padding: 0 10px 20px 10px;
  }
  .help-quick {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding-bottom: 30px;
    color: #409eff;
    cursor: pointer;
    border-bottom: 1px dashed #eee;
    margin-bottom: 20px;

    .el-button {
      border-radius: 18px;
      padding: 0 20px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 18px;
      }
    }
  }

  .help-wrapper {
    height: calc(100% - 50px);
    width: 100%;

    .help-block {
      position: relative;
      display: flex;
      padding-bottom: 20px;
      margin: 0 20px;

      &:first-child {
        &::before {
          content: none;
        }
      }
      &:last-child {
        &::after {
          content: none;
        }
      }

      &:before {
        content: "";
        width: 1px;
        height: 8px;
        border-right: 1px dashed #ccc;
        position: absolute;
        top: 0;
        left: 9px;
      }

      &:after {
        content: "";
        width: 1px;
        height: calc(100% - 28px);
        border-right: 1px dashed #ccc;
        position: absolute;
        bottom: 0;
        left: 9px;
      }

      .help-index {
        display: block;
        height: 21px;
        width: 21px;
        padding: 0;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 13px;
        margin-right: 15px;
        margin-top: 8px;
        cursor: unset;

        &:hover,
        &:focus {
          background-color: !important;
        }
      }
      .help-body {
        width: calc(100% - 40px);
        .fun-name {
          border-radius: 20px;
          font-size: 16px;
          margin-bottom: 5px;
        }

        & > p {
          font-size: 14px;
          line-height: 24px;
          padding-left: 18px;
          color: #666;
        }
      }
    }
  }
}

.theme-commonDark {
  .LayoutHelp-template {
    .help-block {
      &:before,
      &:after {
        border-right: 1px dashed rgba(#fff, 0.3) !important;
      }

      .help-body {
        & > p {
          color: rgba(#fff, 0.85) !important;
        }
      }
    }
  }
}
</style>
