<template>
  <p>Version {{ appVersion }}</p>
</template>

<script setup>
import { ref } from "vue";

// Access the version from the environment
const appVersion = ref(import.meta.env.VITE_APP_VERSION);

console.log("App Version:", appVersion.value); // Debugging output
</script>
