<script setup>
import { ref } from 'vue'

// 模拟动态数据，可以换成 fetch('articles.json') 之类
const articles = ref([
  { id: 1, title: 'Understanding Body Changes', category: 'Health', summary: 'Learn about puberty and body changes every teen should know.' },
  { id: 2, title: 'Managing Stress Effectively', category: 'Mental Health', summary: 'Tips and tricks to handle daily stress in a healthy way.' },
  { id: 3, title: 'Building Self Confidence', category: 'Growth', summary: 'Practical steps to improve your self-image and confidence.' }
])
</script>

<template>
  <section class="featured">
    <h2>Featured Articles</h2>
    <div class="articles">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <h3>{{ article.title }}</h3>
        <p><strong>Category:</strong> {{ article.category }}</p>
        <p>{{ article.summary }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured {
  max-width: 800px;
  margin: 30px auto;
}
.articles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.article-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #fafafa;
}
</style>
