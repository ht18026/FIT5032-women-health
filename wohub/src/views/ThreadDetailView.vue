<!-- src/views/ThreadDetailView.vue -->
<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { db } from "@/firebase/init"
import { doc, getDoc } from "firebase/firestore"

const route = useRoute()
const tid = route.params.id
const loading = ref(true)
const thread = ref(null)

onMounted(async () => {
  const snap = await getDoc(doc(db, "threads", String(tid)))
  thread.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
  loading.value = false
})
</script>

<template>
  <div class="container py-4">
    <div v-if="loading">Loading…</div>
    <div v-else-if="!thread">Not found.</div>
    <div v-else>
      <h2 class="mb-2">{{ thread.title }}</h2>
      <div class="text-muted mb-3">
        <span>{{ thread.category || 'General' }}</span> ·
        <span>by {{ thread.authorName || '—' }}</span>
      </div>
      <p style="white-space: pre-wrap">{{ thread.content }}</p>
      <router-link to="/Forum" class="btn btn-link mt-3">← Back to Forum</router-link>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 900px; }
</style>
