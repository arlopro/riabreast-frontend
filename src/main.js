import './main.scss';
import "boxicons/css/boxicons.min.css";

import {createApp} from 'vue'
import App from './App.vue'
import router from './router' // Import del router
import axios from 'axios'

const app = createApp(App)
const publicRoutes = ['/auth/login', '/auth/register']

axios.defaults.baseURL = import.meta.env.VITE_API_URL

//Imposta sempre il token in ogni richiesta
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Interceptor per intercettare le risposte
axios.interceptors.response.use(
  response => response,
  error => {
    const requestUrl = error.config?.url

    const isPublic = publicRoutes.some(path => requestUrl?.includes(path))

    if (error.response && error.response.status === 401 && !isPublic) {
      localStorage.removeItem('token')
      router.push({ name: 'welcome' })
    }

    return Promise.reject(error)
  }
)

app.use(router) // Aggiunge il router a Vue
app.mount('#app')
