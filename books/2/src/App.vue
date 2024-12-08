<script lang="ts" setup>
import { ref } from "vue";
const count = ref(0);
</script>
<template>
  <p>Hello,World</p>
  <button
    @click="
      () => {
        console.log('click');
      }
    "
  >
    count++
  </button>
  <p>count: {{ count }}</p>
</template>
