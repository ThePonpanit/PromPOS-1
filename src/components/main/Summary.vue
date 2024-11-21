<template>
  <Card class="summary-card">
    <template #header>
      <h1>Summary</h1>
    </template>
    <template #content>
      <ul>
        <li v-for="item in selectedItems" :key="item.id">
          {{ item.name }} - ${{ item.price }}
        </li>
      </ul>
      <p>Total: ${{ total }}</p>
    </template>
    <template #footer>
      <Button @click="checkout">Checkout</Button>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedItems = ref([
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 15 },
]);

const total = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price, 0)
);

function checkout() {
  console.log("Checkout with items:", selectedItems.value);
}
</script>

<style scoped>
.summary-card {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background-color: var(--surface-0);
  padding-left: 10px;
}

.summary {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background-color: var(--surface-0);
}

.summary h2 {
  margin-bottom: 10px;
}

.summary ul {
  list-style: none;
  padding: 0;
}

.summary li {
  margin-bottom: 5px;
}

.summary p {
  font-weight: bold;
  margin: 10px 0;
}

/* add styles for the template #header */
.summary-card h1 {
  text-align: center;
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 1vh;
}
</style>
