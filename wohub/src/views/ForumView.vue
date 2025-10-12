<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/init";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const loading = ref(false);
const rows = ref([]);

const globalFilter = ref("");
const titleFilter = ref("");
const authorFilter = ref("");
const categoryFilter = ref(null);
const statusFilter = ref(null);

const categoryOptions = ref([]);
const statusOptions = ["open", "closed"];

const fmtAU = new Intl.DateTimeFormat("en-AU", {
  year: "numeric", month: "short", day: "2-digit",
  hour: "2-digit", minute: "2-digit",
  timeZone: "Australia/Melbourne"
});

function toJSDate(v) {
  try {
    if (!v) return null;
    if (typeof v?.toDate === "function") return v.toDate();
    const d = new Date(v);
    return isNaN(d) ? null : d;
  } catch { return null; }
}
function formatDateAU(v) {
  const d = toJSDate(v);
  return d ? fmtAU.format(d) : "—";
}

onMounted(async () => {
  loading.value = true;
  try {
    const q = query(collection(db, "threads"), orderBy("lastPostAt", "desc"));
    const snap = await getDocs(q);
    const cats = new Set();
    rows.value = snap.docs.map(doc => {
      const d = doc.data() || {};
      if (d.category) cats.add(d.category);
      return {
        id: doc.id,
        title: d.title ?? "Untitled",
        category: d.category ?? "General",
        status: d.status ?? "open",
        tags: Array.isArray(d.tags) ? d.tags : [],
        authorName: d.authorName ?? "—",
        repliesCount: d.repliesCount ?? 0,
        views: d.views ?? 0,
        createdAt: d.createdAt ?? null,
        createdAtText: formatDateAU(d.createdAt),
        lastPostAt: d.lastPostAt ?? null,
        lastPostAtText: formatDateAU(d.lastPostAt),
      };
    });
    categoryOptions.value = Array.from(cats).sort();
  } finally {
    loading.value = false;
  }
});

const filteredRows = computed(() => {
  let r = rows.value;

  if (titleFilter.value) {
    const t = titleFilter.value.toLowerCase();
    r = r.filter(x => (x.title || "").toLowerCase().includes(t));
  }
  if (authorFilter.value) {
    const t = authorFilter.value.toLowerCase();
    r = r.filter(x => (x.authorName || "").toLowerCase().includes(t));
  }
  if (categoryFilter.value) {
    r = r.filter(x => x.category === categoryFilter.value);
  }
  if (statusFilter.value) {
    r = r.filter(x => x.status === statusFilter.value);
  }
  if (globalFilter.value) {
    const g = globalFilter.value.toLowerCase();
    r = r.filter(x =>
      (x.title || "").toLowerCase().includes(g) ||
      (x.category || "").toLowerCase().includes(g) ||
      (x.authorName || "").toLowerCase().includes(g) ||
      (x.tags || []).some(tag => tag.toLowerCase().includes(g))
    );
  }

  return r;
});

function clearFilters() {
  globalFilter.value = "";
  titleFilter.value = "";
  authorFilter.value = "";
  categoryFilter.value = null;
  statusFilter.value = null;
}
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-3">Forum Threads</h2>

    <div class="mb-3" style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;">
      <i class="pi pi-search" />
      <InputText v-model="globalFilter" placeholder="Global search (title / category / author / tag)" style="max-width:420px;" />
      <Button label="Clear" @click="clearFilters" />
    </div>

    <DataTable
      :value="filteredRows"
      :loading="loading"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10,20,50]"
      dataKey="id"
      sortMode="multiple"
      responsiveLayout="scroll"
      class="shadow-sm rounded"
    >
      <!-- Title -->
      <Column field="title" header="Title" sortable style="min-width:260px;">
        <template #body="{ data }">
          <router-link :to="`/forum/${data.id}`" class="link">{{ data.title }}</router-link>
          <div class="muted" v-if="data.tags?.length"># {{ data.tags.join('  # ') }}</div>
        </template>
        <template #filter>
          <InputText v-model="titleFilter" placeholder="Search title" />
        </template>
      </Column>

      <!-- Category -->
      <Column field="category" header="Category" sortable style="min-width:160px;">
        <template #filter>
          <Dropdown v-model="categoryFilter" :options="categoryOptions" placeholder="All" showClear style="min-width:150px;" />
        </template>
      </Column>

      <!-- Status -->
      <Column field="status" header="Status" sortable style="min-width:130px;">
        <template #filter>
          <Dropdown v-model="statusFilter" :options="statusOptions" placeholder="All" showClear style="min-width:120px;" />
        </template>
      </Column>

      <!-- Author -->
      <Column field="authorName" header="Author" sortable style="min-width:160px;">
        <template #filter>
          <InputText v-model="authorFilter" placeholder="Search author" />
        </template>
      </Column>

      <!-- Replies -->
      <Column field="repliesCount" header="Replies" sortable style="min-width:110px;" />

      <!-- Last Activity -->
      <Column field="lastPostAtText" header="Last Activity" sortable style="min-width:190px;" />

      <!-- Created -->
      <Column field="createdAtText" header="Created" sortable style="min-width:170px;" />
    </DataTable>
  </div>
</template>

<style scoped>
.link { text-decoration: none; }
.muted { color:#6c757d; font-size:.85rem; margin-top:.25rem; }
.container { max-width: 1100px; }
</style>
