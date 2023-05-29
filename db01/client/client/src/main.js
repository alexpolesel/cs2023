import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import gAuthPlugin from 'vue3-google-login' 
let gauthClientID = '167534645080-27cek59hke0d0n723cv2e80hphnom8tl.apps.googleusercontent.com';

let app = createApp(App).use(router).use(gAuthPlugin, {clientId: gauthClientID});
app.config.globalProperties.$data = Object;
app.mount('#app');
