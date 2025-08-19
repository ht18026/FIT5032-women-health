<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label>Email</label>
      <input type="email" v-model="email" class="form-control" required>
      <small v-if="emailError" class="text-danger">{{ emailError }}</small>
    </div>
    <div class="mb-3">
      <label>Password</label>
      <input type="password" v-model="password" class="form-control" required minlength="6">
      <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
    </div>
    <button type="submit" class="btn btn-primary">Register</button>
  </form>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const emailError = ref('')
    const passwordError = ref('')

    const handleSubmit = () => {
      emailError.value = ''
      passwordError.value = ''

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email.value)) {
        emailError.value = 'Invalid email format'
      }
      if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters'
      }

      if (!emailError.value && !passwordError.value) {
        alert('Form submitted!')
        // TODO: send data to backend
      }
    }

    return { email, password, emailError, passwordError, handleSubmit }
  }
}
</script>
