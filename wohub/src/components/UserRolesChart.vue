<script setup>
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import firebaseApp from '@/firebase/init'


Chart.register(ArcElement, Tooltip, Legend, Title)
const fn = getFunctions(firebaseApp, 'us-central1')
const getUserCounts = httpsCallable(fn, 'getUserCounts')


const labels = ref([])
const values = ref([])
const loading = ref(true)


const load = async () => {
const { data } = await getUserCounts()
const entries = Object.entries(data.userCounts || {})
labels.value = entries.map(([k]) => k)
values.value = entries.map(([,v]) => v)
loading.value = false
}


onMounted(load)
</script>


<template>
<div class="card p-3">
<h6>User Types</h6>
<div v-if="loading">Loading…</div>
<Pie v-else :data="{ labels, datasets: [{ label: 'Users', data: values }] }"
:options="{ responsive: true, plugins: { legend: { position: 'bottom' }}}" />
</div>
</template>