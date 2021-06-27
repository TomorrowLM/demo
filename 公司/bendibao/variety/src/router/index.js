import Vue from "vue";
import VueRouter from "vue-router";
import Restrictions from "../components/restrictions.vue";
import Router from "../components/router.vue"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "router",
    component: Router,
  },
  {
    path: "/restrictions",
    name: "restrictions",
    component: Restrictions,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
