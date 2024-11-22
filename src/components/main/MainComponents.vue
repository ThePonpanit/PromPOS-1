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

  /* View port for the Main */
  height: 82vh;
  width: 100%;
  overflow: hidden; /* Prevent scroll if content overflows */

  /* add border */
  border: 1px solid var(--border-color);
  border-radius: 15px;
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
}
</style>
