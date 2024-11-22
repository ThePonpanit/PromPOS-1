<template>
  <Button
    @click="menuStore.checkout"
    rounded
    :disabled="menuStore.totalItems === 0"
  >
    <span class="material-icons">shopping_cart_checkout</span>
    <span>Checkout</span>
  </Button>
</template>

<script setup>
import { useMenuStore } from "@/stores/useMenuStore";

const menuStore = useMenuStore();
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
