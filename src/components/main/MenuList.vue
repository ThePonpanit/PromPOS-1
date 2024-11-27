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
          <div class="image-container">
            <img
              :src="item.image"
              :alt="item.name"
              class="menu-item-image"
              loading="lazy"
            />
            <!-- Badge Display -->
            <span
              v-if="menuStore.clickCountsMap.get(item.id) > 0"
              class="badge"
              :aria-label="`${formatClickCount(
                menuStore.clickCountsMap.get(item.id)
              )} clicks`"
            >
              {{ formatClickCount(menuStore.clickCountsMap.get(item.id)) }}
            </span>
          </div>
        </template>
        <template #title>
          <div class="card-title">{{ item.name }}</div>
        </template>
        <template #subtitle>
          <div class="card-subtitle">฿ {{ formatPrice(item.price) }}</div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { useMenuStore } from "@/stores/useMenuStore";
const menuStore = useMenuStore();

/**
 * Handles the selection of a menu item.
 *
 * @param {Object} item - The menu item that was clicked.
 */
function selectItem(item) {
  menuStore.addItem(item);
}

/**
 * Formats the price to include commas and two decimal places.
 *
 * @param {number} price - The price to format.
 * @returns {string} - The formatted price.
 */
function formatPrice(price) {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Formats the click count to display "99+" if it exceeds 99.
 *
 * @param {number} count - The click count.
 * @returns {string} - The formatted click count.
 */
function formatClickCount(count) {
  return count > 99 ? "99+" : count;
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
  position: relative; /* To position badge absolutely within the card */
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

.image-container {
  position: relative; /* To position badge absolutely within the container */
}

.menu-item-image {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0;
  display: block;
}

/* Badge Styling */
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: var(--secondary-color-green);
  color: #fff;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
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
    width: 30%; /* Adjust card width for multiple cards per row */
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

  .badge {
    font-size: 0.7rem; /* Slightly smaller font on smaller screens */
    padding: 0.2rem 0.4rem;
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
