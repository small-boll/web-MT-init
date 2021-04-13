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
