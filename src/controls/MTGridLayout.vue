<!----拖拽布局组件---->
<template>
  <div class="MTGridLayout-template">
    <div class="MTGridLayout-wrapper" ref="gridLayoutContainer">
      <!-- // 最外大的grid，绑定了testLayout的值，这样testLayout 会随着用户的拖拽放大缩小改变 可以参考官方的实例 -->
      <grid-layout
        ref="gridLayout"
        :layout.sync="layoutArray"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :auto-size="true"
        :responsive="responsive"
        :vertical-compact="false"
        :margin="margin"
        :use-css-transforms="true"
        @layout-created="layoutCreatedEvent"
        @layout-before-mount="layoutBeforeMountEvent"
        @layout-mounted="layoutMountedEvent"
        @layout-ready="layoutReadyEvent"
        @layout-updated="layoutUpdatedEvent"
        @breakpoint-changed="breakpointChangedEvent"
        @updateWidth="updateWidth"
      >
        <!-- // 遍历testLayout生成item -->
        <grid-item
          :class="{ 'vue-grid-item-edit': draggable, 'vue-grid-item-normal': !draggable }"
          v-for="item in layoutArray"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          @resize="resizeEvent"
          @move="moveEvent"
          @resized="resizedEvent"
          @container-resized="containerResizedEvent"
          @moved="movedEvent"
        >
          <div class="assistor" @click="clickCheck(item.i)">
            <!-- // 定义一个关闭按钮实现删除当前的 -->
            <div class="close-icon" v-if="draggable" @click="deleteComponent(item.i)">
              <i class="el-icon-close"></i>
            </div>
            <!--<h4 style="margin-bottom:10px">{{item.title}}</h4>-->
            <!-- // 这里使用component来显示组件。 -->
            <component
              :ref="'custom_' + item.i"
              :id="'custom_' + item.i"
              :is="item.component"
              v-bind="item"
              :width="item.width"
              :height="item.height"
              :option="item.option"
              style="padding-bottom:20px"
            ></component>
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <div class="MTGridLayout-set" v-if="draggable" :class="{ 'isHide': !isShowSetPopover }">
      <div class="MTGridLayout-set-wrapper">
        <!-- 伸缩按钮 -->
        <el-button
          v-if="isShowSetPopover"
          class="arrow-btn"
          type="primary"
          icon="el-icon-arrow-right"
          circle
          @click="isShowSetPopover = false"
        ></el-button>
        <el-button
          v-else
          class="arrow-btn"
          type="primary"
          icon="el-icon-arrow-left"
          circle
          @click="isShowSetPopover = true"
        ></el-button>

        <el-tabs
          class="MTGridLayout-tab"
          v-model="activeName"
          :stretch="true"
          @tab-click="handleClick"
        >
          <el-tab-pane label="公共组件" name="controlList">
            <el-scrollbar class="common-scroll-y">
              <el-button
                class="componentBtn"
                v-loading="loading"
                v-for="(cl, index) in controlList"
                :key="'cl' + index"
                @click="clickAddControl(cl)"
              >
                {{
                cl.title
                }}
              </el-button>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="组件属性" name="controlAttr">
            <el-scrollbar class="common-scroll-y">
              <template v-if="Object.keys(formOption).length > 0">
                <component
                  :ref="'customOption_' + currentControl.i"
                  :id="'customOption_' + currentControl.i"
                  :is="currentControl.attribute"
                  v-bind="currentControl"
                  :option="formOption"
                  @onSubmit="onSubmitAttr"
                ></component>
              </template>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="页面属性" name="pageAttr">
            <el-scrollbar class="common-scroll-y">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <el-button type="primary" @click="onPreview">预览</el-button>
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                </div>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                  <el-form-item label="页面名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="背景图片">
                    <UploadPhoto
                      :imgUrl="form.image"
                      @uploadSuccess="uploadSuccess"
                      @removeFile="removeFile"
                      innerText
                      :limit="1"
                    ></UploadPhoto>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch, Provide } from "vue-property-decorator";
import VueGridLayout from "vue-grid-layout"; // vue 项目中
//import { timeSplitFilter } from "@/utils/filters";
import moment from "moment";
import UploadPhoto from "@/controls/MTUploadPhoto.vue"; //换颜色
const GridLayout = VueGridLayout.GridLayout;
const GridItem = VueGridLayout.GridItem;

@Component({
  components: {
    GridLayout, //注册组件
    GridItem, // 注册
    UploadPhoto,
  },
})
export default class MTGridLayout extends Vue {
  private name: string = "MTGridLayout";

  @Prop({
    default: {},
  })
  layoutConfig!: any;

  @Prop({
    default: [],
  })
  controlList!: any;

  @Prop({
    default: true,
  })
  draggable!: boolean;

  @Prop({
    default: true,
  })
  resizable!: boolean;

  private isShowSetPopover: boolean = true;
  private rowHeight: number = 30;
  private columnWidth: number = 76;
  private columnHeight: number = 38;
  private windowWidth: number = 0;

  private layoutArray: any = [];
  private responsive: boolean = false;
  private activeName: string = "controlList";
  private form: any = {};
  private loading: boolean = false;
  private currentControl: any = {
    option: {},
  };
  //private span: number = 19;
  private margin: any = [5, 5];
  private colNum = 12;
  private formOption = {};

  private calc = [20, 20];

  private rules = {
    name: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
  };

  private async created() {
    //debugger;
    if (!!this.layoutConfig) {
      this.layoutArray = this.layoutConfig.layoutArray || [];
      this.form = this.layoutConfig.form
        ? this.layoutConfig.form
        : new Object();
    }
    if (!this.draggable) {
      this.calc = [0, 0];
    }
  }

  private mounted() {
    let that: any = this;
    //debugger;
    that.windowWidth = that.$refs.gridLayoutContainer.offsetWidth;
    that.columnWidth =
      (this.windowWidth - this.margin[0] * (this.colNum + 1)) / this.colNum;
    // that.columnHeight = Math.round(
    //   (this.rowHeight + this.margin[1]) / (this.rowHeight + this.margin[1])
    // );
  }
  private destroyed() {
    this.layoutArray = [];
    this.currentControl = {};
  }

  private deleteComponent(id: any) {
    this.formOption = {};
    this.currentControl = {};
    let index = this.layoutArray.findIndex((item: any) => {
      return item.i == id;
    });
    if (index < 0) {
      return;
    }
    this.layoutArray.splice(index, 1);
  }

  private layoutCreatedEvent(newLayout: any) {
    console.log("Created layout: ", newLayout);
  }

  private layoutBeforeMountEvent(newLayout) {
    console.log("beforeMount layout: ", newLayout);
  }

  private layoutMountedEvent(newLayout) {
    console.log("Mounted layout111: ", newLayout);
  }

  private layoutReadyEvent(newLayout) {
    console.log("Ready layout---newLayout: ", newLayout);
  }

  private layoutUpdatedEvent(newLayout) {
    console.log("Ready layout2222: ", newLayout);
  }

  private breakpointChangedEvent(newBreakpoint, newLayout) {
    console.log(
      "BREAKPOINT CHANGED breakpoint=",
      newBreakpoint,
      ", layout: ",
      newLayout
    );
  }

  private resizeEvent(i, newH, newW, newHPx, newWPx) {
    console.log("大小正在改变", i, newH, newW, newHPx, newWPx);
  }
  private moveEvent(i, newX, newY) {
    console.log("正在移动", i, newX, newY);
  }
  private resizedEvent(i, newH, newW, newHPx, newWPx) {
    let custom: any = this.$refs["custom_" + i][0] as HTMLFormElement;
    custom = custom.setWidthHeight(newWPx - 22, newHPx - 22);
    console.log("大小改变完了", i, newH, newW, newHPx, newWPx);
  }
  private movedEvent(i, newX, newY) {
    console.log("移动结束了", i, newX, newY);
  }

  /**
   *
   * @param i the item id/index
   * @param newH new height in grid rows
   * @param newW new width in grid columns
   * @param newHPx new height in pixels
   * @param newWPx new width in pixels
   *
   */
  private containerResizedEvent(i, newH, newW, newHPx, newWPx) {
    let custom: any = this.$refs["custom_" + i][0] as HTMLFormElement;
    custom.setWidthHeight(newWPx - this.calc[0], newHPx - this.calc[1]);
    //debugger;
    console.log(
      "CONTAINER RESIZED i=" +
        i +
        ", H=" +
        newH +
        ", W=" +
        newW +
        ", H(px)=" +
        newHPx +
        ", W(px)=" +
        newWPx
    );
  }

  private handleClick(tab, event) {
    console.log(tab, event);
  }
  /**添加组件 */
  private clickAddControl(item: any) {
    if (!!item) {
      this.loading = true;
      let id = moment().format("YYYYMMDDHHmmssS");
      this.currentControl = {
        x: 0,
        y: 0,
        w: item.width,
        h: item.height,
        width: 0,
        height: 0,
        i: id.toString(),
        component: item.name,
        attribute: item.attribute,
        option: item.option,
        title: item.title,
      };
      const width = this.tileWidth(this.currentControl) - 15;
      this.$set(this.currentControl, "width", width);
      const height = this.tileHeight(this.currentControl) - 15;
      this.$set(this.currentControl, "height", height);
      this.layoutArray.push(this.currentControl);
      this.clickControlAttrShow();
      this.loading = false;
    }
  }

  /**显示属性 */
  private clickControlAttrShow() {
    let that = this;
    //debugger;
    const i = (this.currentControl as any).i;
    let timer = setTimeout(() => {
      let custom: any = that.$refs["custom_" + i][0] as HTMLFormElement;
      that.formOption = JSON.parse(JSON.stringify(that.currentControl.option));
      clearTimeout(timer);
    }, 500);
  }
  private tileHeight(tile) {
    if (tile.h === 1) {
      return this.columnHeight;
    } else {
      return this.columnHeight * tile.h + tile.h * 5; // pga tile skal strekke seg over margin mellom rows
    }
  }
  private tileWidth(tile) {
    if (tile.w === 1) {
      return this.columnWidth;
    } else {
      return this.columnWidth * tile.w + tile.w * 5; // pga tile skal strekke seg over margin mellom rows
    }
  }

  // private rowHeightEx() {
  //   return (
  //     (this.windowHeight - this.numberOfRows * 10 - 10) / this.numberOfRows
  //   ); // -topbar -margin -lol. topbar er 42
  // }
  // private columnWidthEx() {
  //   return this.windowWidth / 12 - 2 * 12; // minus margin
  // }

  // private numberOfColumns() {
  //   return grid.calculateNumberOfColumns(this.windowWidth);
  // }
  // private numberOfRows() {
  //   return grid.calculateNumberOfRows(this.windowHeight);
  // }

  /**预览 */
  private onPreview() {
    this.$set(this.form, "layoutArray", this.layoutArray);
    this.$emit("onPreview", this.form);
  }
  /**提交数据 */
  private onSubmit(data: any) {
    if (this.draggable) {
      this.$set(this.form, "layoutArray", this.layoutArray);
      this.$emit("onSubmit", this.form);
    }
  }

  /**选中组件 */
  private clickCheck(id: string) {
    if (!this.draggable) {
      return;
    }
    this.currentControl = this.layoutArray.find((item: any) => {
      return item.i == id;
    });
    if (!!this.currentControl) {
      this.formOption = this.currentControl.option;
    }
  }

  /**刷新组件属性 */
  private onSubmitAttr(option: any) {
    let i = (this.currentControl as any).i;
    let custom: any = this.$refs["custom_" + i][0] as HTMLFormElement;
    (this.currentControl as any).option = option;
    this.formOption = option;
    custom.updateControl(option);
    this.layoutArray.map((item: any) => {
      if (item.i == i) {
        item = this.currentControl;
      }
      return item;
    });
  }

  private updateWidth(data: any) {
    //debugger;
  }

  /**上传图片处理 */
  private uploadSuccess(file: any, base64: any, name: string) {
    console.log("file====>", file);
    // this.$set(this.uiModel,"source", base64.split(",")[1]);
    this.$set(this.form, "image", file.link);
  }

  /**
   * 图片删除成功
   */
  private removeFile(name: string) {
    this.$set(this.form, "image", "");
  }
}
</script>

<style scoped>
.vue-grid-layout {
  position: relative;
}
.assistor {
  height: 100%;
}
</style>
<style lang="scss">
.MTGridLayout-template {
  height: 100%;

  .MTGridLayout-wrapper {
    // height:100%;

    .vue-grid-item {
      &:hover {
        .close-icon {
          display: flex;
        }
      }

      .close-icon {
        // display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        position: absolute;
        text-align: right;
        background-color: rgba(#000, 0.3);
        border-radius: 50%;
        right: 5px;
        top: 5px;
        z-index: 200;
        cursor: pointer;
        display: none;

        i {
          color: #fff;
        }
      }
    }

    .vue-grid-item-edit {
      background: #f2f2f2;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    }
    .vue-grid-item-normal {
      background: #f2f2f2;
      padding: 0px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    }
  }

  .MTGridLayout-set {
    width: 320px;
    height: 100%;
    border-left: 1px solid #eee;
    background-color: #fff;
    box-shadow: -2px 0 10px rgba(#000, 0.1);
    padding: 0 10px;
    position: absolute;
    top: 0;
    right: 0;
    transition: all 0.2s;

    &.isHide {
      right: -320px;
      transition: all 0.2s;
    }

    .MTGridLayout-set-wrapper {
      width: 100%;
      height: 100%;
      position: relative;

      .arrow-btn {
        position: absolute;
        top: 50%;
        left: -60px;
      }

      .componentBtn {
        width: 100%;
        margin: 5px 0;
      }

      .MTGridLayout-tab {
        height: 100%;

        .el-tabs__content {
          height: calc(100% - 55px);

          .el-tab-pane {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
