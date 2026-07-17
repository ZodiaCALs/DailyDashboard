import { createApp } from 'vue'
import App from './App.vue'

// ✅ 引入 Tabler 核心样式（含图标字体）
import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/core/dist/css/tabler-vendors.min.css'

createApp(App).mount('#app')