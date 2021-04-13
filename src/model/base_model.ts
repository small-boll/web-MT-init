/**
 * base model定义，用于所有数据查询接口返回的基类
 */
export class base_model {
  /**
    * 默认构造函数
    */
  public constructor() { }

  /** 
   * 状态码，0表示成功，非0表示各种不同的错误
   */
  public code!: number | string;

  /**
   * 返回数据（json格式）成功时返回的数据，类型为对象或数组
   * 转换时可直接转换成重写后的对象或者数组
   */
  public data?: any;

  /**
   * 返回的描述信息，成功时为"success"，错误时则是错误信息
   */
  public message!: string;

  /**
   * 是否成功
   */
  public success!: boolean;

  /**
   * 源数据，需要记录源数据时，
   * 请将后台返回的json直接赋值给该字段
   */
  public metadata?: any;

  /** 
   * api请求查询性能的损耗，消耗的时间单位（毫秒）
   */
  public expendTime!: number;
}
