<template>
  <div class="container py-4 admin-dashboard">
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h2 class="mb-0">Admin Dashboard</h2>
        <small class="text-muted">Manage announcements, view stats, and more.</small>
      </div>
      <div class="d-none d-md-flex gap-2">
        <a href="#stats" class="btn btn-outline-secondary btn-sm">Stats</a>
        <a href="#email" class="btn btn-outline-primary btn-sm">Email</a>
      </div>
    </div>

    <!-- Stats section (placeholder now; swap to real charts later) -->
    <div id="stats" class="row g-3 mb-4">
      <!-- KPI row -->
      <div class="col-12">
        <div class="card p-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5 class="mb-0">Key Stats</h5>
            <span class="badge bg-secondary">coming soon</span>
          </div>
          <div class="row row-cols-2 row-cols-md-4 g-3">
            <div class="col" v-for="n in 4" :key="n">
              <div class="kpi card text-center p-3">
                <div class="text-uppercase small text-muted">Metric {{ n }}</div>
                <div class="display-6">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts row (placeholders; replace with real components later) -->
      <div class="col-lg-6">
        <div class="card p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">Article Ratings</h6>
            <span class="badge bg-light text-dark">placeholder</span>
          </div>
          <div class="placeholder-glow">
            <div class="placeholder col-12" style="height:260px;"></div>
          </div>
          <!-- Replace with: <ArticleMetricsChart /> -->
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">User Types</h6>
            <span class="badge bg-light text-dark">placeholder</span>
          </div>
          <div class="placeholder-glow">
            <div class="placeholder col-12" style="height:260px;"></div>
          </div>
          <!-- Replace with: <UserRolesChart /> -->
        </div>
      </div>
    </div>

    <!-- Email section -->
    <div id="email" class="row g-3">
      <!-- Right column: sticky email tools -->
      <div class="col-lg-4 order-lg-2">
        <div class="position-sticky" style="top: 1rem;">
          <div class="card p-3 mb-3">
            <h5 class="mb-2">Quick Send</h5>
            <SendEmailModal />
          </div>
          <div class="card p-3">
            <h5 class="mb-2">Bulk Email</h5>
            <BulkEmailPanel />
          </div>
        </div>
      </div>

      <!-- Left column: room for notes or future admin widgets -->
      <div class="col-lg-8 order-lg-1">
        <div class="card p-4 h-100">
          <h5 class="mb-2">Notes</h5>
          <ul class="mb-0 small text-muted">
            <li>Use Bulk Email to send version updates to multiple recipients.</li>
            <li>The Stats section will display KPI cards and interactive charts later.</li>
            <li>When stats are ready, replace the placeholders with real components.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BulkEmailPanel from "@/components/BulkEmailPanel.vue";
import SendEmailModal from "@/components/SendEmailModal.vue";
// 未来加统计时再解开：
// import ArticleMetricsChart from "@/components/ArticleMetricsChart.vue";
// import UserRolesChart from "@/components/UserRolesChart.vue";
</script>

<style scoped>
.admin-dashboard .card { border-radius: 1rem; }
.kpi { min-height: 100px; }
.placeholder { border-radius: .75rem; }
</style>
