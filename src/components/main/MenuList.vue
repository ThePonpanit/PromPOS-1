<template>
  <div class="menu-list">
    <h2>Menu</h2>
    <div class="menu-items">
      <Card
        v-for="item in menuStore.menuItems"
        :key="item.id"
        class="menu-card clickable-card"
        @click="selectItem(item)"
      >
        <template #header>
          <img :src="item.image" :alt="item.name" class="menu-item-image" />
        </template>
        <template #title>{{ item.name }}</template>
        <template #subtitle> ฿ {{ formatPrice(item.price) }}</template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { useMenuStore } from "@/stores/useMenuStore";

const menuStore = useMenuStore();

function selectItem(item) {
  menuStore.addItem(item);
}

// Helper function to format price to 2 decimal places
function formatPrice(price) {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
</script>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-list h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem; /* Base font size */
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.clickable-card {
  cursor: pointer;
  border: 2px solid var(--card-border-color);
  padding: 0.35rem;
  border-radius: 8px;
}

.clickable-card:hover {
  box-shadow: 0 0 10px var(--shadow-color);
  border-color: var(--secondary-color-green);
}

.clickable-card:active {
  box-shadow: 0 0 5px var(--shadow-color);
  transform: scale(0.95);
  transition: all 0.1s ease-out;
}

.menu-item-image {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0;
}

/* Typography */
.card-title {
  font-size: 1.25rem; /* 20px */
  margin: 0.5rem 0 0.25rem 0;
}

.card-subtitle {
  font-size: 1rem; /* 16px */
  color: var(--primary-color);
}

/* Responsive Adjustments */
@media screen and (max-width: 1180px) {
  .menu-card {
    width: 30%; /* Adjust card width to 45% for two cards per row */
    max-width: 230px; /* Optional: Set a maximum width */
  }

  .menu-list h2 {
    font-size: 1.25rem; /* 20px */
  }

  .card-title {
    font-size: 1rem; /* 17.6px */
  }

  .card-subtitle {
    font-size: 0.8rem; /* 14.4px */
  }

  .clickable-card {
    padding: 0.2rem;
  }
}

@media screen and (max-width: 768px) {
  .menu-card {
    width: 50%; /* Single column layout on very small screens */
    max-width: 100%;
  }

  .menu-list h2 {
    font-size: 1.1rem; /* 17.6px */
  }

  .card-title {
    font-size: 1rem; /* 16px */
  }

  .card-subtitle {
    font-size: 0.85rem; /* 13.6px */
  }

  .clickable-card {
    padding: 0.3rem;
  }
}
</style>
