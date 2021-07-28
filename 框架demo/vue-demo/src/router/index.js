import Vue from "vue";
import VueRouter from "vue-router";
import Nav from "../components/nav.vue";
import Props from "../components/props.vue";
import Transition from "../components/transition.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Nav,
  },
  {
    path: "/Props",
    component: Props,
  },
  {
    path: "/Transition",
    component: Transition,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
