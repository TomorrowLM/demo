import Vue from "vue";
import VueRouter from "vue-router";
import Sport from "../components/sport.vue";
import Info from "../components/info.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Sport,
  },
  {
    path: "/info",
    component: Info,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
