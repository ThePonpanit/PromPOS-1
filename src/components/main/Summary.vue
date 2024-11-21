<template>
  <div class="summary">
    <h2>Summary</h2>
    <ul>
      <li v-for="item in selectedItems" :key="item.id">
        {{ item.name }} - ${{ item.price }}
      </li>
    </ul>
    <p>Total: ${{ total }}</p>
    <button @click="checkout">Checkout</button>
  </div>
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
.summary {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  color: black;
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

.summary button {
  padding: 10px 15px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.summary button:hover {
  background-color: hsla(160, 100%, 47%, 1);
}
</style>
