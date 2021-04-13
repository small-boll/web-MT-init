/**
 * 连接状态标志信息
 */
enum ConnectTypeEnumType {
  /**
   * 连接中。。。
   */
  connecting = 1,

  /**
   * 连接成功
   */
  connectSuccess = 2,

  /**
   * 连接失败
   */
  connectFailed = 3,

  /**
   * 连接断开
   */
  disconnect = 4,

  /**
   * None
   */
  None = -1
}

/******************************************【实时信息】***************************************************** */
/**
 * 【实时信息-事件】
 */
enum RealtimeEventEnumType {
  /**
   * 发送事件
   */
  staff_alarm_event = "staff_alarm_event"
}

/******************************************【预警信息】***************************************************** */
/**
 * 【预警信息-类型】
 */
enum AlarmTypeEnumType {
  /**
   * 1.人脸预警
   */
  faceAlarmType = "faceAlarm",

  /**
   * 2.wifi预警
   */
  wifiAlarmType = "wifiAlarm",

  /**
   * 3.车辆预警
   */
  carAlarmType = "carAlarm",

  /**
   * 4.积分预警
   */
  integralAlarmType = "integralAlarm",

  /**
   * 5.套牌车预警
   */
  coverPlateCarAlarmType = "coverPlateCarAlarm",

  /**
   * 6.落脚点预警
   */
  footholdAlarmType = "footholdAlarm",

  /**
   * 7.超出范围预警
   */
  outsideAlarmType = "outsideAlarm",

  /**
   * 8.超出阈值预警
   */
  overThresholdAlarmType = "overThresholdAlarm",

  /**
   * 9.涉疆车辆预警
   */
  xinJiangCarAlarmType = "xinJiangCarAlarm",

  /**
   * 10.动态预警（带一键布控操作）
   */
  dynamicWarningAlarmType = "dynamicWarningAlarm",

  /**
   * 11.同行异常预警
   */
  peerAnomalyAlarmType = "peerAnomalyAlarm",

  /**
   * 12.非法运营车预警
   */
  feifaCarAlarmType = "feifaCarAlarm",

  /**
   * 13.疑似非法运营车预警
   */
  yisiFeifaCarAlarmType = "yisiFeifaCarAlarm",

  /**
   * 14.危险品运输车预警
   */
  dangerousCarAlarmType = "dangerousCarAlarm",

  /**
   * 15.视频智能分析预警
   */
  videoIntellAnalysisAlarmType = "videoIntellAnalysisAlarm"
}

/**
 * 【预警信息-事件】
 */
enum AlarmEventEnumType {
  /**人脸预警接收事件 */
  faceAlarmEvent = "alarm_face_event",
  /**wifi预警接收事件 */
  wifiAlarmEvent = "wifiAlarmEvent",
  /**车辆预警接收事件 */
  carAlarmEvent = "carAlarmEvent",
  /**积分预警接收事件 */
  integralAlarmEvent = "integralAlarmEvent",
  /**
   * 涉疆车辆预警接收事件
   */
  xinJiangCarAlarmEvent = "xinJiangCarAlarm",

  /**
   * 超出阈值预警接收事件
   */
  overThresholdAlarmEvent = "flow_warn_event",

  /**
   * 套牌车预警接收事件
   */
  coverPlateCarAlarmEvent = "cloneCarAlarmEvent",

  /**
   * 落脚点预警接收事件
   */
  footholdAlarmEvent = "footholdAlarmEvent",

  /**
   * 超出范围预警接收事件
   */
  outsideAlarmEvent = "out_range_alarm_event",

  /**
   * 动态预警（带一键布控操作）接收事件
   */
  dynamicWarningAlarmEvent = "moreDyanmicAlarmEvent",

  /**
   * 同行异常预警接收事件
   */
  peerAnomalyAlarmEvent = "togetherAlarmEvent",

  /**
   * 非法运营车预警接收事件
   */
  feifaCarAlarmEvent = "illegalCarAlarmEvent",

  /**
   * 疑似非法运营车预警接收事件
   */
  yisiFeifaCarAlarmEvent = "illegaCarEvent",

  /**
   * 危险品运输车预警接收事件
   */
  dangerousCarAlarmEvent = "dangerCarAlarmEvent",

  /**
   * 视频智能分析预警接收事件
   */
  videoIntellAnalysisAlarmEvent = "videoIntellAnalysisAlarmEvent"
}

/**
 * 【实时数据】socket.io相关事件枚举
 */
export {
  ConnectTypeEnumType,
  RealtimeEventEnumType, //【实时信息】
  AlarmTypeEnumType, //【预警信息】类型
  AlarmEventEnumType //【预警新】事件
};
