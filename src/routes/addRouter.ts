import store from "@/store/store";
export const loadMenus = () => {
  let currentMenu = new Object();
  currentMenu =
    store.getters.getPermissionMenu ||
    JSON.parse((sessionStorage as any).getItem("PermissionMenu"));


  let rootParentId = (currentMenu as any) && (currentMenu as any)[0].pid; // 社区区分业务系统使用
  let asyncRouter = new Array();

  if (currentMenu) {
    asyncRouter = evalMenus(currentMenu, rootParentId); // 递归传/web,business业务系统的菜单Id
  }
  return asyncRouter;
};

function evalMenus(currentMenu: any, rootParentId: string) {
  // 导航页中 选中的菜单数据
  currentMenu = Array.isArray(currentMenu)
    ? currentMenu
    : Array.of(currentMenu);
  const accessedRouters = currentMenu.filter((item: any) => {
    if (item.path) {
      if (item.pid === rootParentId) {
        // 1级菜单
        item.component = () => import("@/components/Layout/layout_index.vue");
      } else {
        // 子菜单
        const component = item.component;
        item.component = loadView(component);
        item.meta= { title: item.name };
      }
    }
    if (item.children && item.children.length) {
      item.children = evalMenus(item.children, rootParentId);
    }
    return true;
  });
  // console.log('accessedRouters====================>',accessedRouters);
  return accessedRouters;
}
function loadView(view: any) {
  // console.log('view===============\\\\\\\\\\\\\\\\\\\>',view);
  // 路由懒加载
  let fileName = view.split("/")[2];
  // console.log('fileName===============\\\\\\\\\\\\\\\\\\\>',fileName);
  let pascal = fileName && (fileName.substring(0, 1).toUpperCase() + fileName.substring(1)); // 首字母大写
  
  return () => import(`@/components${view}/${pascal}Index.vue`);
}

export default loadMenus;
