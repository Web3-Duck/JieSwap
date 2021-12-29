import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vant from 'vant';
import VueI18n from 'vue-i18n';
import 'vant/lib/index.less';
import '@vant/touch-emulator';

import Message from '@/components/jackToast/index';
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en', //切换语言
  messages: {
    zh: require('./language/zh.js'),
    en: require('./language/en.js'),
  },
});
Vue.use(Vant);
Vue.config.productionTip = false;

Vue.use(Message);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
