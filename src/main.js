import Vue from 'vue';
import {
  Select, Input, Option, Notification, Button, ColorPicker, DatePicker,
} from 'element-ui';
import App from './test.vue';

Vue.config.productionTip = false;
Vue.use(Select);
Vue.use(Input);
Vue.use(Option);
Vue.use(ColorPicker);
Vue.use(Button);
Vue.use(DatePicker);


Vue.prototype.$notification = Notification;

new Vue({
  render: h => h(App),
}).$mount('#app');
