<script setup>
import { ref } from "vue";

import Header from './components/Header.vue';



</script>

<template>
  <header>
     <Header />
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer class="text-center">
    <p>&copy; 2025 WoHub. All rights reserved.</p>
  </footer>
</template>

<style scoped>
header {
  background-color: #A5D6A7;
  padding: 15px 30px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; 
}

.nav-links {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
}

.welcome-section {
  padding: 30px;
  background: #F1F8E9;
  border-radius: 12px;
  margin: 20px;
}

.intro-text {
  margin: 15px 0;
  font-size: 1.1rem;
  color: #444;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-btn {
  background-color: #66BB6A;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background-color: #4CAF50;
}

.switch-text {
  margin-top: 15px;
  font-size: 0.95rem;
  color: #555;
}

.switch-text a {
  color: #388E3C;
  text-decoration: underline;
  cursor: pointer;
}

.featured-articles {
  margin: 40px 20px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.1);
}
</style>
