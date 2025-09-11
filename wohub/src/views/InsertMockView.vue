<script setup>
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/init"

const mockArticles = [
  { id: 1, title: "Healthy Living Tips", summary: "Daily habits for better well-being.", 
    "content": "Here is a long article about building healthy daily habits..."},
  { id: 2, title: "Understanding Mental Health", summary: "Breaking the stigma and supporting each other.",
    "content": "Full content about understanding mental health and reducing stigma..." },
  { id: 3, title: "Nutrition for Women", summary: "How to eat right for different life stages.",
    "content": "Detailed nutrition advice for women at various life stages..." },
  { id: 4, title: "Exercise and Fitness", summary: "Staying active at every age." ,
    "content": "Comprehensive guide on exercise routines suitable for all ages..."
  }
];

const insertArticles = async () => {
  for (const article of mockArticles) {
    await setDoc(doc(db, "articles", String(article.id)), {
      title: article.title,
      summary: article.summary,
      content: article.content,
      createdAt: new Date()
    });
  }
  alert("✅ Mock articles inserted!");
};

insertArticles();
</script>

<template>
  <div class="container">
    <h2>Inserting Mock Articles...</h2>
  </div>
</template>
