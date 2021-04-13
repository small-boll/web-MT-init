/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 11:03:13
 * @LastEditTime: 2020-07-29 15:48:45
 * @LastEditors: Please set LastEditors
 */
import { RuntimeEnvMode } from "@/utils/enumTypes";

/**
 * 初始化入口参数
 * 包括当前运行的环境、是否调试、版本号等
 */
const mainProgramParams = {
  /**
   * 当前版本运行模式
   * DEV:开发环境
   * UAT：测试环境
   * PROD：生产环境
   */
  currentRuntimeMode: parseInt(
    process.env.NODE_ENV as string
  ) as RuntimeEnvMode,

  /**
   * 当前是否为调试模式，用于调试时默认设置值，发布时该值更新为false
   */
  isDebugMode: false,

  /**
   * 应用程序版本号
   */
  Version: "V3.0.1",
};

/**
 * 初始化配置
 */
export class MTConfig {
  /**
   * 当前运行环境
   * DEV:开发环境
   * UAT:测试环境
   * PROD:生产环境
   */
  public readonly CurrentRuntimeMode!: RuntimeEnvMode;

  /***本地管理员授权 */
  public readonly authorization: string = "admin";

  /**
   * 当前是否为调试模式，用于调试时默认设置值，发布时该值更新为false
   */
  public readonly IsDebugMode!: boolean;

  /**
   * 应用版本编号
   */
  public readonly Version!: string;

  /**
   * 金鹏服务-后台请求地址
   */
  public readonly mtHttpUrl!: string;

  /**
   * socketio消息中间件url地址
   */
  public readonly mtSocketioURL!: string;

  /**
   * actionview地址
   */
  public readonly actionViewURL!: string;

  /**
   * 私有对象
   */
  private static instance: MTConfig;

  /**
   * 全局单实例对象
   */
  public static Instance(): MTConfig {
    if (!MTConfig.instance) {
      MTConfig.instance = new MTConfig(
        mainProgramParams.currentRuntimeMode,
        mainProgramParams.isDebugMode,
        mainProgramParams.Version
      );
    }
    return MTConfig.instance;
  }

  /**
   * 默认构造函数
   * @param runtimeMode 当前运行环境
   * @param boolean 当前是否为调试模式
   * @param version 版本号
   */
  private constructor(
    runtimeMode: RuntimeEnvMode,
    isDebugMode: boolean,
    version: string
  ) {
    this.CurrentRuntimeMode = runtimeMode;
    this.IsDebugMode = isDebugMode;
    this.Version = version;

    switch (runtimeMode) {
      case RuntimeEnvMode.DEV: {
        //开发环境
        // this.mtHttpUrl = "http://172.16.7.141";
        this.mtHttpUrl = "/api";
        this.mtSocketioURL = "http://100.67.29.68:9092";
        this.actionViewURL = 'http://218.104.108.251:8088';
        break;
      }
      case RuntimeEnvMode.UAT: {
        //测试环境
        this.mtHttpUrl = "http://api.community.com:10000";
        this.mtSocketioURL = "http://100.67.29.68:9092";
        this.actionViewURL = 'http://218.104.108.251:8088';
        break;
      }
      case RuntimeEnvMode.PROD: {
        //生产环境
        this.mtHttpUrl = "http://api.community.com:10000";
        this.mtSocketioURL = "http://100.67.29.68:9092";
        this.actionViewURL = 'http://218.104.108.251:8088';
        break;
      }
      case RuntimeEnvMode.MOCK: {
        //MOCK环境
      }
      case RuntimeEnvMode.FIX: {
        //FIX环境
      }
    }
  }

  [key: string]: any;
}
