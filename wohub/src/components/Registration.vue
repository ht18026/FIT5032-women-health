<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const errors = ref({})

// 简单验证函数
function validateForm() {
  errors.value = {}

  if (!name.value) {
    errors.value.name = 'Name is required'
  }

  // Email 格式验证
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!emailPattern.test(email.value)) {
    errors.value.email = 'Invalid email format'
  }

  // 密码长度验证
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (Object.keys(errors.value).length === 0) {
    alert('✅ Registration successful!')
  }
}
</script>

<template>
  <section class="registration">
    <h2>Register</h2>
    <form @submit.prevent="validateForm">
      <div>
        <label>Name:</label>
        <input v-model="name" type="text" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div>
        <label>Email:</label>
        <input v-model="email" type="email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div>
        <label>Password:</label>
        <input v-model="password" type="password" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <button type="submit">Sign Up</button>
    </form>
  </section>
</template>

<style scoped>
.registration {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.error {
  color: red;
  font-size: 0.9rem;
}
</style>
