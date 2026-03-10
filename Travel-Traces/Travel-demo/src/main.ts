import { createApp } from 'vue'
import './assets/tailwind.css'
import router from './router/index.ts'
import App from './App.vue'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
