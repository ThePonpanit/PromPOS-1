<template>
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
    <footer>
      <p>Footer</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
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
  background-color: hsla(160, 100%, 37%, 0.1);
  padding: 5px;
  text-align: center;
}

/* Main Content */
main {
  flex: 1; /* Take up available space */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

/* Sticky Footer */
footer {
  flex-shrink: 0;
  background-color: hsla(160, 100%, 37%, 0.1);
  text-align: center;
  padding: 10px;
}

footer p {
  margin: 0;
  font-size: 0.9rem;
  color: hsla(160, 100%, 37%, 1);
}
</style>
