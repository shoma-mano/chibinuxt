<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <router-view />
    <router-link to="/hello">
      Go to Hello
    </router-link>
    <router-link to="/world">
      Go to World
    </router-link>
  </main>
</template>
