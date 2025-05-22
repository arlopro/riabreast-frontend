<template>
  <div class="logged-container-dark faq-container">
    <div class="header">
      <h2 class="title">Domande frequenti</h2>
      <p class="subtitle">Trova risposta ai tuoi quesiti</p>
    </div>

    <div class="content">
      <div class="faq-list">
        <div
          class="faq-item"
          v-for="(faq, index) in faqs"
          :key="index"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <i class="bx"
               :class="expandedIndex === index ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
          </div>
          <div v-if="expandedIndex === index" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const faqs = ref([]);
const expandedIndex = ref(null);

const toggleFaq = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

onMounted(async () => {
  const response = await axios.get('/faqs');
  faqs.value = response.data;
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/faq" as *;
</style>
