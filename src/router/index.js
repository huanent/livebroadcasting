import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import userApi from "../core/data/user";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/my"
  },
  {
    path: "/my",
    name: "MyClass",
    component: () => import("@v/ClassPanel"),
    meta: {
      requireAuth: true,
      title: "我的课堂"
    },
    children: [
      {
        path: "/",
        name: "Classlist",
        component: () => import("@v/ClassPanel/ClassList"),
        meta: {
          title: "课堂列表"
        }
      },
      {
        path: "/setting",
        name: "Setting",
        component: () => import("@v/ClassPanel/ProfileSetting"),
        meta: {
          title: "个人设置"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@v/Login"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("@v/SignUp"),
    meta: {
      title: "注册"
    }
  },
  {
    path: "/liveroom",
    name: "Liveroom",
    meta: {
      requireAuth: true,
      title: ""
    },
    component: () => import("@v/LivePanel")
  }
];

const router = new VueRouter({
  routes
});

const hasToken = () => Boolean(localStorage.getItem("lb_token"));
const isExpired = () => {
  const timestamp = new Date().getTime();
  const expires = Number(localStorage.getItem("lb_expires"));
  return timestamp > expires;
};

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.matched.some(item => item.meta.requireAuth)) {
    if (!hasToken() || isExpired()) {
      next({
        path: "/login",
        replace: true
      });
    } else {
      if (!store.state.account.userInfo) {
        var result = await userApi.getUserInfo();
        store.commit("account/SET_USER_INFO", result.data.model);
      }
      next();
    }
  } else {
    next();
  }
});

export default router;
