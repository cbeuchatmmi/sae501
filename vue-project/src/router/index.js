import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddView from '../views/AddView.vue'
import LoginView from '../views/LoginView.vue'
import PanierView from '../views/PanierView.vue'
import MontreDetails from '../views/MontreDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/panier', name: 'panier', component: PanierView },
    { path: '/add', name: 'add', component: AddView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/montres/:id', component: MontreDetails, name: 'montre-detail' },

  ]
})

export default router
