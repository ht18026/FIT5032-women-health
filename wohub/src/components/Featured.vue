<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase/init";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const articles = ref([]);

onMounted(async () => {
  const q = query(
    collection(db, "articles"),
    orderBy("createdAt", "desc"), 
    limit(4)                     
  );
  const snap = await getDocs(q);
  articles.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
</script>

<template>
  <div class="articles">
    <div v-for="article in articles" :key="article.id" class="article-card">
      <h3>{{ article.title }}</h3>
      <p>{{ article.summary }}</p>
      <router-link :to="`/InfoHub/${article.id}`">Read More →</router-link>
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
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-3px);
}
</style>
