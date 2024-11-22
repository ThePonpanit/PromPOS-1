<template>
  <div class="menu-list">
    <h2>Menu</h2>
    <div class="menu-items">
      <Card
        v-for="item in menuItems"
        :key="item.id"
        class="menu-card clickable-card"
        @click="selectItem(item)"
      >
        <template #header>
          <img :src="item.image" :alt="item.name" class="menu-item-image" />
        </template>
        <template #title>{{ item.name }}</template>
        <template #subtitle>฿ {{ item.price }}</template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import defaultImage from "@/assets/default-image.jpg";

const menuItems = ref([
  {
    id: 1,
    name: "Item 1",
    price: 10,
    image: defaultImage,
  },
  {
    id: 2,
    name: "Item 2",
    price: 15,
    image: defaultImage,
  },
  {
    id: 3,
    name: "Item 3",
    price: 20,
    image: defaultImage,
  },
  {
    id: 4,
    name: "Item 4",
    price: 25,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
  {
    id: 5,
    name: "Item 5",
    price: 30,
    image: defaultImage,
  },
]);

function selectItem(item) {
  console.log("Selected item:", item);
  // Add any additional logic needed when an item is selected
}
</script>

<style scoped>
.menu-list {
  flex-direction: column;
}

.menu-list h2 {
  margin-bottom: 10px;
}

.menu-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.menu-card {
  width: 200px;
  background-color: var(--surface-0);
  color: var(--text-color);
}

.clickable-card {
  cursor: pointer;
  border: 2px solid var(--card-border-color);
  padding: 1px;
}

.clickable-card:hover {
  box-shadow: 0 0 10px var(--shadow-color);
  border-color: #00ff9c;
}

.clickable-card:active {
  box-shadow: 0 0 5px var(--shadow-color);
  scale: 0.95;
  transition: all 0.1s ease-out;
}

.menu-item-image {
  width: 100%;
  height: auto;
}

img {
  border-radius: 8px 8px 0 0;
}
</style>
