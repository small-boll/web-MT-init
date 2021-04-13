import {
  BaseOption,
  BaseColumn,
  BaseTable,
  BaseMethod,
} from "@/controls/base/BaseOption";

class TableOption implements BaseTable {
  /**表格左边预留宽度 */
  public leftWidth: string = "0px";
  /**查询条件框 */
  public inputControlList?: Array<any>;
  /**查询按钮等数组 */
  public buttonControlList?: Array<any>;
  /**表格表头 */
  public tableHeader?: Array<any>;
  /**表格中详情，修改等按钮 */
  public tableButton?: Array<any>;
  /**是否开启分页 */
  public pagination: boolean = true;

  /**是否开启新增 */
  public addBtn: boolean = true;
  /**表格主键 */
  public rowKey: string = "id";

  /**表格绑定数据字段属性名 */
  public prop: string = "records";

  /**表格绑定数据字段属性名 */
  public propTotal: string = "total";

  /**表格是否启用行拖拽 */
  public enableRowDrop: boolean = true;

  /**表格是否启用列拖拽 */
  public enableColumnDrop: boolean = true;
  /**开启下级 */
  public treeProps: any = { children: "children", hasChildren: "hasChildren" };
  /**表格懒加载 */
  public lazy: boolean = false;
  public loadTree: any = null;

  public border?: boolean = false;
}

class EColumn implements BaseColumn {
  /**字段属性名 */
  public prop!: string;
  /** 属性中文注解 */
  public label!: string;
  /**默认值 */
  public value: string = "";
  /** 字段填写提示 */
  public placeholder: string = "commonPlaceholder";
  /**展示组件类型 */
  public type: string = "input";
  /***是否显示为搜索 */
  public search: boolean = false;
  /***是否显示为表格列 */
  public show: boolean = false;
  /***是否禁用表单使用 */
  public disabled: boolean = false;
  /***是否多选表单使用 */
  public multiple: boolean = false;
  /***是否可搜索表单使用 */
  public filterable: boolean = false;
  /***是否异步表单Treeselect使用 */
  public async: boolean = false;
  /***是否插槽表单使用 */
  public formslot: boolean = false;
  /***是否插槽表单详情使用 */
  public detailSlots: boolean = false;
  /***是否插槽表格使用 */
  public tableSlot: boolean = false;
  /***是否新增显示表单使用 */
  public addDisplay: boolean = false;
  /***是否编辑显示表单使用 */
  public editDisplay: boolean = false;
  /***是否预览显示表单使用 */
  public viewDisplay: boolean = false;
  /***校验表单使用 */
  public rules?: Array<any> = [];
  /***字典数据表单使用 */
  public dicData?: Array<any> = [];
  /***方法表单使用 */
  public change?: any = null;
  /***方法表单Treeselect使用 */
  public loadOptions?: any = null;
  /***方法表单autocomplete使用 */
  public querySearchAsync?: any = null;
  /***格式化表单datePicker使用 */
  public format?: any = null;
  /***类型表单datePicker使用 */
  public datePickerType?: any = null;
  /***属性表单datePicker使用 */
  public pickerOptions?: any = null;
  /***字典属性表单使用 */
  public props?: any = {
    label: "dictValue",
    value: "dictKey",
  };

  /**表格是否启用列拖拽 */
  public enableColumnDrop?: boolean = false;

  /**表格对应列的宽度 */
  public width?: string = "0px";

  /**列是否固定在左侧或者右侧，true 表示固定在左侧 */
  public fixed?: boolean = false;
  /**对齐方式 */
  public align?: string = "left";
  /**计算组件显示按钮位置 */
  public controlsPosition?: String = "";
  /**最小值 */
  public min?: number = 1;
  /**最大值 */
  public max?: number = 100;

  /**
   * 是否开启列排序
   */
  public sortable?: boolean = true;
  /**ascending 表示升,descending 表示降序,null 表示还原为原始顺序 */
  public sortOrders?: any[] = ["ascending", "descending", null];

  /** 对应列是否可以通过拖动改变宽度,需要在 el-table 上设置 border 属性为真*/
  public resizable?: boolean = false;
  /** 用来格式化内容Function(row, column, cellValue, index)*/
  public formatter?: any = null;

  /** 列样式 */
  public className?: string;
}

class EOption implements BaseOption {
  /** 功能名称 */
  public menu: string = "";
  /** 操作类型 add/edit */
  public type?: string = "add";
  /** 表单数据索引 */
  public index?: number = -1;
  /**表单、表格字段属性 */
  public column: Array<BaseColumn> = new Array<BaseColumn>();
  /**弹出层宽度*/
  public width?: string = "";
  /**表单标题 */
  public title?: string = "";
  /**表单 labelWidth */
  public labelWidth?: string = "";
  /** 是否显示表格 */
  public tableShow?: boolean = true;
  /** 是否显示表单 */
  public formShow?: boolean = true;
  /** 是否显示详情 */
  public detailShow?: boolean = true;

  /***抽屉使用 */
  public size?: string = "30%";

  /***抽屉使用 */
  public section?: string = "dialog";

  /**自定义按钮 */
  public customBtn?: any = {
    title: "自定义",
    customBtn: false,
    doSubmit: null,
  };

  public table?: BaseTable = new TableOption();

  /**ztree 属性使用 */
  ztree?: {
    isReadOnly: false;
    beforeExpand: null;
    onAsyncSuccess: null;
    childrenName: "children";
    name: "name";
    idKey: "id";
    pIdKey: "pId";
    rootPId: 0;
    zTreeOnCheck: null;
    zTreeOnClick: null;
  };
}

// abstract class BaseMethodProperty implements BaseMethod {
//     public abstract setControlDicData(control: HTMLFormElement, prop: string, dicData: Array<any>);
//     public abstract setpropDicData(prop: string, dicData: Array<any>);
// }

export {
  TableOption,
  EOption,
  EColumn,
  //BaseMethodProperty
};
