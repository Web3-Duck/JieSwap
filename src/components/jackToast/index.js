import Message from './message.js';
import MessageComponent from './message.vue';
import VueI18n from 'vue-i18n';

import './message.less';

Message.install = function (Vue, options) {
  Vue.use(VueI18n);
  const i18n = new VueI18n({
    locale: 'zh', //切换语言
    messages: {
      zh: require('./language/zh.js'),
      en: require('./language/en.js'),
    },
  });
  Vue.prototype._i18n = i18n;

  if (options && options.name) {
    Vue.prototype[`$${options.name}`] = Message;
  } else {
    Vue.prototype.$message = Message;
  }
};

export const MMessage = MessageComponent;
export default Message;
