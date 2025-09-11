<script setup>
import { ref } from "vue";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "@/firebase/init"

const articles = ref([]);
const lastVisible = ref(null);
const loading = ref(false);
const pageSize = 2; 

// load first page
const loadFirstPage = async () => {
  loading.value = true;
  const q = query(
    collection(db, "articles"),
    orderBy("createdAt", "desc"), 
    limit(pageSize)
  );
  const snap = await getDocs(q);

  articles.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  lastVisible.value = snap.docs[snap.docs.length - 1];
  loading.value = false;
};
// load next page
const loadNextPage = async () => {
  if (!lastVisible.value) return;
  loading.value = true;
  const q = query(
    collection(db, "articles"),
    orderBy("createdAt", "desc"),
    startAfter(lastVisible.value),
    limit(pageSize)
  );
  const snap = await getDocs(q);

  articles.value.push(...snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  lastVisible.value = snap.docs[snap.docs.length - 1];
  loading.value = false;
};

loadFirstPage();
</script>

<template>
  <div class="container mt-4">
    <h2>📚 Info Hub</h2>

    <div v-if="loading">loading...</div>

    <ul>
      <li v-for="a in articles" :key="a.id">
        <router-link :to="`/InfoHub/${a.id}`">
          {{ a.title }}
        </router-link>
        <p>{{ a.summary }}</p>
      </li>
    </ul>

    <button v-if="!loading && lastVisible" @click="loadNextPage">
      load more articles...
    </button>
  </div>
</template>
