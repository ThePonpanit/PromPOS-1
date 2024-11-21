<template>
  <nav>
    <Menubar :model="menuItems" end>
      <template #end>
        <!-- Add the ThemeSwitcher in the right end of the Menubar -->
        <ThemeSwitcher />
      </template>
    </Menubar>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar"; // Import PrimeVue Menubar
import ThemeSwitcher from "./ThemeSwitcher.vue"; // Import ThemeSwitcher

// Define menu items for the Menubar
const menuItems = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      // Navigate to home
      window.location.href = "/";
    },
  },
  {
    label: "About",
    icon: "pi pi-info-circle",
    command: () => {
      // Navigate to about
      window.location.href = "/about";
    },
  },
  {
    label: "Health Check",
    icon: "pi pi-heart",
    command: () => {
      // Navigate to Health Check
      window.location.href = "/firestore-health-check";
    },
  },
]);
</script>

<style scoped>
nav {
  margin-bottom: 1rem;
}

/* Styling for Menubar */
.p-menubar {
  background-color: hsla(160, 100%, 37%, 0.1);
  border-radius: 5px;
}

.p-menubar .p-menuitem-link {
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
  transition: color 0.3s;
}

.p-menubar .p-menuitem-link:hover {
  color: hsla(160, 100%, 47%, 1);
}
</style>
