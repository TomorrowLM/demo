import Vue from "vue";
import { createStore } from "vuex";
import Vuex from "vuex";
import getters from "./getters";
import { app } from "@/main";
import common from "./modules/common";
import mainProcess from "./modules/mainProcess";

const storeOptions = {
  modules: {
    common,
    mainProcess,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
};

export default createStore(storeOptions);
