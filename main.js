import Vue from 'vue'
import App from './App'
<<<<<<< HEAD
=======

>>>>>>> 471eb6915f072becb8f1770ca43b521f34418d46
import store from './store'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()