<template>
  <div class="main-div">
    <OrdersMain />
  </div>
</template>
<script setup>
import OrdersMain from "@/components/orders/OrdersMain.vue";
</script>

<style scoped>
.main-div {
  width: 100%;
  /* View port for the Main */
  height: 82vh;

  width: 100%;
  overflow: hidden; /* Prevent scroll if content overflows */

  /* add border */
  border: 1px solid var(--border-color);
  border-radius: 15px;
}
</style>
