<template>
  <Button @click="checkout" rounded :disabled="totalItems === 0">
    <span class="material-icons"> shopping_cart_checkout</span>
    <span>Checkout</span>
  </Button>
</template>

<script setup>
import { useMenuStore } from "./composables/useMenuStore.js";

const { selectedItems, totalItems } = useMenuStore();

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

button:disabled {
  background-color: var(--disabled-color);
  color: var(--disabled-text-color);
}
</style>
