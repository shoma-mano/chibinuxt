<script lang="ts" setup>
import { RouterView, RouterLink } from "vue-router";
</script>
<template>
  <main>
    <RouterView></RouterView>
    <RouterLink to="/hello">Go to Hello</RouterLink>
    <RouterLink to="/world">Go to World</RouterLink>
  </main>
</template>
