import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ✅ 导入 router
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/style.css'

const app = createApp(App)
app.use(router)               // ✅ 注册 router
app.mount('#app')