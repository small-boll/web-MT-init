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
          <el-col :span="12" :key="eindex" v-if="chexckState(item)">
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              :rules="item.rules"
            >
              <UploadPhoto
                v-if="item.type == 'image'"
                :imgUrl="form[item.prop]"
                :ref="item.prop + 'uploadPhoto'"
                :name="item.prop"
                @uploadSuccess="uploadSuccess"
                @removeFile="removeFile"
                innerText
                :disabled="item.disabled"
              ></UploadPhoto>

              <el-select
                v-else-if="item.type == 'select'"
                v-model="form[item.prop]"
                :multiple="item.multiple"
                :placeholder="$t(item.placeholder)"
                clearable
                :class="{ 'common-multiple-select': item.multiple }"
                :disabled="item.disabled"
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
                :disabled="item.disabled"
              >
                <el-radio
                  :label="it[item.props.value]"
                  v-for="(it, idex) in item.dicData"
                  :key="item.prop + idex"
                >
                  {{ it[item.props.label] }}
                </el-radio>
              </el-radio-group>

              <el-input-number
                v-else-if="item.type == 'inputNumber'"
                v-model="form[item.prop]"
                :controls-position="item.controlsPosition"
                @change="
                  (val) => {
                    if (item.change) {
                      item.change(val);
                    }
                  }
                "
                :min="item.min ? 1 : min"
                :max="item.max ? 100 : max"
              ></el-input-number>

              <el-checkbox-group
                v-else-if="item.type == 'checkboxGroup'"
                v-model="form[item.prop]"
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
              <slot v-else-if="item.formslot" :name="item.prop" :data="form"
                >slot的默认内容</slot
              >

              <el-autocomplete
                v-else-if="item.type == 'autocomplete'"
                v-model="form[item.prop]"
                :fetch-suggestions="
                  (queryString, cb) => {
                    if (item.querySearchAsync) {
                      item.querySearchAsync(queryString, cb);
                    }
                  }
                "
                :placeholder="$t(item.placeholder)"
                @select="
                  (data) => {
                    if (item.change) {
                      item.change(data);
                    }
                  }
                "
              ></el-autocomplete>
              <el-date-picker
                v-else-if="item.type == 'datePicker'"
                v-model="form[item.prop]"
                align="right"
                :format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
                :type="item.datePickerType ? item.datePickerType : 'date'"
                :placeholder="$t(item.placeholder)"
                :picker-options="item.pickerOptions ? item.pickerOptions : {}"
                @change="
                  (val) => {
                    if (item.change) {
                      item.change(val);
                    }
                  }
                "
              ></el-date-picker>
              <el-input
                v-else-if="item.type == 'textarea'"
                type="textarea"
                :rows="item.row || 3"
                resize="none"
                v-model="form[item.prop]"
                :placeholder="$t(item.placeholder)"
                :disabled="item.disabled"
              />
              <el-input
                v-else
                v-model="form[item.prop]"
                :placeholder="$t(item.placeholder)"
                :disabled="item.disabled"
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
import UploadPhoto from "@/controls/MTUploadPhoto.vue"; //图片上传

// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { BaseOption, BaseColumn, BaseMethod } from "@/controls/base/BaseOption";
import { EColumn } from "@/controls/base/DefaultOption";

@Component({
  components: { UploadPhoto, Treeselect },
})
export default class MTeForm extends Vue implements BaseMethod {
  private name: string = "MTeForm";

  @Prop({
    default: {},
  })
  option!: any;

  @Prop({ default: true }) loadState!: boolean;

  private formOption: BaseOption = {
    menu: this.option.menu || "",
    type: this.option.type || "add",
    index: this.option.index || -1,
    column: this.option.column || new Array<BaseColumn>(),
    width: this.option.width || "1100px",
    title: this.option.title || (this.option.type == "add" ? "新增" : "修改"),
    labelWidth: this.option.labelWidth || "150px",
  };
  private loading: Boolean = false;
  public form: any = {};

  created() {
    if (this.loadState) {
      this.formOption.column = this.setOption(this.option.column);
    }
  }

  mounted() {
    this.getSlots("formslot");
  }

  public setForm(val: any) {
    let that = this;
    that.form = val;
  }

  private setFormValue(data: any) {
    //debugger;
    let that = this;
    that.form = data;
  }

  @Emit("update:dialogVis")
  visChange(vis: boolean) {
    console.log(vis);
  }

  /**
   * 提交数据方法
   */
  private doSubmit(bl: boolean = true) {
    let that = this;
    that.loading = true;
    //debugger;
    (that.$refs.form as any).validate((valid: any) => {
      if (valid) {
        that.$emit(
          "doSubmit",
          that.formOption.type,
          that.form,
          that.formOption.index,
          function() {
            that.resetForm(bl);
            that.loading = false;
            that.visChange(false);
          }
        );
      } else {
        that.loading = false;
        console.log("error submit!!");
        return false;
      }
    });
  }

  /**放弃按钮 */
  private cancel() {
    //this.$emit("cancel", function() {});
    this.resetForm();
    //清除图片
    this.clearImg();
  }

  /**重置数据 */
  private resetForm(bl: boolean = true) {
    (this.$refs.form as HTMLFormElement).resetFields();
    if (bl) {
      //this.dialog = false;
      let that = this;
    }
  }

  /**
   * 清除form图片
   */
  private clearImg() {
    //debugger;
    let imgItemArr = this.formOption.column.filter((p: any) => {
      return p.addDisplay && p.type == "image";
    });
    let that: any = this;
    //debugger;
    //debugger;
    console.log("imgItemArr*******=======>", imgItemArr);
    imgItemArr.map((item: any) => {
      that.$refs[item.prop + "uploadPhoto"][0].clearImg();
    });
  }

  /**上传图片处理 */
  private uploadSuccess(file: any, base64: any, name: string) {
    console.log("file====>", file);
    // this.$set(this.uiModel,"source", base64.split(",")[1]);

    this.$set(this.form, name, file.path);
  }
  /**
   * 图片删除成功
   */
  private removeFile(name: string) {
    this.$set(this.form, name, "");
  }

  /*检查是否显示 */
  private chexckState(item: any): boolean {
    let bl = false;
    if (this.formOption.type == "add") {
      bl = item.addDisplay;
    }

    if (this.formOption.type == "edit") {
      bl = item.editDisplay;
    }
    return bl;
  }

  /**获取插槽 */
  private getSlots(slot: string) {
    let arr = this.formOption.column.filter((item: any) => {
      return item[slot] == true;
    });

    this.$emit("formSlot", arr);
  }

  /***清除校验 */
  public clearValidate(arry: any) {
    //debugger;
    if (!!arry && arry.length > 0) {
      for (let i = 0; i < arry.length; i++) {
        let item: any = this.$refs.form;
        if (item) {
          item.clearValidate(arry[i]);
        }
      }
    }
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

<style lang="scss">
.el-select {
  width: 100%;
}
.el-row {
  .el-form-item {
    .vue-treeselect {
      line-height: 30px;
      .vue-treeselect__control {
        height: 100%;
        line-height: 30px;
        .vue-treeselect__single-value {
          line-height: 30px;
        }
        .vue-treeselect__placeholder {
          line-height: 30px;
        }
      }
    }
  }
}</style
>>
