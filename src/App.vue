<template>
  <OrderSync />
  <div id="app">
    <!-- Sticky Header -->
    <header>
      <Navbar />
    </header>

    <!-- Main Content Area -->
    <main>
      <RouterView />
    </main>

    <!-- Sticky Footer -->
    <div class="footer-component">
      <footer>
        <FooterComponent />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import FooterComponent from "./components/FooterComponent.vue";
import OrderSync from "./components/OrderSync.vue";
</script>

<style scoped>
/* App Layout */
#app {
  display: flex;
  flex-direction: column;
}

/* Sticky Header */
header {
  flex-shrink: 0;
  margin-top: 1vh;
  margin-bottom: 1vh;
  text-align: center;
}

/* Main Content */
main {
  flex: 1; /* Take up available space */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Sticky Footer */
footer {
  flex-shrink: 0;
  text-align: center;
  margin-top: 1vh;
  margin-bottom: 0.5vh;
  padding: 10px;
  width: 100%;

  background-color: var(--surface-light-0);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.footer-component {
  display: flex;
  justify-content: center;
}
</style>
