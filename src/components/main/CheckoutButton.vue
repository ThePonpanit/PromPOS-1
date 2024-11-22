<template>
  <Button @click="checkout" rounded>
    <span class="material-icons"> shopping_cart_checkout</span>
    <span>Checkout</span>
  </Button>
</template>

<script setup>
import { useMenuStore } from "./composables/useMenuStore.js";

const { selectedItems } = useMenuStore();

function checkout() {
  console.log("Checkout with items:", selectedItems);
  // Add your checkout logic here
}
</script>

<style scoped>
button {
  width: 100%;
  margin-top: 0.5rem;
}

button:active {
  scale: 1 !important;
  transition: all 0.1s ease;
}
</style>
