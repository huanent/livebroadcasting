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
    component: () => import("@v/myclass"),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: "/",
        name: "Classlist",
        component: () => import("@c/my-class")
      },
      {
        path: "/setting",
        name: "Setting",
        component: () => import("@c/my-class/my-setting")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@v/login.vue")
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("@v/signup.vue")
  },
  {
    path: "/liveroom",
    name: "Liveroom",
    meta: {
      requireAuth: true
    },
    component: () => import("@v/workplace")
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
