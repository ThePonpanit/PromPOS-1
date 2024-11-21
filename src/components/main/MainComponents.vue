<template>
  <div class="layout">
    <!-- Menu Section -->
    <div class="menu-list">
      <MenuList />
      <Divider layout="vertical" />
    </div>
    <div></div>
    <!-- Summary Section -->
    <div class="summary">
      <Summary />
    </div>
  </div>
</template>

<script setup>
import MenuList from "./MenuList.vue";
import Summary from "./Summary.vue";
</script>

<style scoped>
/* Parent container layout */
.layout {
  display: flex;
  height: 80vh; /* Full viewport height */
  width: 97vw; /* Full viewport width */
  overflow: hidden; /* Prevent scroll if content overflows */
  border-radius: 15px;
}

/* Menu section (70% width) */
.menu-list {
  display: flex;
  flex: 7.5;
  background-color: var(--surface-0); /* Optional: background color */
  padding: 20px;
  overflow-y: auto; /* Scrollable if content exceeds */
}

/* Summary section (30% width) */
.summary {
  flex: 2.5;
  background-color: var(--surface-0); /* Optional: background color */
  padding: 20px;
  overflow-y: auto; /* Scrollable if content exceeds */
  margin-left: -2vw;
}
</style>
