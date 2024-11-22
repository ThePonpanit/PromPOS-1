<template>
  <div class="layout">
    <!-- Menu Section -->
    <div class="menu-list">
      <MenuList />
      <Divider layout="vertical" />
    </div>
    <!-- Summary Section -->
    <div class="summary">
      <Summary />
      <CheckoutButton />
    </div>
  </div>
</template>

<script setup>
import MenuList from "./MenuList.vue";
import Summary from "./Summary.vue";
import CheckoutButton from "./CheckoutButton.vue";
</script>

<style scoped>
/* Parent container layout */
.layout {
  display: flex;
  height: 85vh; /* Full viewport height */
  overflow: hidden; /* Prevent scroll if content overflows */
  border-radius: 15px;

  /* add border */
  border: 1px solid var(--border-color);
  min-width: 95vw;
}

/* Menu section (70% width) */
.menu-list {
  display: flex;
  flex: 6;
  background-color: var(--surface-light-0); /* Optional: background color */
  padding: 20px;
  overflow-y: auto; /* Scrollable if content exceeds */
}

/* Summary section (30% width) */
.summary {
  flex: 4;
  background-color: var(--surface-light-0); /* Optional: background color */
  padding: 20px;
  overflow-y: auto; /* Scrollable if content exceeds */
  margin-left: -2vw;
  min-width: 250px;
  text-wrap: none;
}
</style>
