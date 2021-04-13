<template>
  <div>
    <!-- eQuery -->
    <eQuery
      v-if="optionInfo.tableShow"
      ref="eQuery"
      :metaData="metaData"
      :option="optionInfo"
      :loadState="false"
      @clickHandle="clickHandle"
      @init="init"
      @tableSlot="tableSlot"
      @handleTableSelectionChanged="handleTableSelectionChanged"
    >
      <template v-for="(item, index) in tableSlots" :slot="item.prop" slot-scope="scope">
        <span :key="index">
          <slot :name="item.prop" :data="scope">slot的默认内容</slot>
        </span>
      </template>
    </eQuery>
    <!-- eQuery -->
    <!-- 表单 -->
    <dialogForm
      v-if="
        optionInfo.section == 'dialog' &&
          (optionInfo.formShow || optionInfo.detailShow)
      "
      ref="dialogForm"
      :option="optionInfo"
      @doSubmit="doSubmit"
      @cancel="beforeClose"
      @setSlot="setSlot"
    >
      <template v-for="(item, index) in slots" :slot="item.prop" slot-scope="scope">
        <span :key="index">
          <slot :name="item.prop" :data="scope">slot的默认内容</slot>
        </span>
      </template>
    </dialogForm>
    <!-- 表单 -->
    <!-- 表单 -->
    <drawerForm
      v-if="
        optionInfo.section == 'drawer' &&
          (optionInfo.formShow || optionInfo.detailShow)
      "
      ref="drawerForm"
      :option="optionInfo"
      @doSubmit="doSubmit"
      @cancel="beforeClose"
      @setSlot="setSlot"
    >
      <template v-for="(item, index) in slots" :slot="item.prop" slot-scope="scope">
        <span :key="index">
          <slot :name="item.prop" :data="scope">slot的默认内容</slot>
        </span>
      </template>
    </drawerForm>
    <!-- 表单 -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import {
  BaseOption,
  BaseColumn,
  BaseTable,
  BaseMethod,
} from "@/controls/base/BaseOption";
import { EOption, TableOption, EColumn } from "@/controls/base/DefaultOption";
import { getPermissionBtn } from "@/utils/permissionBtn";
Vue.prototype.permissionBtn = getPermissionBtn;

//import component from "@/controls/mixins/component";
//注册组件
@Component({
  components: {
    eQuery: (resolve) => require(["@/controls/MTeQuery.vue"], resolve),
    dialogForm: (resolve) => require(["@/controls/MTDialogForm.vue"], resolve),
    drawerForm: (resolve) => require(["@/controls/MTDrawerForm.vue"], resolve),
  },
})
export default class MTQueryForm extends Vue implements BaseMethod {
  private name: string = "MTQueryForm";
  @Prop({
    default: {},
  })
  option!: BaseOption;
  @Prop({ default: () => {} }) metaData!: any;

  //定义表格选中事件
  //OnTableSelectionChanged(selection) {}

  private optionInfo: BaseOption = new EOption();

  private formInfo: any = {};
  private eFormType: string = "add"; //弹框类型add，edit

  private slots: any = [];
  private detailSlots: any = [];
  private tableSlots: any = [];

  private dialogFormShow: boolean = false;
  private centerDialogVisible: boolean = true;

  private created() {
    this.optionInfo = {
      menu: this.option.menu || "",
      type: "",
      index: this.option.index || -1,
      section: this.option.section || "dialog",
      size: this.option.size || "30%",
      column: this.option.column,
      width: this.option.width || "1100px",
      labelWidth: this.option.labelWidth || "30px",
      tableShow: this.option.tableShow == null ? true : this.option.tableShow,
      formShow: this.option.formShow == null ? true : this.option.formShow,
      detailShow:
        this.option.detailShow == null ? true : this.option.detailShow,
      table: this.option.table,
    };

    this.optionInfo.column = this.setOption(this.option.column);
    this.optionInfo.table = this.setTableOption(this.option.table as any);

    if (this.option && !!(this.option as any).menu) {
      let arry = (this as any).permissionBtn((this.option as any).menu);
      //debugger;
      let arr = (this.optionInfo.table as any).tableButton;
      if (arr && arr.length > 0) {
        for (let tt in arr) {
          for (let rr in arr[tt]) {
            this.$set(arry[1], rr, arr[tt][rr]);
          }
        }
      }
      (this.optionInfo.table as any).tableButton = arry[1];

      let arr0 = (this.optionInfo.table as any).buttonControlList;
      if (arr0 && arr0.length > 0) {
        arry[0].concat(arr0);
      }
      (this.optionInfo.table as any).buttonControlList = arry[0];
    }
  }
  private mounted() {
    //debugger;
    //this.slots = this.getSlots("formslot");
    //this.tableSlots = this.getSlots("tableSlots");
  }

  private destroyed() {
    this.detailSlots = [];
    this.tableSlots = [];
    this.slots = [];
  }

  /**子组件eQuery表格选中事件处理函数
   * @param 选中的数据
   */
  private handleTableSelectionChanged(val: any) {
    //将事件向上抛
    //this.OnTableSelectionChanged(val);
    this.$emit("tableSelectionChanged", val);
  }

  private clickHandle(val: string, data: any, index: number) {
    this.optionInfo.type = val;
    switch (val) {
      case "add":
        this.beforeOpen(val, null, -1);
        this.optionInfo.title = this.getI18nValue("addTitle");
        break;
      case "edit":
        this.beforeOpen(val, data, index);
        this.optionInfo.title = this.getI18nValue("updateTitle");
        break;
      case "view":
        this.beforeOpen(val, data, index);
        this.optionInfo.title = this.getI18nValue("viewTitle");
        break;
      case "recard":
        this.recard(val, data, index);
        this.optionInfo.title = this.getI18nValue("recardTitle");
        break;
      case "handle":
        this.handle(val, data, index);
        this.optionInfo.title = this.getI18nValue("handleTitle");
        break;
      case "delete":
        this.rowDel(val, data, index);
        this.optionInfo.title = this.getI18nValue("deleteTitle");
        break;
      default:
        break;
    }
  }

  private doSubmit(type: string, form: any, index: number, done: any) {
    console.log("form=========>", form);
    form.loadingTarget = "body";
    if (type.includes("add")) {
      this.$emit("rowSave", type, form, done);
    }
    if (type.includes("edit")) {
      this.$emit("rowUpdate", type, form, index, done);
    }
  }

  public init(params: any, type: string) {
    //debugger;
    this.$set(params, "type", type);
    this.$emit("init", params);
  }

  /**编辑保存 */
  //private rowUpdate() {}
  /***删除操作 */
  private rowDel(type: string, form: any, index: number) {
    this.$emit("rowDel", type, form, index);
  }

  /**
   * 该方法记录
   * @param type 操作类型
   * @param form 数据
   * @param index 索引
   */
  private recard(type: string, form: any, index: number) {
    this.$emit("recard", type, form, index);
  }
  /**
   * 该方法处理方法
   * @param type 操作类型
   * @param form 数据
   * @param index 索引
   */
  private handle(type: string, form: any, index: number) {
    this.$emit("handle", type, form, index);
  }

  /***新增 */
  //private rowSave() {}
  /***查询改变 */
  //private searchChange() {}
  /***查询重置 */
  //private searchReset() {}
  /***打开之前 */
  public beforeOpen(type: string, data: any, index: number) {
    //this.slots = [];
    // this.detailSlots = [];
    this.eFormType = type;

    // if (["add", "edit"].includes(type)) {
    //   this.slots = this.getSlots("formslot");
    // }

    // if (["view"].includes(type)) {
    //   this.detailSlots = this.getSlots("formslot");
    // }

    this.$emit("beforeOpen", type, data, index, function () {});
    this.viewForm(type, data, index);
  }

  private getForm() {
    let form = this.$refs.dialogForm as HTMLFormElement;
    if (form == null) {
      form = this.$refs.drawerForm as HTMLFormElement;
    }
    return form;
  }

  private viewForm(type: string, data: any, index: number) {
    if (this.optionInfo.formShow || this.optionInfo.detailShow) {
      let form = this.getForm();
      form.dialog = true;
      //form.refreshControl();
      let timer = setTimeout(() => {
        if (["edit", "view"].includes(type)) {
          form.setFormValue(this.formInfo);
        } else {
          form.setForm(this.formInfo); // Object.assign({}, this.form);
        }
        clearTimeout(timer);
      }, 200);
    }
  }

  /***关闭之前 */
  private beforeClose(done: any) {
    // let that = this;
    // //that.form=Object.assign({}, params);
    // for (let item in that.formInfo) {
    //   let it = that.formDatas.find((p: any) => {
    //     return p.prop == item;
    //   });
    //   if (it) {
    //     that.$set(that.formInfo, item, it.value);
    //   } else {
    //     that.$set(that.formInfo, item, "");
    //   }
    // }
    this.$emit("beforeClose", done);
    // this.slots = [];
    // this.detailSlots = [];

    this.dialogFormShow = false;
  }

  public setFormValue(form: any) {
    this.formInfo = form;
  }

  /***关闭后 */
  private afterClose() {}
  /***翻页使用 */
  //private currentChange() {}
  /***改变size */
  //private sizeChange() {}

  //private refreshChange() {}

  // private  refresh(){

  // }

  /**设置表属性 */
  private setOption(Columns: Array<BaseColumn>): Array<BaseColumn> {
    let arr = new Array<EColumn>();
    let cl: any = new EColumn();
    let that = this;
    Columns.forEach((item: any) => {
      for (let it in cl) {
        if (item[it] == null) {
          item[it] = cl[it];
        }
        if (it == "rules") {
          item[it].map((rule) => {
            rule["message"] = that.$t(rule.message);
          });
        }
      }
    });
    return Columns;
  }
  /**设置表属性 */
  private setTableOption(options: BaseTable): BaseTable {
    if (options == null) {
      return new TableOption();
    }

    let cl: any = new TableOption();
    let that = this;
    let os = options as any;
    for (let it in cl) {
      if ((os[it] as any) == null) {
        os[it] = cl[it];
      }
    }
    return os;
  }

  /**获取插槽 */
  private getSlots(slot: string): Array<any> {
    let arr = this.optionInfo.column.filter((item: any) => {
      return item[slot] == true;
    });
    return arr;
  }

  private tableSlot(val: []) {
    this.tableSlots = val;
  }

  private setSlot(val: []) {
    this.slots = val;
  }

  public setpropDicData(prop: string, dicData: Array<any>) {
    let form = this.getForm();
    if (!!form) {
      return form.setpropDicData(prop, dicData);
    }
    return false;
  }

  private getI18nValue(key: string): string {
    return this.$t(key).toString();
  }
}
</script>

<style scoped></style>
