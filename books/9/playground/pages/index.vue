<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>
<template>
  <div>Hello world</div>
  <button @click="count++">count++</button>
  <p>count: {{ count }}</p>
</template>
