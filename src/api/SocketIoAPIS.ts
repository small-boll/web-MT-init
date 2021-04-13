import { MTConfig } from "@/config/MTConfig";

/**
 * socketio消息中间件url地址
 */
const mtSocketioURL = MTConfig.Instance().mtSocketioURL;

/**
 * socketio消息中间件API
 */
const SocketIoAPIS = {
  /**
   * socketio消息中间件url地址
   */
  mt_socketio_api: { url: mtSocketioURL },
};

export { SocketIoAPIS };
