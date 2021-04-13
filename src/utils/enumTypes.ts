/**
 * 运行环境
 */
enum RuntimeEnvMode {
  /**
   * 开发环境
   */
  DEV = 10,

  /**
   * 测试环境
   */
  UAT = 20,

  /**
   * 生产环境
   */
  PROD = 30,

  /**
   * 本地环境
   */
  Local = 40,

  /**
 * MOCK环境
 */
  MOCK = 50,
  /**
 * 固定请求数据
 */
  FIX = 60,
}


/**
 * 数据模式
 * 三种模式下的方法名称/数据源名称必须要保持一致
 * 匹配规则时不同环境自动切换查找数据源方式，默认API数据模式
 */
enum DataEnvMode {
  /**
   * 静态数据模式
   * 数据目录在public/demo/目录下
   * 数据格式为标准json格式数据，文件名.js
   */
  DEMO = 10,

  /**
   * 模拟数据模式
   * 集合Mock.js规则生成规则模拟数据
   * 目录再src/mock/目录下
   */
  MOCK = 20,

  /**
   * API接口数据模式
   * 标准方式
   */
  API = 30
}

export { RuntimeEnvMode, DataEnvMode }