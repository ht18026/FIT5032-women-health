import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import InfoHubView from '@/views/InfoHubView.vue'
import ForumView from '@/views/ForumView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import HelpView from '@/views/HelpView.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/InfoHub',
    name: 'InfoHub',
    component: InfoHubView
  },
  {
    path: '/Forum',
    name: 'Forum',
    component: ForumView
  },
  {
    path: '/Resources',
    name: 'Resources',
    component: ResourcesView
  },
  {
    path: '/Help',
    name: 'Help',
    component: HelpView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router