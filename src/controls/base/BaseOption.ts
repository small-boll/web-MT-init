/**
 * 列属性
 */
interface BaseColumn {
  /**字段属性名 */
  prop: string;
  /** 属性中文注解 */
  label: string;
  /**默认值 */
  value?: string | Array<any>;
  /** 字段填写提示 */
  placeholder?: string;
  /**展示组件类型 */
  type: string;
  /***是否显示为搜索 */
  search?: boolean;
  /***是否显示为表格列 */
  show?: boolean;
  /***是否禁用表单使用 */
  disabled?: boolean;
  /***是否多选表单使用 */
  multiple?: boolean;
  /***是否可搜索表单使用 */
  filterable?: boolean;
  /***是否异步表单Treeselect使用 */
  async?: boolean;
  /***是否插槽表单使用 */
  formslot?: boolean;
  /***是否插槽表单详情使用 */
  detailSlots?: boolean;
  /***是否插槽表格使用 */
  tableSlot?: boolean | false;
  /***是否新增显示表单使用 */
  addDisplay?: boolean;
  /***是否编辑显示表单使用 */
  editDisplay?: boolean;
  /***是否预览显示表单使用 */
  viewDisplay?: boolean;
  /***校验表单使用 */
  rules?: Array<any>;
  /***字典数据表单使用 */
  dicData?: Array<any>;
  /***方法表单使用 */
  change?: any;
  /***方法表单Treeselect使用 */
  loadOptions?: any;
  /***方法表单autocomplete使用 */
  querySearchAsync?: any;
  /***格式化表单datePicker使用 */
  format?: any;
  /***格式化表单datePicker使用 */
  valueFormat?: any;
  /***类型表单datePicker使用 */
  datePickerType?: any;
  /***属性表单datePicker使用 */
  pickerOptions?: any;
  /***字典属性表单使用 */
  props?: Object;

  /**表格是否启用列拖拽 */
  enableColumnDrop?: boolean;

  /**表格对应列的宽度 */
  width?: string;

  /**列是否固定在左侧或者右侧，true 表示固定在左侧 */
  fixed?: boolean;
  /**对齐方式 */
  align?: string;

  startPlaceholder?: string;

  /**计算组件显示按钮位置 */
  controlsPosition?: String;
  /**最小值 */
  min?: number;
  /**最大值 */
  max?: number;
  // 排序
  sortable?: boolean | false;

  // 嵌套表头
  childNode?: Array<any> | [];

  endPlaceholder?: string;

  /**ascending 表示升,descending 表示降序,null 表示还原为原始顺序 */
  sortOrders?: any[];
  /** 对应列是否可以通过拖动改变宽度,需要在 el-table 上设置 border 属性为真*/

  resizable?: boolean;
  /** 用来格式化内容Function(row, column, cellValue, index)*/
  formatter?: any;
  /** 列样式 */
  className?: string;
}

/**
 * 表格属性
 */
interface BaseTable {
  /**表格左边预留宽度 */
  leftWidth?: string;
  /**查询条件框 */
  inputControlList?: Array<any>;
  /**查询按钮等数组 */
  buttonControlList?: Array<any>;
  /**表格表头 */
  tableHeader?: Array<any>;
  /**表格中详情，修改等按钮 */
  tableButton?: Array<any>;
  /**是否开启分页 */
  pagination?: boolean;

  /**是否开启新增 */
  addBtn?: boolean;
  /**表格主键 */
  rowKey?: string;

  /**表格绑定数据字段属性名 */
  prop?: string;

  /**表格绑定数据字段属性名 */
  propTotal?: string;

  /**表格是否启用行拖拽 */
  enableRowDrop?: boolean;

  /**表格是否启用列拖拽 */
  enableColumnDrop?: boolean;

  // 对齐方式
  align?: string;

  // 显示合计
  showSummary?: boolean | false;

  // 合计公式
  getSummaries?: Function;

  /**
   * 懒加载使用
   */
  treeProps?: any;
  lazy?: boolean;
  loadTree?: any;

  border?: boolean;
}

interface CustomBtn {
  /**自定义按钮点击事件 */
  doSubmit?: any;
  /***自定义按钮标题 */
  title?: string;
}

/**
 * 属性模型
 */
interface BaseOption {

  /** 功能名称 */
  menu?: string,
  /** 操作类型 add/edit */
  type?: string,
  /** 表单数据索引 */
  index?: number,
  /**表单、表格字段属性 */
  column: Array<BaseColumn>,
  /**弹出层宽度*/
  width?: string,
  /**表单标题 */
  title?: string,
  /**表单 labelWidth */
  labelWidth?: string,
  /** 是否显示表格 */
  tableShow?: boolean,
  /** 是否显示表单 */
  formShow?: boolean,
  /** 是否显示详情 */
  detailShow?: boolean,

  customBtn?: CustomBtn,
  /***抽屉使用 */
  size?: string,
  /**打开类型 */
  section?: string,
  table?: BaseTable,

  /**自定义表格是否拖拽 */
  isDraggable?: boolean,
  /**ztree 属性使用 */
  ztree?: any
}

/**
 * 公有方法
 */
interface BaseMethod {
  //setControlDicData?(control: HTMLFormElement, prop: string, dicData: Array<any>);
  setpropDicData?(prop: string, dicData: Array<any>);
}

interface showIconInfo {
  name: string;
  click: any;
  content: string;
  param: any
}

export {
  BaseOption,
  BaseColumn,
  BaseTable,
  BaseMethod,
  showIconInfo
}
