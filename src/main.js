import Vue from 'vue';
import { Select, Input, Option } from 'element-ui';
import App from './test.vue';

Vue.config.productionTip = false;
Vue.use(Select);
Vue.use(Input);
Vue.use(Option);

new Vue({
  render: h => h(App),
}).$mount('#app');
