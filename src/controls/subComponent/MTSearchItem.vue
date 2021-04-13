<template>
  <div class="form-item-wrapper">
    <el-form-item
      v-for="(item, index) in controlList"
      :key="index + '-ControlList'"
      class="search-item"
      :label="$t(item.label)"
      :prop="item.prop"
    >
      <template v-if="item.type == 'select'">
        <el-select
          :disabled="item.disabled"
          v-model="uiModel[item.prop]"
          :placeholder="$t(item.placeholder)"
          :filterable="item.filterable"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="(elitem, elindex) in item.dicData"
            :key="item.prop + elindex"
            :label="elitem[item.props.label]"
            :value="elitem[item.props.value]"
          />
        </el-select>
      </template>
      <!-- 下拉和输入框组合 -->
      <template v-else-if="item.type == 'select-input'">
        <el-input
          :placeholder="$t(item.placeholder)"
          v-model="uiModel[item.inputProp]"
          class="input-with-select"
          size="small"
        >
          <el-select
            v-model="uiModel[item.selectProp]"
            slot="prepend"
            :placeholder="$t(item.placeholder)"
          >
            <el-option
              v-for="(elitem, elindex) in item.dicData"
              :key="elitem.id + elindex"
              :label="elitem[item.props.label]"
              :value="elitem[item.props.value]"
            />
          </el-select>
        </el-input>
      </template>
      <!-- 日期范围 -->
      <template v-else-if="item.type == 'daterange'">
        <el-date-picker
          :disabled="item.disabled"
          size="small"
          v-model="uiModel[item.prop]"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd "
          :start-placeholder="$t(item.startPlaceholder)"
          :end-placeholder="$t(item.endPlaceholder)"
          :picker-options="item.pickerOptions"
        ></el-date-picker>
      </template>

      <!-- 日期时间范围 -->
      <template v-else-if="item.type == 'datetimerange'">
        <el-date-picker
          :disabled="item.disabled"
          size="small"
          v-model="uiModel[item.prop]"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd HH:mm:ss "
          :start-placeholder="$t(item.startPlaceholder)"
          :end-placeholder="$t(item.endPlaceholder)"
          :picker-options="item.pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </template>

      <!-- 日期时间范围 -->
      <template v-else-if="item.type == 'datePicker'">
        <el-date-picker
          :disabled="item.disabled"
          size="small"
          v-model="uiModel[item.prop]"
          align="right"
          :format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
          :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'"
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
      </template>
      <template v-else>
        <el-input
          :disabled="item.disabled"
          v-model="uiModel[item.prop]"
          :placeholder="$t(item.placeholder)"
          clearable
          size="small"
          style="width: 200px"
        ></el-input>
      </template>
    </el-form-item>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component
export default class MTSearchField extends Vue {
  private name: string = "MTSearchField";

  @Prop({
    default: [],
  })
  controlList!: any;

  @Prop({
    default: {},
  })
  uiModel!: any;

  /**
   *组件加载完毕
   */
  private mounted() {
    //debugger;
    // this.watchSrc();
  }
}
</script>
<style scoped lang="scss">
.form-item-wrapper {
  //position: fixed;
  //width: 100%;
  //height: 20px;
  //background-color: rgba(255, 0.5);
}
</style>
