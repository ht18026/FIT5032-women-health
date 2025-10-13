<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase/init"
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { currentUser } from "@/firebase/auth";

const props = defineProps({ id: String });

const article = ref(null);
const avgRating = ref(0);
const submitting = ref(false);
const cooldown = ref(false);   

const loadArticle = async () => {
  const docRef = doc(db, "articles", props.id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    article.value = snap.data();
  }
};

const loadRatings = async () => {
  const ratingsSnap = await getDocs(collection(db, "articles", props.id, "ratings"));
  let total = 0;
  ratingsSnap.forEach(d => { total += d.data().score; });
  avgRating.value = ratingsSnap.size ? (total / ratingsSnap.size).toFixed(1) : 0;
};

const submitRating = async (score) => {
  if (!currentUser.value) {
    alert("Please log in first！");
    return;
  }
  if (submitting.value || cooldown.value) return; 

  submitting.value = true;
  try {
    const ratingRef = doc(db, "articles", props.id, "ratings", currentUser.value.uid);
    await setDoc(ratingRef, { score, createdAt: new Date() });
    await loadRatings();

    // start cooldown
    cooldown.value = true;
    setTimeout(() => {
      cooldown.value = false;
    }, 2000);
  } finally {
    submitting.value = false;
  }
};
const printArticle = () => {
  window.print();
};

onMounted(() => {
  loadArticle();
  loadRatings();
});
</script>

<template>
  <div class="container mt-4" v-if="article">
    <div class="no-print d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-outline-secondary" @click="printArticle" aria-label="Export article as PDF via print">
        🖨️ Export as PDF
      </button>
    </div>
    <section id="print-area">

      <h2>{{ article.title }}</h2>
      <p>{{ article.content }}</p>

      <h3>⭐ Average rating: {{ avgRating }}</h3>
    </section>

    <div>
      <button v-for="n in 5" :key="n" @click="submitRating(n)" :disabled="submitting || cooldown">
        {{ n }} ⭐
      </button>
    </div>
  </div>
</template>
