import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/workplace"
  },
  {
    path: "/my",
    name: "MyClass",
    component: () => import("@v/myclass"),
    children: [
      {
        path: "/",
        name: "Classlist",
        component: () => import("@c/my-class")
      },
      {
        path: "detail",
        name: "Classdetail",
        component: () => import("@c/my-class/classlist/detail")
      }
    ]
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("@c/my-class//userinfo/my-class-setting")
  },
  {
    path: "/loginout",
    name: "LoginOut",
    component: () => import("@c/my-class/userinfo/my-class-loginout")
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
    path: "/workplace",
    name: "Workplace",
    meta: {
      requireAuth: true
    },
    component: () => import("@v/workplace")
  },
  {
    path: "/classform",
    name: "Classform",
    meta: {
      requireAuth: true
    },
    component: () => import("@v/classform")
  }
];

const router = new VueRouter({
  routes
});

// const hasToken = () => Boolean(localStorage.getItem("lb_token"));
// const isExpired = () => {
//   const timestamp = new Date().getTime()
//   const expires = Number(localStorage.getItem("lb_expires"))
//   return timestamp > expires
// };
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(item => item.meta.requireAuth)) {
//     if (!hasToken() || isExpired) {
//       next({
//         path: "/login",
//         replace: true
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
