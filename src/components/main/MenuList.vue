<template>
  <div class="menu-list">
    <h2>Menu</h2>
    <ul>
      <li v-for="item in menuItems" :key="item.id">
        <button @click="selectItem(item)">
          {{ item.name }} - ${{ item.price }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const menuItems = [
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 15 },
  { id: 3, name: "Item 3", price: 20 },
];

function selectItem(item) {
  console.log("Selected item:", item);
}
</script>

<style scoped>
.menu-list {
  background-color: hsla(160, 100%, 37%, 0.1);
  padding: 20px;
  border-radius: 8px;
  height: 100%;
}

.menu-list h2 {
  margin-bottom: 10px;
}

.menu-list ul {
  list-style: none;
  padding: 0;
}

.menu-list li {
  margin-bottom: 10px;
}

.menu-list button {
  padding: 10px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.menu-list button:hover {
  background-color: hsla(160, 100%, 47%, 1);
}
</style>
