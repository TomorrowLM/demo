/**
 * 该文件仅在development模式下会使用
 * 用于导入被排除的包
 *
 * 需要注意：
 * 1. 在本地调试无误后，需要去fe-qbee-layout项目将依赖升级至相应版本
 * 2. 该文件仅用于引入被external的包，其他依赖库不应在此文件中导入；通常情况下不需要修改该文件
 */
import 'qt-element-ui/lib/theme-chalk/index.css';
import '@qbee/fe-eb-components/lib/index.css';
import '@qbee/theme-adapt/lib/index.css';
import '@qbee/fe-vue-contacts/lib/index.css';
import '@qbee/business-component/lib/index.css';
import "@qbee/fe-qbee-icon/lib/index.css";


import 'lodash';
import 'axios';
import 'dayjs';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

import QbeeBusinessComponents from '@qbee/business-component';
import QbeeIcon from '@qbee/fe-qbee-icon';
import FeVueContact from '@qbee/fe-vue-contacts';
import QbeeTheme from '@qbee/theme-adapt';
import QtElementUI from 'qt-element-ui';
import QbeeComponents from '@qbee/fe-eb-components';

Vue.use(VueRouter)
  .use(Vuex)
  .use(VueI18n)
  //
  .use(QbeeBusinessComponents)
  .use(QbeeIcon)
  .use(FeVueContact)
  .use(QbeeTheme)
  .use(QtElementUI)
  .use(QbeeComponents);
