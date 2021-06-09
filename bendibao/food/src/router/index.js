import Vue from "vue";
import VueRouter from "vue-router";
import login from "../components/login.vue";
import register from "../components/register.vue";
import HomePage from "../components/homepage.vue";
import Mine from "../components/mine.vue";
import Distribution from "../components/distribution-list.vue";
import FoodDetail from "../components/food-detail.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: login,
  },
  {
    path: "/register",
    component: register,
  },
  {
    path: "/HomePage",
    component: HomePage,
  },
  {
    path: "/Mine",
    component: Mine,
  },
  {
    path: "/Distribution",
    component: Distribution,
  },
  {
    path: "/FoodDetail",
    component: FoodDetail,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
