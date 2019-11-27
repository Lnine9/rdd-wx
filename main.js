import Vue from 'vue'
import App from './App'
<<<<<<< HEAD

=======
import store from './store'
Vue.config.productionTip = false
>>>>>>> 7fa96c555b7d2b3bc8713ac0b51588b77af3a64c

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()