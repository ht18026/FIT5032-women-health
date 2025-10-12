import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/style.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'  
import 'primeicons/primeicons.css'        
import { authReadyPromise } from "@/firebase/auth";

authReadyPromise.then(() => {
  const app = createApp(App)
  app.use(router)
  app.use(PrimeVue, { theme: { preset: Aura }, ripple: true })
  app.mount('#app')
});
