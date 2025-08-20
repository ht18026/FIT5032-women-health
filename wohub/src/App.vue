<script setup>
import { ref } from "vue";
import Featured from "./components/Featured.vue";
import Registration from "./components/Registration.vue";

const showRegistration = ref(false);

const articles = [
  { id: 1, title: "Healthy Living Tips", summary: "Daily habits for better well-being." },
  { id: 2, title: "Understanding Mental Health", summary: "Breaking the stigma and supporting each other." },
  { id: 3, title: "Nutrition for Women", summary: "How to eat right for different life stages." }
];
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
    <section class="welcome-section text-center">
      <h1>Welcome to WoHub</h1>
      
      <div v-if="!showRegistration">
        <p class="intro-text">
          WoHub is a safe and supportive space for women of all ages.  
          Here you can explore trusted health information, share stories, and access community resources.  
          Join us in creating a healthier and happier future together.
        </p>
        <div class="actions">
          <button class="action-btn" @click="showRegistration = true">Register</button>
        </div>
      </div>

      <div v-else>
        <Registration />
      </div>
    </section>

    <section class="featured-articles">
      <h2>Featured Articles</h2>
      <Featured :articles="articles" />
    </section>
  </main>

  <footer class="text-center">
    <p>&copy; 2023 WoHub. All rights reserved.</p>
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
  background-color: #81C784;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
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

.action-btn {
  background-color: #66BB6A;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background-color: #4CAF50;
}

.featured-articles {
  margin: 40px 20px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.1);
}
</style>
