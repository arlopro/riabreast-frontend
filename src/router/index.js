import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExtraView from '@/views/ExtraView.vue'
import FaqView from '@/views/FaqView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import RegisterSuccessView from '@/views/Auth/RegisterSuccessView.vue'
import WelcomeView from '@/views/Auth/WelcomeView.vue'
import VideoDetailView from '@/views/VideoDetailView.vue'
import QuestionnaireView from '@/views/QuestionnaireView.vue'
import SettingsView from '@/views/SettingsView.vue'
import PreRegistrationView from '@/views/Auth/PreRegistrationView.vue'
import SessionChartView from '@/views/SessionChartView.vue'

const routes = [
  { path: '/', name: 'welcome', component: WelcomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/pre-registration', name: 'preRegistration', component: PreRegistrationView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/register-success', name: 'registerSuccess', component: RegisterSuccessView },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/extra', name: 'extra', component: ExtraView },
  { path: '/faq', name: 'faq', component: FaqView },
  { path: '/stats', name: 'stats', component: SessionChartView },
  { path: '/video/:type/:id', name: 'videoDetail', component: VideoDetailView },
  { path: '/questionario', name: 'questionario', component: QuestionnaireView },
  { path: '/settings', name: 'impostazioni', component: SettingsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protezione delle pagine che richiedono il login
// Array delle pagine pubbliche che NON richiedono autenticazione
const publicRoutes = ['welcome', 'login', 'register', 'registerSuccess', 'preRegistration']

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Se la pagina NON è pubblica e l'utente non è autenticato, lo reindirizziamo a Welcome
  if (!token && !publicRoutes.includes(to.name)) {
    next({ name: 'welcome' })
  } else {
    next()
  }
})

export default router
