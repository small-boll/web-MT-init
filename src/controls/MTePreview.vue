<template>
  <section class="table-page-section">
    <div class="table-page-wrapper">
      <!-- 查询板块 -->
      <div class="search-block" v-if="table.inputControlList.length > 0 || table.addBtn">
        <el-form
          v-if="table.inputControlList.length > 0"
          label-width="120px"
          class="search-form"
          :model="uiModel"
          ref="searchForm"
          @submit.native.prevent
        >
          <MTSearchItem :controlList="table.inputControlList" :uiModel="uiModel"></MTSearchItem>
          <el-form-item class="search-item btns">
            <div class="search-btns" v-if="table.inputControlList.length > 0">
              <el-button
                size="small"
                type="primary"
                class="search-btn"
                icon="el-icon-search"
                @click="clickHandle('search')"
                circle
              ></el-button>
              <el-button
                size="small"
                type="default"
                class="search-btn"
                icon="el-icon-refresh"
                @click="clickHandle('clear')"
                circle
              ></el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表板块 -->
      <div class="content-block">
        <slot name="left-content"></slot>
        <div class="right-content" :style="{ width: `calc(100% - ${table.leftWidth})` }">
          <!--表格渲染-->
          <div class="table-block">
            <el-table
              ref="multipleTable"
              :data="metaData"
              tooltip-effect="dark"
              style="width: 100%"
              stripe
              :lazy="table.lazy"
              :tree-props="table.treeProps"
              :load="loadTree"
              :row-key="table.rowKey"
              :show-summary="table.showSummary"
              :summary-method="table.getSummaries"
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <!-- <el-table-column type="index" class-name="cannotDrag" label="编号" width="55"></el-table-column> -->
              <el-table-column
                v-for="(item, index) in table.tableHeader.filter((aa) => {
                  return aa.show == true;
                })"
                :key="`col_${index}`"
                :prop="dropCol[index].prop"
                :label="item.label"
                :align="table.align"
                :show-overflow-tooltip="
                  dropCol[index].type == 'photo' ? false : true
                "
                :sortable='dropCol[index].sortable'
              >
                <el-table-column label="配送信息" :align="table.align" 
                  v-if="item.childNode && item.childNode.length>0"
                  v-for="(cItem, cIndex) in item.childNode.filter((aa) => {
                    return aa.show == true;
                  })"
                  :label="cItem.label"
                  :key="cItem.label"
                  :prop="cItem.prop"
                  :show-overflow-tooltip="
                    cItem.type == 'photo' ? false : true
                  "
                  :sortable='cItem.sortable'
                >
                  <template slot-scope="scope">
                    <template v-if="cItem.type == 'index'">{{ scope.$index + 1 }}</template>
                    <template v-else-if="cItem.type == 'dayNum'">
                      <span v-if="scope.row[cItem.prop]>0" style="fontWeight:bold;">{{scope.row[cItem.prop]}}</span>
                      <span v-else>{{scope.row[cItem.prop]||0}}</span>
                    </template>
                    <template v-else-if="cItem.type == 'dayIcon'">
                      <i v-if="scope.row[cItem.prop]>0" class="el-icon-check"></i>
                    </template>
                    <template v-else-if="cItem.type == 'hasLog'">
                      <i v-if="scope.row[cItem.prop]" class="el-icon-check font-success _fontBold"></i>
                      <i v-else class="el-icon-close font-danger _fontBold"></i>
                      <!-- <span :class="[scope.row[cItem.prop]?'':'font-danger']">{{scope.row[cItem.prop]?'是':'否'}}</span> -->
                    </template>
                    <template v-else>
                      {{
                      scope.row[cItem.prop]
                      }}
                    </template>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <!--分页组件-->
          <el-pagination
            v-if="table.pagination"
            :total="metaData[table.propTotal]"
            :current-page="uiModel.current"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </div>
      </div>
    </div>
  </section>
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
    ImgView: resolve => require(["@/controls/MTImgView.vue"], resolve),
    MTSearchItem: resolve => require(["@/controls/subComponent/MTSearchItem.vue"], resolve),
    Sortable
  }
})
export default class MTeQuery extends Vue {
  private name: string = "MTeQuery";

  @Prop({
    default: {}
  })
  option!: BaseOption;

  @Prop({ default: (): any => {} }) metaData!: any;
  @Prop({ default: true }) loadState!: boolean;

  // 定义表格选中事件
  @Emit('tableSelectionChanged') onSelectionChanged(selection: any){

  }

  private tableOption: BaseOption = {
    menu: this.option.menu || "",
    index: this.option.index || -1,
    column: this.option.column,
    table: this.option.table
  };

  private table!: BaseTable;
  public delLoading: boolean = false;
  private params: any = new Object();
  private userInfo: any = new Object();
  private uiModel: any = new Object();
  private dropCol: any = [];

  @Watch("tableOption.column",{deep:true})
  private watchBaseOptionColumn(newVal: any, oldVal: any) {
    this.table.inputControlList = this.getSearchWhere();
  }

  created() {
    if (this.loadState) {
      this.tableOption.column = this.setOption(this.option.column);
      this.tableOption.table = this.setTableOption(this.option.table as any);
    }

    this.getUserInfo();
    this.table = this.tableOption.table as BaseTable;
    this.table.inputControlList = this.getSearchWhere(); //查询条件框
    this.table.tableHeader = this.getTableHeader();

    this.loadData();
  }

  mounted() {
    // 阻止默认行为
    if (this.table.enableRowDrop || this.table.enableRowDrop) {
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };
    }
    // if (this.table.enableRowDrop) {
    //   this.rowDrop();
    // }

    // if (this.table.enableRowDrop) {
    //   this.columnDrop();
    // }

    this.setTableSlots();
  }

  //el-table选中事件处理函数
  private handleCurrentChange(val){
    //将事件抛给父组件
    this.onSelectionChanged(val);
  }

  private setTableSlots() {
    let arry = this.tableOption.column.filter((item: any) => {
      return item.tableSlot == true;
    });
    this.$emit("tableSlot", arry);
  }

  private loadData() {
    //debugger;

    this.columnFilter();

    console.log("tableHeader====================>", this.table.tableHeader);
    this.$nextTick(() => {
      // 默认当天日期
      let searchTime = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
      for(let i = 0;i< this.table.inputControlList!.length;i++){
        if(this.table.inputControlList![i].prop === 'searchTime' 
         &&
        this.table.inputControlList![i].valueFormat === 'yyyy-MM'){
          let monthStart = new Date(new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-01 00:00:00`).getTime()-0);
          searchTime = `${monthStart.getFullYear()}-${monthStart.getMonth()+1}`;
        }
      }
      this.$set(this.uiModel, "page", 1);
      this.$set(this.uiModel, "pageSize", 10);
      this.$set(this.uiModel, "searchTime", searchTime);
      this.$set(this.uiModel, "deptId", this.userInfo.deptId);
      this.init("search");
    });
    console.log("this.inputControlList++++++++", this.table.inputControlList);

    this.setDefaultInput();
  }

  // 查询用户信息
  private getUserInfo() {
    this.userInfo = JSON.parse((sessionStorage as any).getItem("userinfo"));
    console.log("this.userInfo----->", this.userInfo);
  }

  /**
   * 设置搜索框默认值
   */
  private setDefaultInput() {
    //循环搜索框的选项,给form默认值
    (this.table as any).inputControlList.map((item: any) => {
      console.log("item++++++++", item);
      if (!!item.value) {
        this.$set(this.uiModel, item.prop, item.value);
      }
    });
  }

  /**
   * 重置按钮
   */
  private clear() {
    //保存当前分页
    let currentPage = this.uiModel.current;
    let currentSize = this.uiModel.size;
    let searchTime = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    for(let i = 0;i< this.table.inputControlList!.length;i++){
      if(this.table.inputControlList![i].prop === 'searchTime' 
        &&
      this.table.inputControlList![i].valueFormat === 'yyyy-MM'){
        let monthStart = new Date(new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-01 00:00:00`).getTime()-0);
        searchTime = `${monthStart.getFullYear()}-${monthStart.getMonth()+1}`;
      }
    }
    this.uiModel = new Object();
    this.$set(this.uiModel, "current", currentPage);
    this.$set(this.uiModel, "size", currentSize);
    this.$set(this.uiModel, "searchTime", searchTime);
    this.$set(this.uiModel, "deptId", this.userInfo.deptId);
    //设置初始默认值
    this.setDefaultInput();
    //清空
    (this.$refs.searchForm as HTMLFormElement).resetFields();
  }

  //点击按钮
  private clickHandle(val: any, data: any, index: number) {
    switch (val) {
      case "search": {
        //搜索
        this.init("search");
        break;
      }
      case "clear": {
        this.clear();
        break;
      }
      case "add":
        this.$emit("clickHandle", val, data, index);
        break;
      case "view":
      case "edit":
      case "recard":
      case "handle": {
        //详情，编辑
        this.$emit("clickHandle", val, data, index);
        break;
      }
      case "export": {
        //导出
        this.$emit("clickHandle", val, this.params);
        break;
      }
      default:
        this.$emit("clickHandle", val, this.params);
        break;
    }
  }

  private loadTree(tree, treeNode, resolve) {
    //debugger;
    if (this.table.lazy && this.table.loadTree) {
      this.table.loadTree(tree, treeNode, resolve);
    }
  }

  /**
   * 初始化表格
   */
  private init(clickType: string = "search") {
    //(this.$parent.$parent as any).init(this.uiModel);
    //debugger;
    this.$emit("init", this.uiModel, clickType);
  }

  // private refresh() {
  //   this.$emit("refresh", this.uiModel);
  // }

  /**
   * 改变页容量
   */
  private sizeChange(val: any) {
    this.uiModel.current = 1;
    this.uiModel.size = val;
    this.init("changePageSize");
  }

  /**
   * 改变页码
   */
  private pageChange(val: any) {
    this.uiModel.current = val;
    this.init("changePage");
  }

  /**
   * 删除
   */
  private subDelete(id: any, index: number) {
    this.$emit("clickHandle", "delete", id, index);
  }

  /**
   * 删除 页码特殊处理
   */
  private dleChangePage() {
    if (this.metaData.records.length == 1 && this.uiModel.current > 1) {
      this.uiModel.current--;
    } else {
      this.uiModel.current = 1;
    }
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

  /***自定义列点击事件 */
  private handleCommand(command: any) {
    if (command == null) {
      return;
    }
    command.show = !command.show;
    this.$nextTick(() => {
      this.columnFilter();
    });
  }

  //行拖拽
  private rowDrop() {
    const tbody = document.querySelector(".el-table__body-wrapper tbody");
    const _this = this;
    Sortable.create(tbody, {
      onEnd({ newIndex, oldIndex }: any) {
        const currRow = _this.metaData.records.splice(oldIndex, 1)[0];
        _this.metaData.records.splice(newIndex, 0, currRow);
      }
    });
  }

  //列拖拽
  private columnDrop() {
    const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
    Sortable.create(wrapperTr, {
      animation: 180,
      delay: 0,
      filter: ".cannotDrag",
      onEnd: (evt: any) => {
        let arry = this.dropCol.filter((item: any) => {
          return item.show == true;
        });

        const oldItem = arry[evt.oldIndex];
        this.dropCol.splice(evt.oldIndex, 1);
        this.dropCol.splice(evt.newIndex, 0, oldItem);
      }
    });
  }

  /***过滤有效列 */
  private columnFilter() {
    let arry = (this.table.tableHeader as any).filter((item: any) => {
      return item.show == true;
    });
    this.dropCol = JSON.parse(JSON.stringify(arry));
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

  /**获取查询条件 */
  private getSearchWhere(): Array<any> {
    console.log('getSearchWhere',this.tableOption.column);
    let arr:any[] = [];
    this.tableOption.column.map(item => {
      if(item && item.childNode){
        arr = arr.concat(item.childNode.filter(i => {
          return i.search == true;
        }))
      }
    })
    console.log('arr',arr);
    
    return arr;
  }
  /**获取表头 */
  private getTableHeader(): Array<any> {
    return (
      this.table.tableHeader ||
      this.tableOption.column.filter((item: any) => {
        return item.show == true;
      })
    );
  }
}
</script>

<style scoped>
.table-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-icon-check{
  font-size: 20px;
}
._fontBold{
  font-weight: bold;
}
</style>
