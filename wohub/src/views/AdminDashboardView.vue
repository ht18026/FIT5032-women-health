<template>
  <div class="container py-4 admin-dashboard">
    <!-- Header -->
    <div class="hero card border-0 mb-4">
      <div class="card-body d-flex align-items-center justify-content-between p-4">
        <div>
          <h2 class="mb-1">Admin Dashboard</h2>
          <div class="text-muted small">Manage announcements, view stats, and more.</div>
        </div>
        <div class="d-none d-md-flex gap-2">
          <a href="#stats" class="btn btn-light btn-sm">Stats</a>
          <a href="#email" class="btn btn-outline-light btn-sm">Email</a>
        </div>
      </div>
    </div>

    <!-- Stats section -->
    <div id="stats" class="row g-3 mb-4">
      <!-- KPI row -->
      <div class="col-12">
        <div class="card p-3 kpi-card">
          <div class="card-title d-flex align-items-center justify-content-between mb-2">
            <h5 class="mb-0">Key Stats</h5>
            <span class="badge bg-secondary">live</span>
          </div>
          <div class="row row-cols-2 row-cols-md-4 g-3">
            <div class="col" v-for="n in 4" :key="n">
              <div class="kpi card text-center p-3 shadow-sm">
                <div class="text-uppercase small text-muted">Metric {{ n }}</div>
                <div class="display-6 fw-semibold">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="col-lg-6">
        <div class="card p-3 h-100 shadow-sm">
          <div class="card-title d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">Article</h6>
          </div>
          <ArticleMetricsChart />
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card p-3 h-100 shadow-sm">
          <div class="card-title d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">User</h6>
          </div>
          <UserRolesChart />
        </div>
      </div>
    </div>

    <!-- Email section -->
    <div id="email" class="row g-3">
      <!-- Right column: sticky email tools -->
      <div class="col-lg-4 order-lg-2">
        <div class="position-sticky" style="top: 1rem;">
          <div class="card p-3 mb-3 shadow-sm">
            <h5 class="mb-2">Quick Send</h5>
            <SendEmailModal />
          </div>
          <div class="card p-3 shadow-sm">
            <h5 class="mb-2">Bulk Email</h5>
            <BulkEmailPanel />
          </div>
        </div>
      </div>

      <!-- Left column: space for notes / future widgets -->
      <div class="col-lg-8 order-lg-1">
        <div class="card p-4 h-100 shadow-sm">
          <h5 class="mb-2">Notes</h5>
          <ul class="mb-0 small text-muted">
            <li>Use Bulk Email to send version updates to multiple recipients.</li>
            <li>Stats show KPI cards and interactive charts.</li>
            <li>You can add role filters or date ranges later.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BulkEmailPanel from "@/components/BulkEmailPanel.vue";
import SendEmailModal from "@/components/SendEmailModal.vue";
import ArticleMetricsChart from "@/components/ArticleMetricsChart.vue";
import UserRolesChart from "@/components/UserRolesChart.vue";

import { Chart } from "chart.js";

const PALETTE = [
  "#4F46E5", "#06B6D4", "#22C55E", "#EAB308", "#EF4444",
  "#8B5CF6", "#F97316", "#10B981", "#3B82F6", "#14B8A6",
];

const autoPalette = {
  id: "autoPalette",
  beforeUpdate(chart, args, opts) {
    const palette = (opts && opts.palette) || PALETTE;
    chart.data?.datasets?.forEach((ds) => {
      const len = Array.isArray(ds.data) ? ds.data.length : 0;

      const hasColors =
        !!ds.backgroundColor &&
        (!Array.isArray(ds.backgroundColor) || ds.backgroundColor.length > 0);

      if (!hasColors) {
        ds.backgroundColor = palette.slice(0, len);
      }
      if (!ds.borderColor) {
        ds.borderColor = palette.slice(0, len);
      }
      if (ds.borderWidth === undefined) ds.borderWidth = 1;
    });
  },
};

if (!Chart.registry.plugins.get("autoPalette")) {
  Chart.register(autoPalette);
  Chart.defaults.plugins.autoPalette = { palette: PALETTE };
  Chart.defaults.font.family = `'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`;
  Chart.defaults.color = "#334155"; 
}
</script>

<style scoped>
.admin-dashboard .card { border-radius: 16px; }
.admin-dashboard .card-title { border-bottom: 1px solid rgba(0,0,0,.06); padding-bottom: .5rem; }

.hero {
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(79, 70, 229, .25);
}

.kpi { min-height: 100px; border-radius: 14px; }
.shadow-sm { box-shadow: 0 10px 20px -12px rgba(15, 23, 42, .15) !important; }

@media (max-width: 991.98px) {
  .hero .btn { border-color: rgba(255,255,255,.6) !important; color: #fff !important; }
}
</style>
