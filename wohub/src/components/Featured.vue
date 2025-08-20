<script setup>
defineProps({
  articles: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="articles">
    <div v-for="article in articles" :key="article.id" class="article-card">
      <h3>{{ article.title }}</h3>
      <p>{{ article.summary }}</p>
    </div>
  </div>
</template>

<style scoped>
.articles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.article-card {
  background: #FAFAFA;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
}
</style>
