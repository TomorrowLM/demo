import Vue from "vue";
import { createStore } from "vuex";
import Vuex from "vuex";
import getters from "./getters";
import { app } from "@/main";
import common from "./modules/common";
import ws from "./modules/ws";
import map from "./modules/map";

const storeOptions = {
  modules: {
    common,
    ws,
    map,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
};

(app as any).use(createStore(storeOptions));
