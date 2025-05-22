<template>
  <div class="logged-container-dark questionnaire-container">
    <div class="header">
      <h2 class="title">Autovalutazione</h2>
      <p class="subtitle">Aiutaci a migliorare il tuo percorso di riabilitazione<br>Clicca "Conferma e continua" dopo aver compilato le domande.</p>
    </div>

    <div class="content">
      <form @submit.prevent="submitAnswers">

        <div
          class="question-group"
          v-for="(group, title) in groupedQuestions"
          :key="title"
        >
          <h3 class="group-title">{{ title }}</h3>

          <div
            class="question-box"
            v-for="question in group"
            :key="question.id"
          >
            <p class="question-description">{{ question.question }}</p>

            <!-- Scala -->
            <div v-if="question.type === 'scale'" class="scale-options">
              <div class="scale-labels">
                <span>{{ question.labels[0] }}</span>
                <span>{{ question.labels[1] }}</span>
                <span>{{ question.labels[2] }}</span>
              </div>
              <div class="scale-values">
                <label
                  v-for="n in 11"
                  :key="n"
                  :class="{ active: answers[question.id] === n - 1 }"
                >
                  <input
                    type="radio"
                    :name="'question-' + question.id"
                    :value="n - 1"
                    v-model="answers[question.id]"
                  />
                  {{ n - 1 }}
                </label>
              </div>
            </div>

            <!-- Choice -->
            <div v-else-if="question.type === 'choice'" class="choice-options">
              <label
                v-for="option in question.options"
                :key="option"
                :class="{ active: answers[question.id] === option }"
              >
                <input
                  type="radio"
                  :name="'question-' + question.id"
                  :value="option"
                  v-model="answers[question.id]"
                />
                {{ option }}
              </label>
            </div>
          </div>
        </div>


        <button type="submit" class="btn btn-secondary">Conferma e continua</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'

const questions = ref([])
const answers = ref({})
const router = useRouter()

const groupedQuestions = ref({})

onMounted(async () => {
  const response = await axios.get('/questionnaire')
  questions.value = response.data

  // Raggruppa per titolo
  groupedQuestions.value = questions.value.reduce((acc, q) => {
    if (!acc[q.title]) acc[q.title] = []
    acc[q.title].push(q)
    return acc
  }, {})
})


const submitAnswers = async () => {
  // Verifica se ci sono domande non risposte
  const unanswered = questions.value.filter(q => answers.value[q.id] === undefined)

  if (unanswered.length > 0) {
    alert('Per favore rispondi a tutte le domande prima di continuare.')
    return
  }

  try {
    const response = await axios.post('/questionnaire/submit', answers.value)

    // Se non è bloccato, salviamo in localStorage che ha cambiato periodo
    if (response.data && response.data.blocked === false) {
      localStorage.setItem('justAdvanced', 'true')
    }

    if (response.data && response.data.noMorePeriod === true) {
      localStorage.setItem('justFinished', 'true')
    }

    router.push('/home')
  } catch (error) {
    alert('Errore durante l’invio delle risposte.')
  }
}

</script>

<style lang="scss" scoped>
@use "@/assets/scss/questionnaire" as *;
</style>
