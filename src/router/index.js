import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      requireAuth: true
    },
    component: () => import("@c/HelloWorld.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@v/Login.vue")
  }
];

const router = new VueRouter({
  routes
});

// const hasToken = () => Boolean(localStorage.getItem("token"));
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
