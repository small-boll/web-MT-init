/**
 * 引入socketioClient单例
 */
import SocketIoClient from "./SocketIoClient";

import { GlobalAPI } from "@/api/GlobalAPI";

import { common } from "@/utils/common";

import store from "@/store/store";

/**
 * 引入vue-socket.io组件
 */
import io from "socket.io-client";
import { mtConsole } from "@/utils/mtConsole";

/**
 * socketio
 */
export default {
  data() {
    return {};
  },
  methods: {
    socketioInit() {
      /**
       * open
       */
      let newGuid = common.getNewGuid();
      store.state.socketioClientId = newGuid;
      mtConsole.log("socketioClientId-newGuid", newGuid);
      var url = GlobalAPI.SocketIoAPIS.mt_socketio_api.url.concat(
        "?clientId=",
        newGuid
      );
      mtConsole.log("socketioClientId-url", url);
      let socket = io.connect(url);

      /**
       * 连接connect状态
       */
      socket.on("connect", SocketIoClient.getInstance().connection);

      /**
       * 断开连接disconnect
       */
      socket.on("disconnect", SocketIoClient.getInstance().disConnection);
    },
    closesocket() {
      let socket = SocketIoClient.currentSocket;
      socket.removeAllListeners();
      socket.disconnect();
    },
  },
};
