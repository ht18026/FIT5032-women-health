<script setup>
import Featured from './components/Featured.vue';
import Registration from './components/Registration.vue';
</script>
<template>
  
  <header>
    <nav>
    <h1 class="logo">Wohub</h1>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Info Hub</a></li>
      <li><a href="#">Forum</a></li>
      <li><a href="#">Resources</a></li>
      <li><a href="#">Help</a></li>
    </ul>
    <button class="login-btn">Login</button>
  </nav>
  </header>
   <main>    
      <h1 class="text-center">Welcome to WoHub</h1>
 
    <Featured />
 </main>
  <footer class="text-center">
    <p>&copy; 2023 WoHub. All rights reserved.</p>
  </footer>
 

</template>

<style scoped>
header {
  background-color: #3dd17f;
  padding: 15px 30px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
}

.login-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

</style>
