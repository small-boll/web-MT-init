<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    :label-width="formOption.labelWidth"
    class="bulidng-form"
  >
    <template>
      <el-row :gutter="40">
        <template v-for="(item, eindex) in formOption.column">
          <el-col :span="12" :key="eindex" v-if="item.viewDisplay">
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              :rules="item.rules"
            >
              <ImgView
                v-if="item.type == 'image'"
                style="width: 160px;height: 120px;border-radius: 8px;"
                class="table-img"
                :imgSrc="form[item.prop]"
              ></ImgView>

              <el-select
                v-else-if="item.type == 'select'"
                v-model="form[item.prop]"
                :placeholder="$t(item.placeholder)"
                clearable
                :disabled="true"
                @change="
                  (val) => {
                    if (item.change) {
                      item.change(val);
                    }
                  }
                "
              >
                <el-option
                  v-for="(it, idex) in item.dicData"
                  :key="item.prop + idex"
                  :label="it[item.props.label]"
                  :value="it[item.props.value]"
                />
              </el-select>

              <el-radio-group
                v-else-if="item.type == 'radio'"
                v-model="form[item.prop]"
                :disabled="true"
              >
                <el-radio
                  :label="it[item.props.value]"
                  v-for="(it, idex) in item.dicData"
                  :key="item.prop + idex"
                >
                  {{ it[item.props.label] }}
                </el-radio>
              </el-radio-group>

              <el-checkbox-group
                v-else-if="item.type == 'checkboxGroup'"
                v-model="form[item.prop]"
                :disabled="item.disabled"
              >
                <el-checkbox
                  :label="it[item.props.value]"
                  v-for="(it, idex) in item.dicData"
                  :key="item.prop + idex"
                >
                  {{ it[item.props.label] }}
                </el-checkbox>
              </el-checkbox-group>
              <Treeselect
                :disabled="true"
                v-else-if="item.type == 'treeselect'"
                v-model="form[item.prop]"
                :multiple="item.multiple"
                :async="item.async"
                :options="item.dicData"
                :placeholder="$t(item.placeholder)"
                :load-options="
                  ({ action, searchQuery, callback }) => {
                    if (item.loadOptions) {
                      item.loadOptions(action, searchQuery, callback);
                    }
                  }
                "
                :normalizer="
                  (node) => {
                    if (item.loadOptions) {
                      return node;
                    }
                    return {
                      id: node[item.props.value],
                      label: node[item.props.label],
                      children: node.children,
                    };
                  }
                "
                @select="
                  (node, instanceId) => {
                    if (item.change) {
                      item.change(node, instanceId);
                    }
                  }
                "
              />
              <slot v-else-if="item.formslot" :name="item.prop"
                >slot的默认内容</slot
              >
              <el-input
                v-else
                :disabled="true"
                v-model="form[item.prop]"
                :placeholder="$t(item.placeholder)"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </template>
  </el-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { BaseOption, BaseColumn, BaseMethod } from "@/controls/base/BaseOption";
import { EColumn } from "@/controls/base/DefaultOption";

//注册组件
@Component({
  components: {
    Treeselect,
    ImgView: (resolve) => require(["@/controls/MTImgView.vue"], resolve),
  },
})
export default class MTeDetail extends Vue implements BaseMethod {
  private name: string = "MTeDetail";
  @Prop({
    default: {},
  })
  option!: any;

  @Prop({ default: true }) loadState!: boolean;

  private formOption: BaseOption = {
    menu: this.option.menu || "",
    type: this.option.type || "add",
    index: this.option.index || -1,
    column: this.option.column,
    width: this.option.width || "1100px",
    title: this.option.title || "详情",
    labelWidth: this.option.labelWidth || "150px",
  };

  //private dialog = false;
  //private isOpen: boolean = false;
  public form: any = {};

  created() {
    if (this.loadState) {
      this.formOption.column = this.setOption(this.option.column);
    }
  }

  mounted() {
    this.getSlots("formslot");
  }

  private setFormValue(data: any) {
    this.form = data;
  }

  private cancel() {
    this.$emit("cancel", function() {});
    //this.dialog = false;
    //this.isOpen = false;
  }

  private resetForm() {
    //this.dialog = false;
    // this.form = new building_ui_model();
  }

  /**设置默认值 */
  private setOption(Columns: Array<BaseColumn>): Array<BaseColumn> {
    let arr = new Array<EColumn>();
    let cl: any = new EColumn();
    let that = this;
    Columns.forEach((item: any) => {
      for (let it in cl) {
        if (item[it] == null) {
          item[it] = cl[it];
        }
      }
    });
    return Columns;
  }

  /**获取插槽 */
  private getSlots(slot: string) {
    let arr = this.formOption.column.filter((item: any) => {
      return item[slot] == true;
    });

    this.$emit("formSlot", arr);
  }

  public setpropDicData(prop: string, dicData: Array<any>) {
    let index = this.formOption.column.findIndex((item: any) => {
      return item.prop == prop;
    });
    if (index < 0) {
      return false;
    }
    this.formOption.column[index].dicData = dicData;
  }
}
</script>

<style scoped></style>
