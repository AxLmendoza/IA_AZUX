import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store' 
import '@fortawesome/fontawesome-free/css/all.css';

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  router,
  store, 
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')