<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-cascader
          ref="cascader"
          v-model="addr"
          :options="optionInfo.data"
          :props="optionProps"
          clearable
          @active-item-change="handleItemChange"
          @change="handleChange"
        ></el-cascader>
      </el-col>
      <el-col :span="12" v-if="optionInfo.isDetail">
        <!-- <input @input="input" :value="detail" placeholder="请输入详细地址" /> -->
        <el-input v-model="detail" placeholder="请输入详细地址"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {Area}  from "@/controls/base/Area";

@Component
export default class MTAddress extends Vue {
  private name: string = "MTAddress";

  /**
   * prop参数
   */
  @Prop({ default: {} }) option!: any; // 图片地址

  private optionProps: any = {
    checkStrictly: true,
    value: this.option.value || "value",
    label: this.option.label || "label",
    children: this.option.children || "children"
  };

  private optionInfo: any = {
    data: this.option.data,
    isDetail: this.option.isDetail || true
  };

  //private

  //递归判断列表，把最后的children设为undefined
  private getTreeData(data: any) {
    // debugger;
    let name = this.optionProps.children;
    //debugger;
    for (var i = 0; i < data.length; i++) {
      if (data[i][name].length < 1) {
        // children若为空数组，则将children设为undefined
        data[i][name] = undefined;
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i][name]);
      }
    }
    return data;
  }

  private addr: any = [];
  private detail: string = "";
  public refresh(data: any) {
    if (!!data && !!data.addr) {
      this.addr = data.addr;
    }

    if (!!data && !!data.detail) {
      this.detail = data.detail;
    }
  }

  private handleItemChange(val: any) {
    // let children = (this.$refs.cascader as any).getCheckedNodes();
    // if (children[0].children.length < 1) {
    //   children[0].children = undefined;
    // }
  }

  /**获取地址信息 */
  public getAddress() {
    return {
      addr: this.addr,
      detail: this.detail
    };
  }

  private handleChange(val: any) {}

  private created() {
    if (this.optionInfo.data == null || this.optionInfo.data.length < 1) {
      this.optionInfo.data = this.getTreeData(new Area().area);
    }
  }

  /**
   *组件加载完毕
   */
  private mounted() {}
}
</script>
<style scoped lang="scss">
</style>
