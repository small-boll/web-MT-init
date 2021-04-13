<!----设备列表组件---->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{formOption.title}}</span>
      <el-button style="margin-left: 60px;" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="confirm">查询</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        <eForm
          ref="form"
          :loadState="false"
          :option="formOption"
          @doSubmit="doSubmit"
          @formSlot="formSlot"
        ></eForm>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="24">
        <MTZTree ref="zTree" :option="formOption.ztree" :zNodes="zNodes"></MTZTree>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import {
  BaseOption,
  BaseColumn,
  BaseMethod,
  showIconInfo
} from "@/controls/base/BaseOption";
import { anaylsisStatusFilter } from "../utils/filters";

@Component({
  components: {
    eForm: resolve => require(["@/controls/MTeForm.vue"], resolve),
    MTZTree: resolve => require(["@/controls/MTZTree.vue"], resolve)
  }
})
export default class MTDeviceList extends Vue implements BaseMethod {
  private name: string = "MTDialogForm";

  @Prop({
    default: {}
  })
  option!: any;

  @Prop({
    default: {}
  })
  zNodes!: Array<any>;

  private formOption: BaseOption = {
    menu: this.option.menu || "",
    type: this.option.type || "add",
    index: this.option.index || -1,
    size: this.option.size || "30%",
    tableShow: this.option.tableShow || true,
    formShow: this.option.formShow || true,
    detailShow: this.option.detailShow || true,
    column: this.option.column || new Array<BaseColumn>(),
    width: this.option.width || "1100px",
    title: this.option.title || "设备列表",
    labelWidth: this.option.labelWidth || "150px",
    ztree: this.option.ztree
  };
  private loading: Boolean = false;

  private dialog: Boolean = false;

  private mounted() {
    //   this.detailSlots = this.getSlots("formslot");
    // this.slots = this.getSlots("formslot");
  }

  @Watch("dialog")
  private loadDialog(newVal: boolean, oldVal: boolean) {
    if (!newVal) {
      return;
    }
    this.refreshControl();
  }
  private refreshControl() {
    this.formOption = {
      menu: this.option.menu || "",
      type: this.option.type || "add",
      index: this.option.index || -1,
      tableShow: this.option.tableShow == null ? true : this.option.tableShow,
      formShow: this.option.formShow == null ? true : this.option.formShow,
      detailShow:
        this.option.detailShow == null ? true : this.option.detailShow,
      column: this.option.column || new Array<BaseColumn>(),
      width: this.option.width || "1100px",
      title: this.option.title || (this.option.type == "add" ? "新增" : "修改"),
      labelWidth: this.option.labelWidth || "150px",
      ztree: this.option.ztree
    };
  }

  private destroyed() {}

  public setForm(val: any) {
    let form = this.$refs.form as HTMLFormElement;
    form.setForm(val);
  }

  //private created() {}

  private setFormValue(data: any) {
    let form = this.$refs.form as HTMLFormElement;
    form.setFormValue(data);
  }

  /**
   * 提交数据方法
   */
  private doSubmit(type: string, form: any, index: number, done: any) {
    this.loading = true;
    let that = this;
    this.$emit("doSubmit", this.formOption.type, form, index, function() {
      that.loading = false;
    });
  }

  /**
   * 点击确定按钮执行该方法，
   * 调用子组件dosubmit()
   */
  private confirm() {
    let eform = this.$refs.form as HTMLFormElement;
    eform.doSubmit(true);
    //this.dialog = false;
    //this.formShow = false;
  }

  /**放弃按钮 */
  private cancel(done: any) {
    this.loading = false;
    this.$emit("cancel", done);
  }

  /**获取插槽 */
  private getSlots(slot: string): Array<any> {
    let arr = this.formOption.column.filter((item: any) => {
      return item[slot] == true;
    });
    return arr;
  }

  private formSlot(val: []) {
    //this.formSlots = val;
    //this.$emit("setSlot", val);
  }

  private viewSlot(val: []) {
    //this.detailSlots = val;
    //this.$emit("setSlot", val);
  }

  public setpropDicData(prop: string, dicData: Array<any>) {
    let form = this.$refs.form as HTMLFormElement;
    if (!!form) {
      return form.setpropDicData(prop, dicData);
    }
    return false;
  }

  public setZTree(data: Array<any>) {
    let zTree = this.$refs.zTree as HTMLFormElement;
    if (!!zTree) {
      zTree.zNodes = data;
      zTree.load();
    }
  }

  public addZTreeNode(node: any, showIcon?: showIconInfo[]) {
    let zTree = this.$refs.zTree as HTMLFormElement;
    if (!!zTree) {
      let nodes = zTree.addZTreeNode(node);
      return nodes;
    }
    return null;
  }

  public addZTreeNodeHtml(node: any, showIcon?: showIconInfo[]) {
    let zTree = this.$refs.zTree as HTMLFormElement;
    if (!!zTree) {
      zTree.addZTreeNodeHtml(node, showIcon);
    }
  }
}
</script>

<style scoped></style>