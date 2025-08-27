<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  password: ''
})

const errors = ref({
  name: null,
  email: null,
  password: null,
})

const validateName = (blur) => {
  if (blur && !formData.value.name.trim()) {
    errors.value.name = 'Name is required'
  } else {
    errors.value.name = null
  }
}

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (blur && !formData.value.email) {
    errors.value.email = 'Email is required'
  } else if (blur && !emailPattern.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (blur && password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long`
  } else if (blur && !hasUpperCase) {
    errors.value.password = 'Password must contain at least one uppercase letter'
  } else if (blur && !hasLowerCase) {
    errors.value.password = 'Password must contain at least one lowercase letter'
  } else if (blur && !hasNumber) {
    errors.value.password = 'Password must contain at least one number'
  } else if (blur && !hasSpecialChar) {
    errors.value.password = 'Password must contain at least one special character'
  } else {
    errors.value.password = null
  }
}

const submitForm = () => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)

  if (!errors.value.name && !errors.value.email && !errors.value.password) {
    alert('✅ Registration successful!')
    formData.value = { name: '', email: '', password: '' }
  }
}
</script>

<template>
  <section class="registration">
    <h2>Register</h2>
    <form @submit.prevent="submitForm">
      <!-- Name -->
      <div>
        <label>Name:</label>
        <input 
          v-model="formData.name" 
          type="text"
          @input="() => validateName(false)"
          @blur="() => validateName(true)" 
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label>Email:</label>
        <input 
          v-model="formData.email" 
          type="email"
          @input="() => validateEmail(false)"
          @blur="() => validateEmail(true)" 
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div>
        <label>Password:</label>
        <input 
          v-model="formData.password" 
          type="password"
          @input="() => validatePassword(false)"
          @blur="() => validatePassword(true)" 
        />
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
  color: rgba(255, 115, 0, 0.918);
  font-size: 0.9rem;
}
</style>
