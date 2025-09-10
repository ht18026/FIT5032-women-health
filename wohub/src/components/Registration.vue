<template>
  <div class="login-form">
    <h2>Register</h2>
    <form @submit.prevent="submitRegister">
      <div>
        <label>Email:</label>
        <input
          type="email"
          v-model="formData.email"
          @input="() => validateEmail(false)"
          @blur="() => validateEmail(true)"
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          v-model="formData.password"
          @input="() => validatePassword(false)"
          @blur="() => validatePassword(true)"
        />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const emit = defineEmits(["switchToLogin"]);
const auth = getAuth();

const formData = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: null,
  password: null,
});

const validateEmail = (blur) => {
  const email = formData.value.email;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (blur && !email) {
    errors.value.email = "Email is required";
  } else if (blur && !emailPattern.test(email)) {
    errors.value.email = "Invalid email format";
  } else {
    errors.value.email = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (blur && password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long`;
  } else if (blur && !hasUpperCase) {
    errors.value.password = "Password must contain at least one uppercase letter";
  } else if (blur && !hasLowerCase) {
    errors.value.password = "Password must contain at least one lowercase letter";
  } else if (blur && !hasNumber) {
    errors.value.password = "Password must contain at least one number";
  } else if (blur && !hasSpecialChar) {
    errors.value.password = "Password must contain at least one special character";
  } else {
    errors.value.password = null;
  }
};

const submitRegister = () => {
  validateEmail(true);
  validatePassword(true);

  if (!errors.value.email && !errors.value.password) {
    createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("✅ Registered as", user.email);
        alert("Registration successful. Please login.");
        emit("switchToLogin");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("❌ Register failed:", errorCode, errorMessage);

        if (errorCode === "auth/email-already-in-use") {
          errors.value.email = "This email is already registered.";
        } else {
          errors.value.email = "Registration failed. Try again.";
        }
      });
  }
};
</script>

<style scoped>
.login-form {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
}
.error {
  color: red;
  font-size: 0.9rem;
}
</style>
