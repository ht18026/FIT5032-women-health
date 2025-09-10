<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="submitLogin">
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

      <button type="submit">Login</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";

const emit = defineEmits(["loginSuccess"]);
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

const submitLogin = () => {
  validateEmail(true);
  validatePassword(true);

  if (!errors.value.email && !errors.value.password) {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(
          auth,
          formData.value.email,
          formData.value.password
        );
      })
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("✅ Successfully logged in as", user.email);
        alert("Login successful!");
        emit("loginSuccess");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("❌ Login failed:", errorCode, errorMessage);
        errors.value.email = "Login failed. Please check your credentials.";
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