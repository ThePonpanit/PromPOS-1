// src/composables/useMenuStore.js
import { ref, computed } from "vue";
import defaultImage from "@/assets/default-image.jpg";

// Define menu items
const menuItems = ref([
  { id: 1, name: "Item 1", price: 10, image: defaultImage },
  { id: 2, name: "Item 2", price: 15, image: defaultImage },
  { id: 3, name: "Item 3", price: 20, image: defaultImage },
  { id: 4, name: "Item 4", price: 25, image: defaultImage },
  { id: 5, name: "Item 5", price: 30, image: defaultImage },
  { id: 6, name: "Item 6", price: 35, image: defaultImage },
  { id: 7, name: "Item 7", price: 40, image: defaultImage },
  { id: 8, name: "Item 8", price: 45, image: defaultImage },
  { id: 9, name: "Item 9", price: 50, image: defaultImage },
  { id: 10, name: "Item 10", price: 55, image: defaultImage },
  { id: 11, name: "Item 11", price: 60, image: defaultImage },
  { id: 12, name: "Item 12", price: 65, image: defaultImage },
  { id: 13, name: "Item 13", price: 70, image: defaultImage },
  { id: 14, name: "Item 14", price: 75, image: defaultImage },
  { id: 15, name: "Item 15", price: 80, image: defaultImage },

  // ... add more items as needed
]);

// Define selected items with quantities
const selectedItems = ref([]);

// Function to add an item to the selected items
function addItem(item) {
  const existingItem = selectedItems.value.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    selectedItems.value.push({ ...item, quantity: 1 });
  }
}

// Function to decrease quantity or remove an item
function removeItem(itemId) {
  const existingItem = selectedItems.value.find((i) => i.id === itemId);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      selectedItems.value = selectedItems.value.filter(
        (item) => item.id !== itemId
      );
    }
  }
}

// Function to remove an item completely
function removeItemCompletely(itemId) {
  selectedItems.value = selectedItems.value.filter(
    (item) => item.id !== itemId
  );
}

// Computed property for total price per item
const selectedItemsWithTotal = computed(() =>
  selectedItems.value.map((item) => ({
    ...item,
    totalPrice: item.price * item.quantity,
  }))
);

// Computed property for total amount
const total = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Computed property for total items (sum of quantities)
const totalItems = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

// Remove all items
function removeAllItems() {
  selectedItems.value = [];
}

export function useMenuStore() {
  return {
    menuItems,
    selectedItems,
    selectedItemsWithTotal,
    addItem,
    removeItem,
    removeItemCompletely,
    total,
    totalItems,
    removeAllItems,
  };
}
