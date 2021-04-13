import { mtConsole } from "./mtConsole";

import { MTConfig } from "@/config/MTConfig";

// exports.install = function (Vue: any, options: any) {
//     Vue.prototype.getPermissionBtn = getPermissionBtn;
// };
const getPermissionBtn = function(code: string, btn: string = "btn") {
  if (btn == "btn") {
    return getBtn(code);
  }
  if (btn == "isShow") {
    return isShow(code);
  }
  return getBtn(code);
};
/**
 * 获取按钮图标
 * @param code
 */
const getBtnIco = function(code: string) {
  if (code == null || code == "") {
    return "el-icon-plus";
  }
  switch (code.toLowerCase()) {
    case "add":
      return "el-icon-plus";
    case "edit":
      return "el-icon-edit";
    case "delete":
      return "el-icon-delete";
    case "view":
      return "el-icon-tickets";
    case "search":
      return "el-icon-search";
    case "clear":
      return "el-icon-delete";
    case "import":
      return "el-icon-upload2";
    case "export":
      return "el-icon-plus";
    case "handle":
      return "el-icon-connection";
    default:
      return "el-icon-search";
  }
};

const getBtn = function(code: string) {
  // todo 暂时不设置权限，后期进行调整
  return getAdmin();

  let json = sessionStorage.getItem("PermissionBtn") || "";
  let userinfo = sessionStorage.getItem("userinfo") || "";
  if ((json == null || json == "") && (userinfo == null || userinfo == "")) {
    return [];
  }
  let user: any = JSON.parse(userinfo);
  if (user.loginName != MTConfig.Instance().authorization) {
    return [];
  }

  if (user.loginName == MTConfig.Instance().authorization) {
    return getAdmin();
  }
  let permissionBtn = [];
  try {
    permissionBtn = JSON.parse(json);
  } catch (ex) {
    mtConsole.log("ex=======================", ex);
    return [];
  }

  if (permissionBtn == null) {
    return [];
  }

  let btnArr = new Array<any>(); // 除 详情，编辑，删除外的按钮
  let tableBtnObj: any = new Object(); // 详情，编辑，删除 按钮
  let item: any = permissionBtn.find((p: any) => {
    return p.code == code;
  });
  if (item == null) {
    return [];
  }
  let it: any;
  for (it of item.children) {
    if (["edit", "delete", "view", "recard", "handle"].includes(it.alias)) {
      tableBtnObj[`${it.alias}Show`] = true;
    } else {
      let obj = {
        name: it.name,
        funcName: it.alias,
        icon: getBtnIco(it.alias),
        vpermission: ["admin", `${code}:` + it.alias + ""],
      };
      btnArr.push(obj);
    }
  }
  return [btnArr, tableBtnObj];
};

const getAdmin = function() {
  let arr = ["edit", "delete", "view", "add"];
  let btnArr = new Array<any>(); // 除 详情，编辑，删除外的按钮
  let tableBtnObj: any = new Object(); // 详情，编辑，删除 按钮
  let it: any;
  for (it of arr) {
    if (["edit", "delete", "view", "recard", "handle"].includes(it)) {
      tableBtnObj[`${it}Show`] = true;
    } else {
      let obj = {
        name: it,
        funcName: it,
        icon: getBtnIco(it),
        vpermission: ["admin", `${it}:` + it + ""],
      };
      btnArr.push(obj);
    }
  }

  return [btnArr, tableBtnObj];
};

const isShow = function(code: any) {
  let json = sessionStorage.getItem("PermissionBtn");
  if (json == null || json == "") {
    return [];
  }

  let permissionBtn = [];
  try {
    permissionBtn = JSON.parse(json);
  } catch (ex) {
    mtConsole.log("ex=======================", ex);
    return [];
  }

  if (permissionBtn == null) {
    return [];
  }

  let item: any = permissionBtn.find((p: any) => {
    return p.code == code;
  });
  if (item == null) {
    return [];
  }

  let tableBtnObj: any = []; // 详情，编辑，删除 按钮
  item.children.map((p: any) => {
    tableBtnObj[`${p.alias}Show`] = true;
  });
  return tableBtnObj;
};

export { getPermissionBtn };
