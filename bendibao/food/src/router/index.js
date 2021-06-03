import Vue from "vue";
import VueRouter from "vue-router";
import register from "../components/register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: register,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
