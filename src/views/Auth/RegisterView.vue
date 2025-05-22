<template>
  <div class="auth-container register-container">
    <h1>Registrazione</h1>
    <p>
      La <strong>registrazione all’app è del tutto anonima</strong>, ti verrà assegnato un PIN di
      accesso per tracciare i tuoi progressi ma <strong>non ti verrà chiesto alcun dato
      personale</strong>, motivo per cui sarà importante <strong>conservare il PIN</strong> in
      quanto <span style="text-decoration: underline">non è recuperabile.</span>
    </p>
    <p>
      Per poterti collocare nella fase migliore della riabilitazione ti chiediamo di rispondere ad
      alcune semplici domande.
    </p>

    <label>Seleziona la tua fascia d'età</label>
    <select v-model="form.age_range">
      <option>Meno di 30 Anni</option>
      <option>Tra 31 e 45 Anni</option>
      <option>Tra 46 e 60 Anni</option>
      <option>Tra 61 e 75 Anni</option>
      <option>+76 Anni</option>
    </select>

    <label>Quanto tempo è trascorso dall’intervento?</label>
    <select v-model="form.surgery_time">
      <option>Meno di 1 Settimana</option>
      <option>+2 Settimane</option>
      <option>+1 Mese</option>
    </select>

    <label>Che tipo di intervento hai subito?</label>
    <select v-model="form.surgery_type">
      <option>Mastectomia</option>
      <option>Quadrantectomia</option>
      <option>Mastectomia e dissezione del cavo ascellare</option>
      <option>Quadrantectomia e dissezione del cavo ascellare</option>
      <option>Dissezione del cavo ascellare</option>
    </select>

    <label>Che grado di liberta di movimento ti ha dato il chirurgo?</label>
    <select v-model="form.movement">
      <option>Libero</option>
      <option>90 gradi</option>
      <option>Nessun movimento</option>
    </select>

    <button @click="register" class="btn btn-primary">Richiedi PIN di accesso</button>
    <p style="font-size: 14px; color: #666;margin-top: 9px; width: 60%">
      Cliccando su <strong>"Richiedi PIN di accesso"</strong> dichiari di aver letto e compreso la nostra
      <a href="https://www.auslromagna.it/privacy/privacy-policy" target="_blank" rel="noopener noreferrer">
        Informativa sulla Privacy
      </a>.
    </p>
    <router-link to="/" class="btn btn-secondary btn-back">Torna alla schermata principale</router-link>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
  age_range: 'Meno di 30 Anni',
  surgery_time: 'Meno di 1 Settimana',
  surgery_type: 'Mastectomia',
  movement: 'Libero'
})

const register = async () => {
  try {
    const response = await axios.post('/auth/register', form.value);

    console.log('Registrazione avvenuta con successo:', response.data) // 🔍 DEBUG

    if (response.data.pin) {
      router.push({name: 'registerSuccess', query: {pin: response.data.pin}})
    } else {
      alert('Errore: nessun PIN ricevuto')
    }
  } catch (error) {
    console.error('Errore durante la registrazione:', error)
    alert('Errore nella registrazione')
  }
}

</script>

<style lang="scss" scoped>
@use "@/assets/scss/auth";
</style>
