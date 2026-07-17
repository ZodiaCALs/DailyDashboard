import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@tabler/core/dist/css/tabler.min.css'
// import '@tabler/icons-webfont/tabler-icons.min.css'

const app = createApp(App)
app.use(router)
app.mount('#app')