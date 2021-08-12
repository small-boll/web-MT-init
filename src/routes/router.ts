import Vue from "vue";
import Router from "vue-router";
import addRouter from "@/routes/addRouter";
import store from "@/store/store";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return (originalPush.call(this, location) as any).catch((err: any) => err);
};

Vue.use(Router);

let router = new Router({
  routes: [
    { path: "/", redirect: "/Login" },
    {
      path: "/Login",
      name: "Login",
      meta: { title: "Login页" },
      component: (resolve) => require(["@/pages/Login.vue"], resolve),
    },
    {
      path: "/LoginAnimation",
      name: "LoginAnimation",
      meta: { title: "LoginAnimation页" },
      component: (resolve: any) =>
        require(["@/pages/LoginAnimation.vue"], resolve),
    },
    {
      path: "/Triangle",
      name: "Triangle",
      meta: { title: "Triangle" },
      component: (resolve: any) =>
        require(["@/pages/Triangle.vue"], resolve),
    },
    {
      path: "/StudyTable",
      name: "StudyTable",
      meta: { title: "StudyTable" },
      component: (resolve: any) =>
        require(["@/pages/StudyTable.vue"], resolve),
    },
    {
      path: "/GoStudy1",
      name: "GoStudy1",
      meta: { title: "GoStudy1" },
      component: (resolve: any) =>
        require(["@/components/gojs/GoStudy1.vue"], resolve),
    },
    {
      path: "/MyCKEdit",
      name: "MyCKEdit",
      meta: { title: "MyCKEdit" },
      component: (resolve: any) =>
        require(["@/components/edit/MyCKEdit.vue"], resolve),
    },
    {
      path: "/GridLayout",
      name: "GridLayout",
      meta: { title: "GridLayout" },
      component: (resolve: any) =>
        require(["@/components/gridLayout/GridLayout.vue"], resolve),
    },
    {
      path: "/CssStep",
      name: "CssStep",
      meta: { title: "CssStep" },
      component: (resolve: any) =>
        require(["@/components/css/CssStep.vue"], resolve),
    },
    {
      path: "/MapIndex1",
      name: "MapIndex1",
      meta: { title: "MapIndex1" },
      component: (resolve: any) =>
        require(["@/components/map/MapIndex1.vue"], resolve),
    },
    {
      path: "/MapIndex2",
      name: "MapIndex2",
      meta: { title: "MapIndex2" },
      component: (resolve: any) =>
        require(["@/components/map/MapIndex2.vue"], resolve),
    },
    {
      path: "/CssCounter",
      name: "CssCounter",
      meta: { title: "CssCounter" },
      component: (resolve: any) =>
        require(["@/components/css/CssCounter.vue"], resolve),
    },
    {
      path: "/GExample1",
      name: "GExample1",
      meta: { title: "GExample1" },
      component: (resolve: any) =>
        require(["@/components/gridLayout/gridExample/GExample1.vue"], resolve),
    },
    {
      path: "/ClipPath",
      name: "ClipPath",
      meta: { title: "ClipPath" },
      component: (resolve: any) =>
        require(["@/components/gridLayout/gridExample/ClipPath.vue"], resolve),
    },
    {
      path: "/GridAndClipPath",
      name: "GridAndClipPath",
      meta: { title: "GridAndClipPath" },
      component: (resolve: any) =>
        require(["@/components/gridLayout/gridExample/GridAndClipPath.vue"], resolve),
    },
    {
      path: "/MultipleColumnLayot",
      name: "MultipleColumnLayot",
      meta: { title: "MultipleColumnLayot" },
      component: (resolve: any) =>
        require(["@/components/multipleColumnLayot/MultipleColumnLayot.vue"], resolve),
    },
    
  ],
});

//路由守卫，待接口恢复后可放开，取代 ...addRouter()
router.beforeEach((to: any, from, next) => {
  if (sessionStorage.getItem("userinfo") && !store.getters.getLoadMenus) {
    let addRouters = addRouter();
    router.addRoutes(addRouters); // 动态添加可访问路由表

    store.dispatch("setLoadMenus", true);

    if (!store.getters.getUserinfo) {
      store.dispatch(
        "setUserinfoAction",
        JSON.parse(sessionStorage.getItem("userinfo") as any)
      );
      next({ ...to, replace: true });
    } else {
      next();
    }
  } else if (sessionStorage.getItem("userinfo") && store.getters.getLoadMenus) {
    next();
  } else {
    // if (to.path == "/Login") {
      //如果是登录页面路径，就直接next()
      next();
    // } else {
      //不然就跳转到登录；
      // next("/Login");
    // }
  }

  next();
});

export default router;
