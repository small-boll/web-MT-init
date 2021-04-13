<!----抽屉式组件--封装表单---->
<template>
  <el-drawer
    custom-class="common-drawer"
    :visible.sync="dialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :title="formOption.title"
    append-to-body
    center
    :size="formOption.size"
  >
    <eForm
      v-if="formShow"
      ref="form"
      :loadState="false"
      :option="formOption"
      @doSubmit="doSubmit"
      @formSlot="formSlot"
    >
      <template v-for="(item, index) in formSlots" :slot="item.prop" slot-scope="scope">
        <span :key="index">
          <slot :name="item.prop" :data="scope">slot的默认内容</slot>
        </span>
      </template>
    </eForm>

    <eDetail
      v-if="viewShow"
      ref="form"
      :option="formOption"
      :loadState="false"
      @doSubmit="doSubmit"
      @viewSlot="viewSlot"
    >
      <template v-for="(item, index) in detailSlots" :slot="item.prop" slot-scope="scope">
        <span :key="index">
          <slot :name="item.prop" :data="scope">slot的默认内容</slot>
        </span>
      </template>
    </eDetail>

    <div class="drawer-footer">
      <el-button :loading="loading" @click="cancel">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        v-if="formOption.customBtn"
        @click="()=>{
            if(formOption.customBtn.doSubmit){formOption.customBtn.doSubmit();}else confirm(false);
          }"
      >{{formOption.customBtn.title}}</el-button>
      <el-button :loading="loading" type="primary" @click="confirm">确认</el-button>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { BaseOption, BaseColumn,BaseMethod } from "@/controls/base/BaseOption";

@Component({
  components: {
    eForm: resolve => require(["@/controls/MTeForm.vue"], resolve),
    eDetail: resolve => require(["@/controls/MTeDetail.vue"], resolve)
  }
})
export default class MTDrawerForm extends Vue implements BaseMethod{
  private name: string = "MTDrawerForm";

  @Prop({
    default: {}
  })
  option!: any;

  private formOption: BaseOption = {
    menu: this.option.menu || "",
    type: this.option.type || "add",
    index: this.option.index || -1,
    size: this.option.size || "30%",
    tableShow: this.option.tableShow == null ? true : this.option.tableShow,
    formShow: this.option.formShow == null ? true : this.option.formShow,
    detailShow: this.option.detailShow == null ? true : this.option.detailShow,
    column: this.option.column || new Array<BaseColumn>(),
    width: this.option.width || "1100px",
    title: this.option.title || (this.option.type == "add" ? "新增" : "修改"),
    labelWidth: this.option.labelWidth || "150px",
    customBtn: this.option.customBtn
  };
  private loading: Boolean = false;

  private dialog: Boolean = false;

  private formSlots: any = [];
  private detailSlots: any = [];
  private formShow: boolean = false;
  private viewShow: boolean = false;

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
    this.formShow = Boolean(
      this.formOption.detailShow && this.chexckState1("eDetail")
    );
    this.viewShow = Boolean(
      this.formOption.detailShow && this.chexckState1("eDetail")
    );
  }

  private refreshControl() {
    this.formOption = {
      menu: this.option.menu || "",
      type: this.option.type || "add",
      index: this.option.index || -1,
      tableShow: this.option.tableShow || true,
      formShow: this.option.formShow || true,
      detailShow: this.option.detailShow || true,
      column: this.option.column || new Array<BaseColumn>(),
      width: this.option.width || "1100px",
      title: this.option.title || (this.option.type == "add" ? "新增" : "修改"),
      labelWidth: this.option.labelWidth || "150px"
    };

    //this.detailSlots = this.getSlots("formslot");
    //this.formSlots = this.getSlots("formslot");
  }

  private destroyed() {
    this.detailSlots = [];
    this.formSlots = [];
  }

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
   * 点击确定按钮执行该方法，
   * 调用子组件dosubmit()
   */
  private confirm(bl: boolean = true) {
    let eform = this.$refs.form as HTMLFormElement;
    eform.doSubmit(bl);
    //this.dialog = false;
    //this.formShow = false;
  }

  /**
   * 提交数据方法
   */
  private doSubmit(type: string, form: any, index: number, done: any) {
    this.$emit("doSubmit", type, form, index, done);
  }

  /**放弃按钮 */
  private cancel(done: any) {
    this.$emit("cancel", done);
    if (this.formShow || this.viewShow) {
      let form = this.$refs.form as HTMLFormElement;
      form.cancel();
    }
    this.dialog = false;
  }

  /**获取插槽 */
  private getSlots(slot: string): Array<any> {
    let arr = this.formOption.column.filter((item: any) => {
      return item[slot] == true;
    });
    return arr;
  }

  private chexckState1(type: string) {
    // debugger;
    if (type == "eForm") {
      if (["add", "edit"].includes(this.formOption.type as string)) {
        return true;
      }
      return false;
    }

    if (type == "eDetail") {
      if (["view"].includes(this.formOption.type as string)) {
        return true;
      }
      return false;
    }
  }

  private formSlot(val: []) {
    this.formSlots = val;
  }

  private viewSlot(val: []) {
    this.detailSlots = val;
  }

  public setpropDicData(prop: string, dicData: Array<any>) {
    let form = this.$refs.form as HTMLFormElement;
    if (!!form) {
      return form.setpropDicData(prop, dicData);
    }
    return false;
  }

}
</script>

<style scoped></style>