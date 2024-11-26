<template>
  <nav>
    <Menubar :model="menuItems" class="main-navbar">
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
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Menubar from "primevue/menubar";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import OrderSync from "./OrderSync.vue";

const router = useRouter();
const currentRoute = useRoute();

// Define menu items for the Menubar
const menuItems = computed(() => [
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      if (currentRoute.path !== "/") {
        router.push("/");
      }
    },
    class: currentRoute.path === "/" ? "nav-active-menu" : "",
  },

  {
    label: "Orders",
    icon: "pi pi-shopping-cart",
    command: () => {
      if (currentRoute.path !== "/orders") {
        router.push("/orders");
      }
    },
    class: currentRoute.path === "/orders" ? "nav-active-menu" : "",
  },
  {
    label: "Summary",
    icon: "pi pi-list",
    command: () => {
      if (currentRoute.path !== "/summary") {
        router.push("/summary");
      }
    },
    class: currentRoute.path === "/summary" ? "nav-active-menu" : "",
  },
  {
    label: "Health Check",
    icon: "pi pi-heart",
    command: () => {
      if (currentRoute.path !== "/firestore-health-check") {
        router.push("/firestore-health-check");
      }
    },
    class:
      currentRoute.path === "/firestore-health-check" ? "nav-active-menu" : "",
  },
]);
</script>

<style>
.main-navbar {
  border-radius: 15px;
}

.nav-active-menu {
  font-weight: bold; /* Optional: Make the active item bold */
  pointer-events: none; /* Prevent clicking the active menu */
  cursor: default; /* Indicate it's not clickable */
  background-color: var(
    --nav-selected-bg-color
  ); /* Highlight the active menu */
  border-radius: 10px; /* Optional: Round the corners */
  border: 2px solid var(--nav-selected-color); /* Optional: Add a border */
}
</style>
