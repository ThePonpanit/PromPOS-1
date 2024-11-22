<template>
  <nav>
    <Menubar :model="menuItems" end class="main-navbar">
      <template #end>
        <!-- Add the ThemeSwitcher in the right end of the Menubar -->
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
          "
        >
          <OrderSync />
          <ThemeSwitcher />
        </div>
      </template>
    </Menubar>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar"; // Import PrimeVue Menubar
import ThemeSwitcher from "./ThemeSwitcher.vue"; // Import ThemeSwitcher
import OrderSync from "./OrderSync.vue";

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
.main-navbar {
  border-radius: 15px;
}
</style>
