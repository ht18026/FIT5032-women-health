import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import InfoHubView from "@/views/InfoHubView.vue"
import ArticleDetailView from "@/views/ArticleDetailView.vue"
import ForumView from "@/views/ForumView.vue"
import ResourcesView from "@/views/ResourcesView.vue"
import HelpUserView from "@/views/HelpUserView.vue"
import AdminDashboardView from "@/views/AdminDashboardView.vue"
import { getCurrentUserRole } from "@/firebase/auth"

import InsertMockView from "@/views/InsertMockView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/InfoHub", name: "InfoHub", component: InfoHubView },
  { path: "/InfoHub/:id", name: "ArticleDetail", component: ArticleDetailView, props: true },
  { path: "/Forum", name: "Forum", component: ForumView },
  { path: "/Resources", name: "Resources", component: ResourcesView },

  { path: "/insert-mock", name: "InsertMock", component: InsertMockView },

  { path: "/help-user", name: "HelpUser", component: HelpUserView, meta: { role: "user" } },
  { path: "/admin-dashboard", name: "AdminDashboard", component: AdminDashboardView, meta: { role: "admin" } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// route guard
router.beforeEach(async (to, from, next) => {
  if (!to.meta.role) return next()

  const role = await getCurrentUserRole()
  console.log("🚦 navigating to:", to.path, "need:", to.meta.role, "have:", role)

  if (role === "admin") {
    return next()
  }

  if (role === to.meta.role) {
    return next()
  }

  next("/")
})


export default router
