<script setup>
import { auth, currentUser, authIsReady } from "@/firebase/auth";
import { signOut } from "firebase/auth";
import { computed } from "vue";

const userEmail = computed(() => currentUser.value?.email ?? "");
const showUserMenu = computed(() => {
  return authIsReady.value && !!currentUser.value;
});
const logout = () => {
  signOut(auth)
    .then(() => {
      alert("Logged out!");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
};
console.log("authIsReady.value:", authIsReady.value);
console.log("currentUser.value:", currentUser.value);
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills align-items-center">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/InfoHub" class="nav-link" active-class="active">Info Hub</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Forum" class="nav-link" active-class="active">Forum</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Resources" class="nav-link" active-class="active">Resources</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Help" class="nav-link" active-class="active">Help</router-link>
        </li>

        <li
          class="nav-item dropdown ms-3"
          v-if="showUserMenu"
        >
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            👋 {{ userEmail }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <button class="dropdown-item" @click="logout">Logout</button>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  </div>
</template>
