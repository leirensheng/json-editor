import Vue from 'vue';
import {
  Select, Input, Option, Notification,
} from 'element-ui';
import App from './test.vue';

Vue.config.productionTip = false;
Vue.use(Select);
Vue.use(Input);
Vue.use(Option);

Vue.prototype.$notification = Notification;

new Vue({
  render: h => h(App),
}).$mount('#app');
