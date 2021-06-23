import axios from "axios";
import { showLoading, hideLoading } from "@/utils/loading";

/**消息提醒 */
import { MessageBoxInfo } from "@/utils/messageBox";
import store from "@/store/store";
import { mtConsole } from "@/utils/mtConsole";
import { Message } from "element-ui";
import { ieFileUtil } from "@/utils/ieFileUtil";
import { Base64 } from "js-base64";
import { MTConfig } from "@/config/MTConfig";
import { verify } from "@/utils/verify";
import Vue from "vue";
import { RuntimeEnvMode } from "@/utils/enumTypes";

import { mockNetWork } from "@/dataDeploy/mock/mockNetWork";
import { fixNetwork } from "@/dataDeploy/fix/fixNetwork";

/**变量 */
let cancel: any,
  promiseArr: any = {},
  promiseCount: number = 0;
const CancelToken = axios.CancelToken;

/**axios默认设置 */
axios.defaults = {
  timeout: 30000 //默认超时时间30s
};

let errorArray: Array<any> = [0, 404, 405, 200, 400];

/**请求拦截器 */
axios.interceptors.request.use(
  (request: any) => {
    request.headers["Content-Type"] = "application/json;charset=UTF-8";
    request.headers["Authorization"] = `Basic c2FiZXI6c2FiZXJfc2VjcmV0`;
    request.headers["Blade-Auth"] =
      "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ0ZW5hbnRfaWQiOiI4ODc3NDYiLCJyb2xlX25hbWUiOiJhZG1pbiIsInBvc3RfaWQiOiIxMzk1MTk0Njc2OTYxMDU4ODE3IiwidXNlcl9pZCI6IjEyOTU4OTE4OTg0NTMwMDgzODUiLCJyb2xlX2lkIjoiMTM5NTE5NTA3NTIxODYxMjIyNSIsInVzZXJfbmFtZSI6ImFkbWluIiwibmlja19uYW1lIjoiYWRtaW4iLCJkZXRhaWwiOnsidHlwZSI6IndlYiJ9LCJ0b2tlbl90eXBlIjoiYWNjZXNzX3Rva2VuIiwiZGVwdF9pZCI6IjEzOTUxOTE1OTA4MzgzMTI5NjAiLCJhY2NvdW50IjoiYWRtaW4iLCJjbGllbnRfaWQiOiJzYWJlciIsImV4cCI6MTYyNDYxMjcyMSwibmJmIjoxNjIzODkyNzIxfQ.Pere6nC2aQ_uKo_aH7zxZ2pXYhkgvE2mlpOgD8v0Mru98AIvnpQOSo7DiWdTwyUTj3ZKNUeFhmZky9vvHiwSLg";
    request.headers["Tenant-Id"] = "887746";
    //设置FormData数据的请求头headers
    if (request.params instanceof FormData)
      request.headers["Content-Type"] = "multipart/form-data";

    //设置 导出数据 响应类型
    if (request.data && request.data.isBlob) {
      request.headers.responseType = "blob";
    }

    //为了防止重复请求ajax：发起请求时，取消掉当前正在进行的相同请求
    if (!!promiseArr[request.url]) {
      if (
        !(
          request.url.indexOf("realplay") !== -1 ||
          request.url.indexOf("bye") !== -1
        )
      ) {
        // console.log("op cancel:", request.url);
        promiseArr[request.url]("操作取消");
      }
    }
    if (
      !(
        request.url.indexOf("realplay") !== -1 ||
        request.url.indexOf("bye") !== -1
      )
    ) {
      promiseArr[request.url] = cancel;
    }

    //YnVzaW5lc3N3ZWI6YnVzaW5lc3N3ZWJfc2VjcmV0
    //${Base64.encode( "saber:saber_secret")}
    //request.headers["Authorization"] = `Basic ${Base64.encode("saber:saber_secret")}`;

    //携带token设置
    if (!!store.state.token) {
      request.headers["authorization"] = store.state.token;
      //让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
      //request.headers["Blade-Auth"] = "bearer " + store.state.token;
      //console.log("store.state.token", store.state.token);
    } else if (!!sessionStorage.getItem("token"))
      //console.log("sessionStorage.token", sessionStorage.getItem("token"));
      request.headers["authorization"] = sessionStorage.getItem("token");
    //request.headers["Blade-Auth"] =
    // "bearer " + sessionStorage.getItem("token");
    if (!(request.params && request.loadingTarget == "null")) {
      promiseCount++;
    }

    sessionStorage.setItem("headers", "");

    return request;
  },
  (err: any) => {
    promiseCount--;
    promiseCount > -1 && hideLoading();
  }
);

/**响应拦截器 */
axios.interceptors.response.use(
  (response: any) => {
    //关闭loading
    promiseCount--;
    promiseCount > -1 && hideLoading();
    //1.文件流处理 by lavender 2019.09.14
    const headers = response.headers;
    if (
      headers["content-type"] === "application/octet-stream;charset=utf-8" ||
      headers["content-type"] === "application/vnd.ms-excel;charset=UTF-8"
    ) {
      return response;
    }

    mtConsole.log("响应拦截器返回接口数据------------------------->", response);
    let state = response.data.code || response.status;
    const message =
      response.data.msg ||
      response.data.error_description ||
      response.data.message ||
      "未知错误";
    //debugger;
    //2.状态码返回处理
    if (response.data.code === 401) {
      //后台返回402：表示token失效，失效后跳转到登录页
      let msgResult = MessageBoxInfo.Alert(
        `当前token凭证已经失效了，请重新登录`,
        "error",
        "token失效消息提示：",
        true
      );

      msgResult
        .then(() => {
          //清除保存的历史token值
          store.state.token = "";
          //跳转到登录页
          window.location.href = "/";
        })
        .catch(() => {});
    } else if (
      errorArray.includes(state) ||
      typeof state == "string" ||
      checkUrl(response)
    ) {
      return response;
    } else {
      //其他未处理的状态码直接响应失败，错误提示
      // Message.error(`【${response.config.url}】错误消息：${JSON.stringify(response.data)}`)
      Message.error(message);
      console.log(
        `【${response.config.url}】错误消息：${JSON.stringify(response.data)}`
      );
    }

    return response;
  },
  (err: any) => {
    promiseCount--;
    promiseCount > -1 && hideLoading(); //关闭loading
    // debugger;
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "【400】错误请求";
          break;
        case 401:
          err.message = "【401】授权失效";
          break;
        case 403:
          err.message = "【403】授权失效";
          break;
        case 404:
          err.message = "【404】请求错误,未找到该资源";
          break;
        case 405:
          err.message = "【405】请求方法未允许";
          break;
        case 408:
          err.message = "【408】请求超时";
          break;
        case 500:
          err.message = "【500】服务器端出错";
          break;
        case 501:
          err.message = "【501】网络未实现";
          break;
        case 502:
          err.message = "【502】网络错误";
          break;
        case 503:
          err.message = "【503】服务不可用";
          break;
        case 504:
          err.message = "【504】网络超时";
          break;
        case 505:
          err.message = "【505】http版本不支持该请求";
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    } else if (err.message == "操作取消") {
      ieFileUtil.recordOperation(
        "c:\\logs\\operation.txt",
        "重复请求,err=" + err
      );
      //重复提交时，给的错误提示
      err.message = "重复请求，请稍后重试！";
      err.status = "canceled";
    } else {
      //非重复提交时，给的错误提示
      err.message = "连接到服务器失败";
    }

    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.status != 500
    ) {
      //处理因后台无法统一业务验证提示以错误方式抛出的消息统一拦截处理  2020-04-08 by lavender
      let errResData = err.response.data;
      if (
        Object.getOwnPropertyNames(errResData).find(item => {
          return item == "msg";
        })
      ) {
        let chinese = verify.GetChinese(errResData.msg);
        if (chinese != "") {
          Message.warning(chinese);
        }
      } else if (err.response.status == 401) {
        let msgResult = MessageBoxInfo.Alert(
          `当前token凭证已经失效了，请重新登录`,
          "error",
          "token失效消息提示：",
          true
        );

        msgResult
          .then(() => {
            //清除保存的历史token值
            store.state.token = "";
            //跳转到登录页
            window.location.href = "/";
          })
          .catch(() => {});
      }
    } else if (err.status != "canceled") {
      //非重复提交时抛出错误
      Message.error(err.message);
    }

    // Message.error(`【${err.config.url}】错误消息：${JSON.stringify(err.message)}`);
    console.log(err);

    return Promise.reject(err.message);
  }
);

/**
 * 统一封装get/post的http异步请求
 * @param url  url地址
 * @param params  请求参数， 默认值：{}
 * @param method  请求方式：get/post，默认值：'get'
 * @param loadingTarget  loading显示的DOM区域，默认是body区域，即全屏显示loading，可以根据自己的需要显示的区域设置loadingTarget即可
 */
export const httpAsync = (
  baseUrl: string,
  url: string,
  method: string = "get",
  params: any = {},
  queryParams: any = {}
) => {
  if (MTConfig.Instance().CurrentRuntimeMode == RuntimeEnvMode.MOCK) {
    //mock数据
    ///url ="/authority/captcha";
    return mockNetWork.getMock(url);
  } else if (MTConfig.Instance().CurrentRuntimeMode == RuntimeEnvMode.FIX) {
    //fix数据
    url = "/authority/captcha";
    return fixNetwork.getMock(url);
  } else {
    if (!!baseUrl) {
      baseUrl = MTConfig.Instance()[baseUrl];
    }

    //显示loading区域设置
    //HOME页交通路况 不显示loading
    if (params.loadingTarget != "null") {
      !!params.loadingTarget
        ? showLoading(params.loadingTarget)
        : showLoading(".app-container");
    }

    let Method = method.toLowerCase(); //请求方式
    let getParams = Method === "get" ? params : {}; //get参数
    let postParams = Method === "post" ? params : {}; //post参数

    let queryPath = getQuery(queryParams);
    if (
      queryPath != undefined &&
      queryPath != queryParams &&
      queryPath.length > 0
    ) {
      url = url + "?" + queryPath;
    }

    let headers: any = sessionStorage.getItem("headers");
    headers = headers == null || headers == "" ? "{}" : headers;
    headers = JSON.parse(headers);

    return new Promise((resolve, reject) => {
      axios({
        method: Method, //请求方式
        url: baseUrl + url, //url地址
        params: getParams, //get参数
        data: postParams, //post参数
        headers: headers,
        cancelToken: new CancelToken((c: any) => (cancel = c)) //取消请求函数创建
      })
        .then((res: any) => resolve(res.data))
        .catch((err: any) => reject(err));
    });
  }
};

/**
 * 判断输入地址用于处理返回特殊数据格式
 * @param response
 */
const checkUrl = function(response: any) {
  let url = response.config.url;
  if (url.indexOf("/oauth/captcha") >= 0) {
    return true;
  }
  return false;
};

/**
 * 拆分json  参数为 query
 * @param query
 */
const getQuery = function(query: any) {
  if (query == null || query == "") {
    return "";
  }
  let str = "";
  for (let item in query) {
    str += (str.length > 0 ? "&" : "") + item + "=" + query[item];
  }
  return str;
};
