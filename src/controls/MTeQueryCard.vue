<!--列表用卡片展示-->
<template>
  <div class="MTeQueryCard-template">
    <ul class="list-cards">
      <li
        class="list-card-item"
        :class="{ 'is-selected': currentCard == cardIndex }"
        v-for="(cardItem, cardIndex) in metaData.data"
        :key="cardIndex"
        @click="handleCurrentChange(cardItem, cardIndex)"
      >
        <i>{{ cardIndex + 1 }}</i>
        <div class="card-body">
          <el-scrollbar class="common-scroll-y">
            <div
              v-for="(item, index) in table.tableHeader.filter((aa) => {
                return aa.show == true;
              })"
              :key="`card_${index}`"
            >
              <!-- 照片 -->
              <template v-if="dropCol[index].type == 'image'">
                <div class="card-info-item other">
                  <label>{{ $t(item.label) }}:</label>
                  <div class="card-info-content">
                    <ImgView
                      class="table-img"
                      :imgSrc="cardItem[dropCol[index].prop]"
                    ></ImgView>
                  </div>
                </div>
              </template>
              <!-- 是否转换 -->
              <template
                v-else-if="
                  dropCol[index].type == 'select' &&
                    dropCol[index].prop == 'enabled'
                "
              >
                <div class="card-info-item other">
                  <label>{{ $t(item.label) }}:</label>
                  <div class="card-info-content">
                    <span
                      style="fontWeight:bold;color:#67C23A;"
                      v-if="cardItem[dropCol[index].prop] == 1"
                      >{{ filterName(dropCol[index], cardItem) }}</span
                    >
                    <span style="fontWeight:bold;color:#F56C6C;" v-else>{{
                      filterName(dropCol[index], cardItem)
                    }}</span>
                  </div>
                </div>
              </template>
              <!-- 一般转换，value转name -->
              <template
                v-else-if="
                  dropCol[index].type == 'select' ||
                    dropCol[index].type == 'radio'
                "
              >
                <div class="card-info-item other">
                  <label>{{ $t(item.label) }}:</label>
                  <div class="card-info-content">
                    {{ filterName(dropCol[index], cardItem) }}
                  </div>
                </div>
              </template>
              <!-- 插槽 -->
              <template v-else-if="dropCol[index].tableSlot">
                <div class="card-info-item other">
                  <label>{{ $t(item.label) }}:</label>
                  <div class="card-info-content">
                    <slot :name="dropCol[index].prop" :data="scope"
                      >slot的默认内容</slot
                    >
                  </div>
                </div>
              </template>
              <!-- 索引 -->

              <!-- 一般数据 -->
              <template v-else>
                <MTP
                  class="card-info-item"
                  :text="cardItem[dropCol[index].prop]"
                  ><label>{{ $t(item.label) }}:</label></MTP
                >
              </template>
            </div>
          </el-scrollbar>
        </div>
        <div class="card-bottom">
          <el-button
            v-if="table.tableButton.recardShow"
            size="mini"
            type="primary"
            icon="el-icon-notebook-2"
            circle
            @click="clickHandle('recard', cardItem, cardIndex)"
          />
          <el-button
            v-if="table.tableButton.viewShow"
            size="mini"
            type="primary"
            icon="el-icon-document"
            circle
            @click="clickHandle('view', cardItem, cardIndex)"
          />
          <el-button
            v-if="table.tableButton.handleShow"
            size="mini"
            type="primary"
            icon="el-icon-connection"
            circle
            @click="clickHandle('handle', cardItem, cardIndex)"
          />
          <el-button
            v-if="table.tableButton.editShow"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="clickHandle('edit', cardItem, cardIndex)"
          />
          <el-popover
            v-if="table.tableButton.deleteShow"
            :ref="cardItem.id"
            placement="top"
            width="180"
          >
            <p>{{ $t("msg_sure_delete") }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[cardItem.id][0].doClose()"
                >{{ $t("btn_cancel") }}</el-button
              >
              <el-button
                :loading="false"
                type="primary"
                size="mini"
                @click="subDelete(cardItem, cardIndex)"
                >{{ $t("btn_confirm") }}</el-button
              >
            </div>
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              style="margin-left:10px"
            />
          </el-popover>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mtConsole } from "@/utils/mtConsole";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
//import { Getter, Action } from "vuex-class";
import Sortable from "sortablejs";

import { BaseOption, BaseColumn, BaseTable } from "@/controls/base/BaseOption";
import { TableOption, EColumn } from "@/controls/base/DefaultOption";

//注册组件
@Component({
  components: {
    ImgView: (resolve) => require(["@/controls/MTImgView.vue"], resolve),
    MTP: (resolve) => require(["@/controls/MTP.vue"], resolve),
    Sortable,
  },
})
export default class MTeQueryCard extends Vue {
  @Prop({ default: (): any => {} }) metaData!: any;
  @Prop({ default: (): any => {} }) table!: any;

  private currentCard: number = -1; //当前选中的卡片
  private dropCol: any = []; //卡片显示的字段

  created() {
    this.columnFilter();
  }

  mounted() {
    console.log("metaData---->", this.metaData);
    console.log("table---->", this.table);
  }

  //el-table选中事件处理函数
  private handleCurrentChange(val: any, index: number) {
    this.currentCard = index;
    //将事件抛给父组件
    this.$emit("handleCurrentChange", val);
  }

  private loadTree(tree, treeNode, resolve) {
    //debugger;
    if (this.table.lazy && this.table.loadTree) {
      this.table.loadTree(tree, treeNode, resolve);
    }
  }

  /***过滤有效列 */
  private columnFilter() {
    let arry = (this.table.tableHeader as any).filter((item: any) => {
      return item.show == true;
    });
    this.dropCol = JSON.parse(JSON.stringify(arry));
  }

  /**
   * 点击按钮
   */
  private clickHandle(val: any, data: any, index: number) {
    this.$emit("clickHandle", val, data, index);
  }

  /**
   * 删除
   */
  private subDelete(id: any, index: number) {
    this.$emit("subDelete", id, index);
  }

  /***字典取值显示 */
  private filterName(column: any, row: any) {
    if (column.dicData) {
      let item = column.dicData.find((p: any) => {
        return p[column.props.value] == row[column.prop];
      });
      //debugger;
      return item ? item[column.props.label] : "未知";
    }
    return row[column.prop];
  }
}
</script>

<style scoped lang="scss">
.MTeQueryCard-template {
  .list-cards {
    display: flex;
    flex-wrap: wrap;

    .list-card-item {
      width: 23%;
      height: 165px;
      border: 1px solid #eee;
      background-color: #fff;
      border-radius: 4px;
      margin: 15px 1%;
      padding: 0 10px;
      position: relative;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      cursor: pointer;

      &.is-selected {
        background-color: rgba(#409eff, 0.1);
        border: 1px solid rgba(#409eff, 0.3);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      }

      &:not(.is-selected):hover {
        border: 1px solid rgba(#409eff, 0.4);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      }

      & > i {
        position: absolute;
        left: 0px;
        display: block;
        overflow: hidden;
        line-height: 40px;
        width: auto;
        text-indent: -2px;
        // border-left: 4px solid #409EFF;
        color: #409eff;
        padding-left: 0;
        font-size: 40px;
        font-weight: bold;
        opacity: 0.4;
      }

      .card-body {
        padding-top: 30px;
        padding-left: 20px;
        height: calc(100% - 44px);

        .card-info-item {
          font-size: 14px;
          line-height: 22px;
          color: #444;

          label {
            font-size: 14px;
            margin-right: 10px;
            color: #444;
          }

          &.other {
            display: flex;
            
          }
        }
      }

      .card-bottom {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
.table-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
