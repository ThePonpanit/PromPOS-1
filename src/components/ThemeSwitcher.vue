<!-- ThemeSwitcher.vue -->
<template>
  <Button
    :icon="themeIcon"
    class="p-button-rounded p-button-text theme-switcher-button"
    @click="toggleTheme"
    :aria-label="themeLabel"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const isDarkTheme = ref(false);

const themeIcon = computed(() => {
  return isDarkTheme.value ? "pi pi-moon" : "pi pi-sun";
});

const themeLabel = computed(() => {
  return isDarkTheme.value ? "Switch to Light Theme" : "Switch to Dark Theme";
});

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const theme = isDarkTheme.value ? "dark" : "light";
  applyTheme(theme);
  localStorage.setItem("theme", theme);
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  isDarkTheme.value = savedTheme === "dark";
  applyTheme(savedTheme);
});
</script>

<style scoped>
.theme-switcher-button {
  color: var(--theme-switch-button-color);
}
</style>
