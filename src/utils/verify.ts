/**
 * 数据校验辅助类
 * by zhouyh 2019.7.19
 */
export class verify {
  /**
   * @param val 传入的值
   * @param reg 验证规则
   */
  public static commonVerify(val: any, reg: any) {
    return val && val.length > 0 && reg.test(val) ? true : false;
  }

  /**
   * 验证手机号码
   * @param tel 手机号码
   * @returns 验证成功返回true，否则返回flase
   */
  public static iphone(tel: string): boolean {
    let iphoneReg = /^1(3|4|5|6|7|8)\d{9}$/;
    return this.commonVerify(tel, iphoneReg);
  }

  /**
   *密码校验适用于itsm
   * @param val 传入密码
   * @returns 验证成功返回true，否则返回flase
   */
  public static password(val: string): boolean {
    let password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    return this.commonVerify(val, password);
  }

  /**
   * 验证手机或座机 验证11位
   * @param tel 座机号码
   * @returns 验证成功返回true，否则返回flase
   */
  public static isIphoneOrTell(tel: string): boolean {
    let tellReg = /^((0\d{2,3}[-]?\d{7,8})|(1[358467]\d{9}))$/;
    return this.commonVerify(tel, tellReg);
  }

  /**
   * 验证座机 验证8或者11位
   * @param tel 座机号码
   * @returns 验证成功返回true，否则返回flase
   */
  public static isTell(tel: string): boolean {
    let tellReg = /^0\d{2,3}[-]?\d{7,8}$/;
    return this.commonVerify(tel, tellReg);
  }

  /**
   * @param val 是否字符和数字段排序
   * @returns 验证成功返回true，否则返回flase
   */
  public static letterAndNumber(val: string): boolean {
    let reg = /^[0-9a-zA-Z]*$/g;
    return this.commonVerify(val, reg);
  }

  /**
   * @param val 姓名
   * @returns 验证成功返回true，否则返回flase
   */
  public static isName(val: string): boolean {
    let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    val = val.replace(/\s/g, "");
    return this.commonVerify(val, reg);
  }

  /**
   * @param val 登录名  登录名由6-10位之间的字母、下划线、@或数字组成
   * @returns 验证成功返回true，否则返回flase
   */
  public static isLoginName(val: string): boolean {
    let reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{6,10}$/;
    return this.commonVerify(val, reg);
  }
  /**
   * @param val 传入值 有问题
   */
  public static isNumber(val: any): boolean {
    let reg = /^[0-9]*$/;
    return this.commonVerify(String(val), reg);
  }

  //大于0的整数或小数  有问题
  public static isNumberOrDecimals(val: any): boolean {
    let reg = /^[0-9][0-9]*([.][0-9]+)?$/;
    return this.commonVerify(String(val), reg);
  }

  //大于0的整数
  public static isPositiveNumber(val: any): boolean {
    let reg = /^[1-9]\d*$/;
    return this.commonVerify(String(val), reg);
  }

  /**
   * @param 车排号验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isCarCode(val: string): boolean {
    let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    return this.commonVerify(val, reg);
  }

  // 正则验证车牌,验证通过返回true,不通过返回false
  //包括新能源车牌号
  public static isLicensePlate(str: string) {
    return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
      str
    );
  }

  /**
   * @param 身份证
   * @returns 验证成功返回true，否则返回flase
   */
  public static idCode(val: string): boolean {
    let idCodeReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
    return this.commonVerify(val, idCodeReg);
  }

  /**
   * @param 是否为空判断
   * @returns 验证成功返回true，否则返回flase
   */
  public static isNull(val: string): boolean {
    if (
      val === "" ||
      val === "-1" ||
      val === null ||
      val === "null" ||
      val === undefined
    ) {
      return true;
    }
    return false;
  }

  /**
   * @param 网址
   * @returns 验证成功返回true，否则返回flase
   */
  public static isUrl(val: string): boolean {
    let strRegex = "^((https|http|ftp|rtsp|mms)://)";
    return this.commonVerify(val, strRegex);
  }

  /**
   * @param 经度
   * @returns 验证成功返回true，否则返回flase
   */
  public static ifLongitude(val: any): boolean {
    let longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,8})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,8}|180)$/;
    return this.commonVerify(String(val), longrg);
  }

  /**
   * @param 纬度
   * @returns 验证成功返回true，否则返回flase
   */
  public static ifLatitude(val: any): boolean {
    let longrg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,8}|90\.0{0,8}|[0-8]?\d{1}|90)$/;
    return this.commonVerify(String(val), longrg);
  }

  /**
   * @param MAC地址
   * @returns 验证成功返回true，否则返回flase
   */
  public static isMac(val: string): boolean {
    let reg = /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$/;
    return this.commonVerify(val, reg);
  }

  /**
   * @param 验证大小
   * @returns 验证成功返回true，否则返回flase
   */
  public static fileSize(val: number): boolean {
    let value: any = (val / 1024 / 1024).toFixed(2);
    return value > 50 ? true : false;
  }

  /**
   * @param IP验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isIP(val: string): boolean {
    let ipgReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return this.commonVerify(val, ipgReg);
  }

  /**
   * @param 音频验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isAudio(type: string): boolean {
    if (
      type === "mp3" ||
      type === "mp4" ||
      type === "wma" ||
      type === "ape" ||
      type === "mpc" ||
      type === "gss" ||
      type === "wave" ||
      type === "cd" ||
      type === "flac" ||
      type === "tta" ||
      type === "aiff" ||
      type === "au"
    ) {
      return true;
    }
    return false;
  }

  /**
   * @param 视频验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isVideo(type: string): boolean {
    if (
      type === "avi" ||
      type === "wmv" ||
      type === "rmvb" ||
      type === "mpeg1" ||
      type === "mpeg2" ||
      type === "mpeg4" ||
      type === "map4" ||
      type === "3gp" ||
      type === "asf" ||
      type === "swf" ||
      type === "vob" ||
      type === "dat" ||
      type === "mov" ||
      type === "m4v" ||
      type === "flv" ||
      type === "f4v" ||
      type === "mkv" ||
      type === "mts" ||
      type === "ts" ||
      type === "ogg"
    ) {
      return true;
    }
    return false;
  }

  /**
   * @param 文件验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isDomFile(type: string): boolean {
    if (
      type === "doc" ||
      type === "docx" ||
      type === "txt" ||
      type === "xlsx" ||
      type === "xls" ||
      type === "pdf"
    ) {
      return true;
    }
    return false;
  }

  /**
   * @param Excel格式验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isXls(type: string): boolean {
    if (type === "xlsx" || type === "xls") {
      return true;
    }
    return false;
  }

  /**
   * @param 图片验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isImg(type: string): boolean {
    if (type === "jpg" || type === "png" || type === "jpeg" || type === "gif") {
      return true;
    }
    return false;
  }

  /**
   * @param 邮箱验证
   * @returns 验证成功返回true，否则返回flase
   */
  public static isEmail(val: string): boolean {
    let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    return this.commonVerify(val, emailReg);
  }

  /**
   * @param val 去除空格
   * @returns 值
   */
  public static subBlank(val: any) {
    val = val.toString();
    let newVal = val.replace(/^\s+|\s+$/g, "");
    return newVal;
  }

  /**
   * @param val js正则验证特殊字符
   * @returns 值
   */
  public static checkVal(val: any) {
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(val) || regCn.test(val)) {
      return false;
    }
    return true;
  }

  /**
   * 从字符串中提取汉字
   * @param strValue 待处理的输入字符串
   */
  public static GetChinese(strValue: any) {
    if (strValue != null && strValue != "") {
      var reg = /[\u4e00-\u9fa5]/g;
      return strValue.match(reg).join("");
    } else return "";
  }
}
