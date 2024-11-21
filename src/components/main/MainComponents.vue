<template>
  <div class="layout">
    <!-- Menu Section -->
    <div class="menu-list">
      <MenuList />
    </div>

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
}

/* Menu section (70% width) */
.menu-list {
  flex: 7.5; /* 70% of the width */
  background-color: hsla(160, 100%, 37%, 0.1); /* Optional: background color */
  padding: 20px;
  overflow-y: auto; /* Scrollable if content exceeds */
}

/* Summary section (30% width) */
.summary {
  flex: 2.5; /* 30% of the width */
  background-color: white; /* Optional: background color */
  padding: 20px;
  overflow-y: auto; /* Scrollable if content exceeds */
}
</style>
