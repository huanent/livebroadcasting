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
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(item => item.meta.requireAuth)) {
//     if (!hasToken()) {
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
