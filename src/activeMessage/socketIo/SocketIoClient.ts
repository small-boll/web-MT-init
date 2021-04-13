import { GlobalAPI } from "@/api/GlobalAPI";
import { mtConsole } from "@/utils/mtConsole";

/**
 * 事件枚举引用
 */
import {
  ConnectTypeEnumType,
  RealtimeEventEnumType,
  AlarmTypeEnumType,
  AlarmEventEnumType
} from "./SocketIoEventenumTypes";
import store from "@/store/store";

/**
 * 【单例模式】消息中间件集成：socketio消息通讯
 * by tuzg 2019-04-09
 * by lavender 2019.09.09 updated
 */
export default class SocketIoClient {
  /**
   * intance单实例【静态方法】
   */
  private static instance: SocketIoClient;

  /**
   * 获取单例
   */
  public static getInstance(): SocketIoClient {
    if (!this.instance) {
      this.instance = new SocketIoClient();
    }
    return this.instance;
  }

  /**
   * 当前的socketio连接对象
   */
  public static currentSocket: any = {};

  /**
   * 客户端唯一Guid
   * socketio.ts中初始化时创建后存入到全局状态管理器中
   */
  public readonly clientId: string;

  /**
   * 构造函数
   */
  public constructor() {
    this.clientId = store.state.socketioClientId;
  }

  /**
   * 连接状态信息
   */
  public static connectionInfo = {
    status: ConnectTypeEnumType.None,
    message: ""
  };

  /**
   * connection连接
   */
  public connection(): any {
    mtConsole.log("socketio连接中......", "");
    SocketIoClient.connectionInfo = {
      status: ConnectTypeEnumType.connecting,
      message: "连接中......"
    };

    if ((<any>this).connected) {
      mtConsole.log("socketio连接成功", "");
      SocketIoClient.currentSocket = this;
      SocketIoClient.connectionInfo = {
        status: ConnectTypeEnumType.connectSuccess,
        message: "连接成功"
      };

      /**注册事件 */
      /**注册【测量预警弹框-车辆】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(AlarmTypeEnumType.carAlarmType, (data: any) => {
          mtConsole.log(
            "【车辆】预警实时信息接收------------------------------>",
            data
          );
          //store.state.carAlarmData = data;
        });
      /**注册【测量预警弹框-wifi】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(AlarmTypeEnumType.wifiAlarmType, (data: any) => {
          mtConsole.log(
            "【wifi】预警实时信息接收------------------------------>",
            data
          );
          //store.state.wifiAlarmData = data;
        });
      /**注册【测量预警弹框-人脸】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(AlarmTypeEnumType.faceAlarmType, (data: any) => {
          mtConsole.log(
            "【人脸】预警实时信息接收------------------------------>",
            data
          );
         // store.state.faceAlarmData = data; //data.alarm_face_event  20191004 by lavender 统一
        });
      /**注册【测量预警弹框-积分】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.integralAlarmType,
          (data: any) => {
            mtConsole.log(
              "【积分】预警实时信息接收------------------------------>",
              data
            );
            //store.state.integralAlramData = data;
          }
        );
      /**注册【涉疆车辆弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.xinJiangCarAlarmType,
          (data: any) => {
            mtConsole.log(
              "【涉疆车辆】预警实时信息接收------------------------------>",
              data
            );
            //store.state.xinJiangCarAlarmData = data;
          }
        );
      /**注册【超出阈值预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.overThresholdAlarmType,
          (data: any) => {
            mtConsole.log(
              "【超出阈值预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.overThresholdAlarmData = data.flow_warn_event;
          }
        );
      /**注册【范围异常预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(AlarmTypeEnumType.outsideAlarmType, (data: any) => {
          mtConsole.log(
            "【范围异常预警】预警实时信息接收------------------------------>",
            data
          );
          //store.state.outsideAlarmData = data;
        });
      /**注册【落脚点预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.footholdAlarmType,
          (data: any) => {
            mtConsole.log(
              "【落脚点预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.footholdAlarmData = data;
          }
        );
      /**注册【动态预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.dynamicWarningAlarmType,
          (data: any) => {
            mtConsole.log(
              "【动态预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.dynamicWarningAlarmData = data;
          }
        );
      /**注册【套牌车预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.coverPlateCarAlarmType,
          (data: any) => {
            mtConsole.log(
              "【套牌车预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.coverPlateCarAlarmData = data;
          }
        );
      /**注册【同行异常预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.peerAnomalyAlarmType,
          (data: any) => {
            mtConsole.log(
              "【同行异常预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.peerAnomalyAlarmData = data;
          }
        );
      /**注册【非法运营车预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.feifaCarAlarmType,
          (data: any) => {
            mtConsole.log(
              "【非法运营车预警】预警实时信息接收------------------------------>",
              data
            );
           // store.state.feifaCarAlarmData = data;
          }
        );
      /**注册【疑似非法运营车预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.yisiFeifaCarAlarmType,
          (data: any) => {
            mtConsole.log(
              "【疑似非法运营车预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.yisiFeifaAlarmData = data;
          }
        );
      /**注册【危险品运输车预警弹框】事件 */
      SocketIoClient
        .getInstance()
        .registerAlarmEvent(
          AlarmTypeEnumType.dangerousCarAlarmType,
          (data: any) => {
            mtConsole.log(
              "【危险品运输车预警】预警实时信息接收------------------------------>",
              data
            );
            //store.state.dangerousCarAlarmData = data;
          }
        );
    } else {
      mtConsole.log("socketio连接失败！", "");
      SocketIoClient.connectionInfo = {
        status: ConnectTypeEnumType.connectFailed,
        message: "连接失败"
      };
    }
  }

  /**
   * disConnection断开连接
   */
  public disConnection(): any {
    mtConsole.log("socketio断开连接", "");
    SocketIoClient.connectionInfo = {
      status: ConnectTypeEnumType.disconnect,
      message: "断开连接"
    };

    /**注销事件 */
    //SocketIoClient.getInstance().removeRealtimeEvent();
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.faceAlarmType); //注销人脸预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.carAlarmType); //注销车辆预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.wifiAlarmType); //注销wifi预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.integralAlarmType); //注销积分预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.xinJiangCarAlarmType); //注销涉疆车辆
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.overThresholdAlarmType); //注销 超出阈值预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.overThresholdAlarmType); //注销 范围异常预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.footholdAlarmType); //注销 落脚点预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.dynamicWarningAlarmType); //注销 动态预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.coverPlateCarAlarmType); //注销 套牌车预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.peerAnomalyAlarmType); //注销 同行异常预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.feifaCarAlarmType); //注销 非法运营车预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.yisiFeifaCarAlarmType); //注销 疑似非法运营车预警
    SocketIoClient
      .getInstance()
      .removeAlarmEvent(AlarmTypeEnumType.dangerousCarAlarmType); //注销 危险品运输车预警
  }

  /******【实时数据】socket.io相关事件函数如下*********************************************** */
  /**
   * 注册事件【实时数据】
   * @param callBack 回调函数(由注册事件监听者自己去处理)
   */
  public registerRealtimeEvent(callBack: (data: any) => void) {
    SocketIoClient.currentSocket.on(
      RealtimeEventEnumType.staff_alarm_event,
      callBack
    );
  }

  /**
   * 移除监听事件【实时数据】
   * @param type 设备类型
   */
  public removeRealtimeEvent() {
    SocketIoClient.currentSocket.removeListener(
      RealtimeEventEnumType.staff_alarm_event
    );
  }

  /**
   * 发送消息
   * @param eventName  事件名称
   * @param msgObj 消息对象
   */
  public sendRealtimeMessage(eventName: string, msgObj: Object) {
    mtConsole.log("socketio发送：", msgObj);
    SocketIoClient.currentSocket.emit(eventName, msgObj);
  }

  /************************************************【预警弹框数据】socket.io相关事件函数如下*********************************************** */
  /**
   * 注册事件【实时预警数据】
   * @param type 设备类型
   * @param callBack 回调函数(由注册事件监听者自己去处理)
   */
  public registerAlarmEvent(
    type: AlarmTypeEnumType,
    callBack: (data: any) => void
  ) {
    switch (type) {
      case AlarmTypeEnumType.faceAlarmType: //人脸预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.faceAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.wifiAlarmType: //wifi预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.wifiAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.carAlarmType: //车辆预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.carAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.xinJiangCarAlarmType: //涉疆车辆预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.xinJiangCarAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.overThresholdAlarmType: //超出阈值预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.overThresholdAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.integralAlarmType: //积分预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.integralAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.outsideAlarmType: //范围异常预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.outsideAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.footholdAlarmType: //落脚点预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.footholdAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.dynamicWarningAlarmType: //动态预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.dynamicWarningAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.coverPlateCarAlarmType: //套牌车预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.coverPlateCarAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.peerAnomalyAlarmType: //同行异常预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.peerAnomalyAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.feifaCarAlarmType: //非法运营车预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.feifaCarAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.yisiFeifaCarAlarmType: //疑似非法运营车预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.yisiFeifaCarAlarmEvent,
          callBack
        );
        break;
      case AlarmTypeEnumType.dangerousCarAlarmType: //危险品运输车预警
        SocketIoClient.currentSocket.on(
          AlarmEventEnumType.dangerousCarAlarmEvent,
          callBack
        );
        break;
      default:
        break;
    }
  }

  /**
   * 移除监听事件【实时数据】
   * @param type 设备类型
   */
  public removeAlarmEvent(type: AlarmTypeEnumType) {
    switch (type) {
      case AlarmTypeEnumType.faceAlarmType: //人脸预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.faceAlarmEvent
        );
        break;
      case AlarmTypeEnumType.wifiAlarmType: //wifi预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.wifiAlarmEvent
        );
        break;
      case AlarmTypeEnumType.carAlarmType: //车辆预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.carAlarmEvent
        );
        break;
      case AlarmTypeEnumType.xinJiangCarAlarmType: //涉疆车辆预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.xinJiangCarAlarmEvent
        );
        break;
      case AlarmTypeEnumType.overThresholdAlarmType: //超出阈值预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.overThresholdAlarmEvent
        );
        break;
      case AlarmTypeEnumType.integralAlarmType: //积分预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.integralAlarmEvent
        );
        break;
      case AlarmTypeEnumType.outsideAlarmType: //范围异常预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.outsideAlarmEvent
        );
        break;
      case AlarmTypeEnumType.footholdAlarmType: //落脚点预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.footholdAlarmEvent
        );
        break;
      case AlarmTypeEnumType.dynamicWarningAlarmType: //动态预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.dynamicWarningAlarmEvent
        );
        break;
      case AlarmTypeEnumType.coverPlateCarAlarmType: //套牌车预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.coverPlateCarAlarmEvent
        );
        break;
      case AlarmTypeEnumType.peerAnomalyAlarmType: //同行异常预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.peerAnomalyAlarmEvent
        );
      case AlarmTypeEnumType.peerAnomalyAlarmType: //非法运营车预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.feifaCarAlarmEvent
        );
      case AlarmTypeEnumType.peerAnomalyAlarmType: //疑似非法运营车预警
        SocketIoClient.currentSocket.removeListener(
          AlarmEventEnumType.yisiFeifaCarAlarmEvent
        );
        break;
      default:
        break;
    }
  }
}
