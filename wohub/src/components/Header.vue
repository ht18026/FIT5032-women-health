<script setup>
import { auth, currentUser, authIsReady } from "@/firebase/auth"
import { signOut } from "firebase/auth"
import { computed, ref, onMounted } from "vue"
import { getCurrentUserRole } from "@/firebase/auth"

const userEmail = computed(() => currentUser.value?.email ?? "")
const showUserMenu = computed(() => {
  return authIsReady.value && !!currentUser.value
})

// user role
const role = ref("user") 
onMounted(async () => {
  const r = await getCurrentUserRole()
  role.value = r || "user" 
})

// log out
const logout = () => {
  signOut(auth)
    .then(() => {
      alert("Logged out!")
      role.value = "user"
    })
    .catch((error) => {
      console.error("Logout error:", error)
    })
}
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills align-items-center">
        <!-- public page -->
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

        <!-- user dropdown menu -->
        <li class="nav-item dropdown ms-3" v-if="showUserMenu">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            👋 {{ userEmail }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <router-link
              v-if="role === 'user'"
              class="dropdown-item"
              to="/help-user"
            >
              Help for User
            </router-link>

            <router-link
              v-if="role === 'admin'"
              class="dropdown-item"
              to="/admin-dashboard"
            >
              Admin Dashboard
            </router-link>

            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item" @click="logout">Logout</button>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  </div>
</template>
