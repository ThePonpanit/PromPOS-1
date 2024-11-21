<template>
  <div id="app">
    <!-- Sticky Header -->
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/about">About</RouterLink> |
        <RouterLink to="/firestore-health-check">Health Check</RouterLink>
        <ThemeSwitcher />
      </nav>
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
import { RouterLink, RouterView } from "vue-router";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
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
  padding: 10px;
  text-align: center;
}

header nav a {
  margin: 0 10px;
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
  transition: color 0.3s;
}

header nav a:hover {
  color: hsla(160, 100%, 47%, 1);
}

/* Main Content */
main {
  flex: 1; /* Take up available space */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 95vh; /* Full viewport height */
  width: 96vw; /* Full viewport width */
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
