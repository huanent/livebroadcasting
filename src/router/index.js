import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@v/Main.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@v/Login.vue"),
  },
];

const router = new VueRouter({
  routes,
});

// const hasUserSig = () => Boolean(localStorage.getItem("userSig"));
// router.beforeEach((to, from, next) => {
//   if (to.matched.some((item) => item.meta.requireAuth)) {
//     if (!hasUserSig()) {
//       next({
//         path: "/login",
//         replace: true,
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
