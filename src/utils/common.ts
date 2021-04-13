/**
 * 导入ts-md5加密
 */
import { Md5 } from "ts-md5/dist/md5";
import { versionLog, versionLogModel } from "@/versionPublish/versionLog";
import moment from "moment";
import store from "@/store/store";
import { MTConfig } from "@/config/MTConfig";
import { mtConsole } from "./mtConsole";

// // 使用 require 方法加载 fs 核心模块
// const fs = require('fs');

/**""
 * 公共方法类
 */
export class common {
  /**
   * 默认构造函数
   */
  public constructor() { }

  /** 获取localStorage*/
  public static getStore(name: string) {
    return localStorage.getItem(name);
  }

  /** 获取localStorage*/
  public static setStore(name: string, val: any) {
    localStorage.setItem(name, val);
  }

  /**
   * md5加密
   * @param value 要加密的字符串
   * @returns 返回加密后的字符串
   */
  public static md5Encrypt(content: string): string {
    let encryptPwd = Md5.hashAsciiStr(content);
    return encryptPwd.toString();
  }

  /**
   * 将源对象副本进行直接转换成目标对象类型并赋值
   * (仅相似结构间的处理)
   * @param data 源数据
   * @returns 转换后的目标对象数据
   */
  public static TConvertObj<TSource, TResult>(data: TSource): TResult {
    let result = JSON.parse(JSON.stringify(data));
    return <TResult>result;
  }

  /**
   * 从当前数据对象上克隆一份数据
   * (深拷贝)
   * @param data 源数据
   * @returns 源数据副本
   */
  public static CloneObj<TSource>(data: TSource): TSource {
    let result = JSON.parse(JSON.stringify(data));
    return <TSource>result;
  }

  /**
   * 获取当前版本的更新日志内容
   * @returns 返回当前版本的日志记录内容
   */
  public static getCurrentVersionLog(): string {
    return common.getVersionLogContent(MTConfig.Instance().Version);
  }

  /**
   * 获取当前版本的更新日志数据（含发布日期、发布时间等）
   * @returns 返回当前版本对应的发布信息
   */
  public static getCurrentVersion(): versionLogModel {
    return common.getVersionData(MTConfig.Instance().Version);
  }

  /**
   * 获取指定版本号的日志记录内容
   * @param version 指定的版本号日志
   * @returns 返回指定版本的日志内容
   */
  public static getVersionLogContent(version: string): string {
    let versionlog = new versionLog();
    let list = versionlog.getVersionList();
    let data = list.find((a) => a.version == version);
    if (data == undefined) {
      return "";
    }
    return data.updateContentList.join("\r\n");
  }

  /**
   * 获取指定版本号的日志记录对象（含发布日期、发布时间等）
   * @param version 指定的版本号日志
   * @returns 返回版本发布记录
   */
  public static getVersionData(version: string): versionLogModel {
    let versionlog = new versionLog();
    let list = versionlog.getVersionList();
    let data = list.find((a) => a.version == version);
    if (data == undefined) {
      return new versionLogModel();
    }
    return data;
  }

  /***
   * 将树形数据转成数组
   * @param tree 指定的树形数据
   * @param children 指定的树形name
   * @returns 返回转换的数组
   */
  public static getChildren(tree: any, children: string): [] {
    var arry: any = [];
    if (tree == null || tree.length < 1) {
      return arry;
    }

    for (var i = 0; i < tree.length; i++) {
      common.getChild(arry, tree[i][children], children);
      arry.push(tree[i]);
    }
    return arry;
  }

  /**
   * 线性化数据树形话
   * @param source
   * @param id
   * @param parentId
   * @param children
   */
  public static listToTree(
    source: any,
    id?: any,
    parentId?: any,
    children?: any
  ) {
    const sortArr: any = source.sort((a: any, b: any) => {
      return a[parentId] - b[parentId];
    });
    let minParentId =
      Array.isArray(sortArr) && sortArr.length > 0 ? sortArr[0][parentId] : -1;
    const cloneData = JSON.parse(JSON.stringify(source));
    return cloneData.filter((father: any) => {
      const branchArr = cloneData.filter(
        (child: any) => father[id] === child[parentId]
      );
      branchArr.length > 0 ? (father[children] = branchArr) : "";
      return father[parentId] === minParentId;
    });
  }

  /**
   * 获取child
   * @param arry
   * @param item
   * @param children
   */
  private static getChild(arry: any, item: any, children: string) {
    if (item == null || item.length < 1) {
      return false;
    }
    var itm = null;
    for (var i = 0; i < item.length; i++) {
      itm = item[i][children];
      if (itm != null) {
        common.getChild(arry, itm, children);
      }
      arry.push(item[i]);
    }
  }

  /**
   * 获取前一年日期
   * @returns 返回前1年的日期
   */
  public static getLastYearDate(): string {
    let date = moment(new Date())
      .subtract(1, "years")
      .format("YYYY-MM-DD HH:mm:ss");
    return date;
  }

  /**
   * 获取前一个月日期
   * @returns 返回前1月的日期
   */
  public static getLastMonthDate(): string {
    let date = moment(new Date())
      .subtract(1, "months")
      .format("YYYY-MM-DD HH:mm:ss");
    return date;
  }

  /**
   * 获取前一周日期
   * @returns 返回前1周的日期
   */
  public static getLastWeekDate(): string {
    let date = moment(new Date())
      .subtract(7, "days")
      .format("YYYY-MM-DD HH:mm:ss");
    return date;
  }

  /**
   * 获取当天00:00:00开始日期时间
   * @returns 返回当天00:00:00日期
   */
  public static getTodayStartDateTime(): string {
    let date = new Date(new Date().setHours(0, 0, 0, 0));
    let rtnStr = moment(date).format("YYYY-MM-DD HH:mm:ss");
    return rtnStr;
  }

  /**
   * 获取当天23:59:59结束日期时间
   * @returns 返回当天23:59:59日期
   */
  public static getTodayEndDateTime(): string {
    let date = new Date(new Date().setHours(23, 59, 59, 59));
    let rtnStr = moment(date).format("YYYY-MM-DD HH:mm:ss");
    return rtnStr;
  }

  /**
   * 获取当月工时(2020,06)
   * 2020年6月份，星期1-5的天数（默认计算周一到周五）
   */
  public static getMonthDate(year: any, month: any): number {
    let num = 0,
      allNum: any = this.getCountDays(`${year}-${month}`);
    while (allNum > 0) {
      let weekCode = new Date(`${year}-${month}-${allNum}`).getDay();
      if (weekCode >= 1 && weekCode <= 5) num++;
      allNum--;
    }
    return num;
  }

  /**
   * 获取一个月的天数
   * 如（2020-06-02）
   */
  public static getCountDays(dateStr: string): string {
    /* */
    var curDate: any = new Date(dateStr);
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth + 1);
    /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
  }

  /**
   * 获取当前实时日期时间（yyyy-MM-dd HH:mm:ss）
   * @returns 返回当前实时数据
   */
  public static getNowDateTimeFormat(): string {
    let rtnStr = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    return rtnStr;
  }

  /**
   * 获取当前实时日期时间（YYYYMMDDHHmmss）
   * @returns 返回当前实时格式化数据
   */
  public static getNowDateTimeFormatNoSpace(): string {
    let rtnStr = moment(Date.now()).format("YYYYMMDDHHmmss");
    return rtnStr;
  }

  /**
   * 【BLL层公共方法】bll层接口返回数据公共方法处理
   */
  public static async convertToResult<TParam, TResult>(
    params: TParam,
    callBack: Function
  ) {
    var startDateTime = new Date().getTime();
    const resultData = await callBack(params);
    var endDateTime = new Date().getTime();

    var data: any = <TResult>resultData.result.result;
    data.code = resultData.code;
    data.metadata = resultData;
    data.msg = resultData.msg;
    data.success = resultData.success;
    data.expendTime = endDateTime - startDateTime;

    return data;
  }

  /**
   * 返回车牌号最左侧的前缀省
   */
  public static getCarPrefix = () => {
    let result = new Array<any>();
    let strCode =
      "京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼";
    for (let i = 0; i < strCode.length; i++) {
      result.push({ label: strCode[i] });
    }
    return result;
  };

  /**
   * 返回车牌号区域编码
   */
  public static getCarCode = () => {
    let result = new Array<any>();

    let strCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < strCode.length; i++) {
      result.push({ label: strCode[i] });
    }
    return result;
  };

  /**
   *把数组转化为树
   */

  public static toTree = (data: any) => {
    let result: Array<any> = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach((item) => {
      delete item.childList;
    });
    let map: any = {};
    data.forEach((item) => {
      map[item.id] = item;
    });
    data.forEach((item) => {
      let parent = map[item.pid];
      if (parent) {
        (parent.childList || (parent.childList = [])).push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  };

  /**
   * 生成一个新的唯一的Guid
   * @returns 新的Guid
   */
  public static getNewGuid(): string {
    return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
      .replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .toUpperCase();
  }

  /**
   * 将时间戳转换格式化日期
   * YYYY-MM-DD HH:mm:ss
   * @param time 时间戳值
   */
  public static timestampConvertToDate(time: string | number): string {
    if (!time) return "";
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
  }

  /**
   * 获取字典数据
   * @param name 名称
   */
  public static getDictList(name: string) {
    let arry =
      store.state.dict ||
      JSON.parse(sessionStorage.getItem("dictList") || "[]");
    if (arry == null) {
      return [];
    }
    let item: any = arry.find((p: any) => {
      return p.name == name;
    });
    if (item) {
      return item.children;
    }
    return [];
  }

  /***格式化时间 */
  public static formatDateTime() {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let mm = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    let dd = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return y.toString() + mm + dd + h + minute + second;
  }


}
