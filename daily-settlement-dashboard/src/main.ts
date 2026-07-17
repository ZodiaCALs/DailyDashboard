import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Tabler 核心样式（必须）
import '@tabler/core/dist/css/tabler.min.css'

// 如果使用了 Tabler Icons 字体图标（可选）
// import '@tabler/icons-webfont/tabler-icons.min.css'

const app = createApp(App)
app.use(router)
app.mount('#app')