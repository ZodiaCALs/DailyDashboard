<template>
  <div class="page page-center">
    <div class="container container-tight py-4">
      <div class="card card-md">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">管理员登录</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">管理密码</label>
              <input v-model="password" type="password" class="form-control" placeholder="请输入密码" required />
            </div>
            <div class="form-footer">
              <button type="submit" class="btn btn-primary w-100">登 录</button>
            </div>
            <p v-if="error" class="text-red mt-3 text-center">{{ error }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref('')

// ⚠️ 生产环境务必改为调用后端登录接口
const ADMIN_PASSWORD = 'your_secure_password_here'

const handleLogin = () => {
  if (password.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('isAdmin', 'true')
    router.push('/')
  } else {
    error.value = '密码错误，请重试'
    password.value = ''
  }
}
</script>