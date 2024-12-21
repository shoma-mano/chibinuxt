<script lang="ts" setup>
import { RouterView, RouterLink } from "vue-router";
</script>
<template>
  <div>
    <RouterView></RouterView>
    <RouterLink to="/hello">Go to Hello</RouterLink>
    <RouterLink to="/world">Go to World</RouterLink>
  </div>
</template>
