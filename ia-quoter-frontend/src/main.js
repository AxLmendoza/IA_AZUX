import Vue from 'vue'
import App from './App.vue'
import router from './routes'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify: new Vuetify(), // Solo una vez todo bien
  render: h => h(App)
}).$mount('#app')
