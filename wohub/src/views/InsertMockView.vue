<script setup>
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/init";

// ----------------- 保留：文章 mock + 插入 -----------------
const mockArticles = [
  { id: 1, title: "Healthy Living Tips", summary: "Daily habits for better well-being.", 
    content: "Here is a long article about building healthy daily habits..." },
  { id: 2, title: "Understanding Mental Health", summary: "Breaking the stigma and supporting each other.",
    content: "Full content about understanding mental health and reducing stigma..." },
  { id: 3, title: "Nutrition for Women", summary: "How to eat right for different life stages.",
    content: "Detailed nutrition advice for women at various life stages..." },
  { id: 4, title: "Exercise and Fitness", summary: "Staying active at every age.",
    content: "Comprehensive guide on exercise routines suitable for all ages..." }
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

// ----------------- 新增：论坛 threads mock + 插入（同样风格） -----------------
const mockThreads = [
  {
    id: 1,
    title: "How to build a consistent sleep routine?",
    content: "I keep waking up at night. Any tips to improve sleep quality?",
    category: "Lifestyle",
    status: "open",
    tags: ["sleep", "routine"],
    authorId: "seed",
    authorName: "Seeder",
    repliesCount: 2,
    views: 45,
    isPinned: false
  },
  {
    id: 2,
    title: "Coping strategies for anxiety before exams",
    content: "Feeling anxious this week. What helps you calm down?",
    category: "Mental Health",
    status: "open",
    tags: ["anxiety", "study"],
    authorId: "seed",
    authorName: "Seeder",
    repliesCount: 1,
    views: 88,
    isPinned: false
  },
  {
    id: 3,
    title: "Healthy breakfast ideas on a budget",
    content: "Share quick, affordable breakfast recipes please!",
    category: "Lifestyle",
    status: "open",
    tags: ["nutrition", "breakfast"],
    authorId: "seed",
    authorName: "Seeder",
    repliesCount: 0,
    views: 32,
    isPinned: false
  },
  {
    id: 4,
    title: "Community guidelines discussion",
    content: "Proposing some updates to keep the forum helpful.",
    category: "General",
    status: "closed",
    tags: ["moderation"],
    authorId: "seed",
    authorName: "Seeder",
    repliesCount: 5,
    views: 120,
    isPinned: false
  }
];

const insertThreads = async () => {
  for (const t of mockThreads) {
    await setDoc(doc(db, "threads", String(t.id)), {
      title: t.title,
      content: t.content,
      category: t.category,
      status: t.status,
      tags: t.tags,
      authorId: t.authorId,
      authorName: t.authorName,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPostAt: new Date(),
      lastPosterId: t.authorId,
      lastPosterName: t.authorName,
      repliesCount: t.repliesCount ?? 0,
      views: t.views ?? 0,
      isPinned: !!t.isPinned
    });
  }
  alert("✅ Mock threads inserted!");
};
insertThreads();
</script>

<template>
  <div class="container">
    <h2>Inserting Mock data...</h2>
  </div>
</template>
