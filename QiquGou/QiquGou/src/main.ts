import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/tailwind.css'
import router from './router/index'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
const pinia = createPinia()
app.use(Vant)
app.use(pinia)
app.use(router)
app.mount('#app')
