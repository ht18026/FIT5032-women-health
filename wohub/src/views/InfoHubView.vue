<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/init";

// PrimeVue（局部引入即可）
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

// 数据
const rows = ref([]);
const loading = ref(false);

// 全局搜索
const globalFilter = ref("");

// 列级筛选
const titleFilter = ref("");
const summaryFilter = ref("");
const createdFrom = ref(""); // 'YYYY-MM-DD'
const createdTo = ref("");

// AU/Melbourne 时区格式化
const fmtAU = new Intl.DateTimeFormat("en-AU", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: "Australia/Melbourne",
});

function toJSDate(v) {
  try {
    if (!v) return null;
    if (typeof v?.toDate === "function") return v.toDate(); // Firestore Timestamp
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
    // 若没有 createdAt 字段，可把 orderBy("createdAt","desc") 改成 orderBy("title")
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    rows.value = snap.docs.map(doc => {
      const d = doc.data() || {};
      return {
        id: doc.id,
        title: d.title ?? "Untitled",
        summary: d.summary ?? "",
        content: d.content ?? "",
        createdAt: d.createdAt ?? null,
        createdAtText: formatDateAU(d.createdAt),
      };
    });
  } finally {
    loading.value = false;
  }
});

// 组合“列级筛选 + 全局搜索”
const filteredRows = computed(() => {
  let r = rows.value;

  // 列：Title
  if (titleFilter.value) {
    const t = titleFilter.value.toLowerCase();
    r = r.filter(x => (x.title || "").toLowerCase().includes(t));
  }
  // 列：Summary
  if (summaryFilter.value) {
    const t = summaryFilter.value.toLowerCase();
    r = r.filter(x => (x.summary || "").toLowerCase().includes(t));
  }
  // 列：Created（日期范围）
  if (createdFrom.value || createdTo.value) {
    const from = createdFrom.value ? new Date(createdFrom.value + "T00:00:00") : null;
    const to = createdTo.value ? new Date(createdTo.value + "T23:59:59") : null;
    r = r.filter(x => {
      const d = toJSDate(x.createdAt);
      if (!d) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  // 全局搜索（Title / Summary / Content）
  if (globalFilter.value) {
    const g = globalFilter.value.toLowerCase();
    r = r.filter(x =>
      (x.title || "").toLowerCase().includes(g) ||
      (x.summary || "").toLowerCase().includes(g) ||
      (x.content || "").toLowerCase().includes(g)
    );
  }

  return r;
});

// 清空筛选
function clearFilters() {
  globalFilter.value = "";
  titleFilter.value = "";
  summaryFilter.value = "";
  createdFrom.value = "";
  createdTo.value = "";
}
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-3">InfoHub Articles</h2>

    <!-- 全局搜索 + 清除 -->
    <div class="mb-3" style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;">
      <i class="pi pi-search" />
      <InputText v-model="globalFilter" placeholder="Global search (title / summary / content)" style="max-width:420px;" />
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
      <!-- Title（可排序 + 列筛选） -->
      <Column field="title" header="Title" sortable style="min-width:220px;">
        <template #body="{ data }">
          <router-link :to="`/InfoHub/${data.id}`" class="link">{{ data.title }}</router-link>
        </template>
        <template #filter>
          <InputText v-model="titleFilter" placeholder="Search title" />
        </template>
      </Column>

      <!-- Summary（可排序 + 列筛选） -->
      <Column field="summary" header="Summary" sortable style="min-width:320px;">
        <template #body="{ data }">
          <span>{{ data.summary?.slice(0, 140) || '—' }}<span v-if="data.summary?.length > 140">…</span></span>
        </template>
        <template #filter>
          <InputText v-model="summaryFilter" placeholder="Search summary" />
        </template>
      </Column>

      <!-- Created（可排序 + 列筛选：日期范围） -->
      <Column field="createdAtText" header="Created" sortable style="min-width:170px;">
        <template #filter>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <input type="date" v-model="createdFrom" />
            <span>–</span>
            <input type="date" v-model="createdTo" />
          </div>
        </template>
      </Column>

      <!-- 操作 -->
      <Column header="Action" style="min-width:120px;">
        <template #body="{ data }">
          <router-link :to="`/InfoHub/${data.id}`" class="btn-link">Read</router-link>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.link { text-decoration: none; }
.btn-link { text-decoration: underline; cursor: pointer; }
.container { max-width: 1100px; }
</style>
