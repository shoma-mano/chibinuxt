<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)
const onClick = () => {
  count.value++
}
</script>

<template>
  <p>Hello,World</p>
  <button @click="onClick">
    count++
  </button>
  <p>count: {{ count }}</p>
</template>
