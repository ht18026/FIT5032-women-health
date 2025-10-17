<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js'
import { db } from '@/firebase/init'
import { collection, getDocs } from 'firebase/firestore'


Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)


const labels = ref([])
const dataVals = ref([])
const loading = ref(true)


const load = async () => {
loading.value = true
const arts = await getDocs(collection(db, 'articles'))
const lbls = []
const vals = []
for (const docSnap of arts.docs) {
const articleId = docSnap.id
lbls.push(docSnap.data().title || articleId)
const rs = await getDocs(collection(db, 'articles', articleId, 'ratings'))
let total = 0
rs.forEach(r => total += (r.data().score || 0))
vals.push(rs.size ? (total / rs.size) : 0)
}
labels.value = lbls
dataVals.value = vals
loading.value = false
}


onMounted(load)
</script>


<template>
<div class="card p-3">
<h6>Avg Rating by Article</h6>
<div v-if="loading">Loading…</div>
<Bar v-else :data="{ labels, datasets: [{ label: 'Avg Rating', data: dataVals }] }"
:options="{ responsive: true, plugins: { legend: { display: true }}}" />
</div>
</template>