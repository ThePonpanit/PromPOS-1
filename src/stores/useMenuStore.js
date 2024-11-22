// src/stores/useMenuStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import defaultImage from "@/assets/default-image.jpg";
// Import Firebase Firestore
import { db } from "@/firebase/init.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

export const useMenuStore = defineStore(
  "menuStore",
  () => {
    // **State**

    // Menu items
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

    // Selected items with quantities
    const selectedItems = ref([]);

    // Orders with status
    const orders = ref([]);

    // **Actions**

    // Add item to selected items
    function addItem(item) {
      const existingItem = selectedItems.value.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        selectedItems.value.push({ ...item, quantity: 1 });
      }
    }

    // Remove item or decrease quantity
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

    // Remove item completely
    function removeItemCompletely(itemId) {
      selectedItems.value = selectedItems.value.filter(
        (item) => item.id !== itemId
      );
    }

    // Remove all items from cart
    function removeAllItems() {
      selectedItems.value = [];
    }

    // **Checkout action**
    async function checkout() {
      if (selectedItems.value.length === 0) return;

      // **Define your shop ID**
      const shopId = "shop123"; // Replace with your unique shop ID
      const shopName = "Your Shop Name"; // Replace with your shop name

      // **Get current date in YYYY-MM-DD format**
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`; // 'YYYY-MM-DD'

      // Generate unique order ID
      const generateOrderId = () => `order-${Date.now()}`;
      const orderId = generateOrderId();

      const order = {
        id: orderId,
        total: total.value,
        status: "pending", // Initially pending
        timestampUTC7: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
        timestamp: new Date().toISOString(),
        items: selectedItems.value.map((item) => ({ ...item })), // Deep copy items
      };

      orders.value.push(order);
      selectedItems.value = []; // Clear cart after checkout

      // Attempt to send order to Firestore immediately
      try {
        // **Create a reference to the shop document**
        const shopDocRef = doc(db, "orders", shopId);

        // **Ensure the shop document exists**
        const shopDocSnap = await getDoc(shopDocRef);
        if (!shopDocSnap.exists()) {
          // If the shop document doesn't exist, create it with general data
          await setDoc(shopDocRef, {
            shopId: shopId,
            shopName: shopName, // Add other general shop data here
            createdAt: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Bangkok",
            }),
          });
        }

        // **Create a reference to the date document under shopOrders**
        const dateDocRef = doc(
          collection(db, "orders", shopId, "shopOrders"),
          dateString
        );

        // **Ensure the date document exists**
        const dateDocSnap = await getDoc(dateDocRef);
        if (!dateDocSnap.exists()) {
          // If the date document doesn't exist, create it
          await setDoc(dateDocRef, {
            date: dateString,
            createdAt: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Bangkok",
            }),
            totalOrder: 0,
            grandTotal: 0,
            lastUpdate: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Bangkok",
            }),
          });
        }

        // **Update the date document with totalOrder, grandTotal, lastUpdate**
        await updateDoc(dateDocRef, {
          totalOrder: increment(1),
          grandTotal: increment(order.total),
          lastUpdate: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Bangkok",
          }),
        });

        // **Create a reference to the order document under the date document**
        const orderRef = doc(
          collection(db, "orders", shopId, "shopOrders", dateString, "orders"),
          order.id
        );

        // Send order to Firestore with specified document ID
        await setDoc(orderRef, {
          ...order,
          status: "sent", // Update status to sent
        });

        // Update order status in the store
        updateOrderStatus(order.id, "sent");
        console.log(`Order ${order.id} sent successfully.`);
      } catch (error) {
        console.error("Error sending order:", error);
        // Order status remains 'pending', so the interval sync can retry
      }
    }

    // Update order status
    function updateOrderStatus(orderId, status) {
      const order = orders.value.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
      }
    }

    // **Computed Properties**

    // Selected items with total price per item
    const selectedItemsWithTotal = computed(() =>
      selectedItems.value.map((item) => ({
        ...item,
        totalPrice: item.price * item.quantity,
      }))
    );

    // Total amount
    const total = computed(() =>
      selectedItems.value.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    );

    // Total items (sum of quantities)
    const totalItems = computed(() =>
      selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    // **Return State and Actions**

    return {
      // State
      menuItems,
      selectedItems,
      orders,

      // Actions
      addItem,
      removeItem,
      removeItemCompletely,
      removeAllItems,
      checkout,
      updateOrderStatus,

      // Computed
      selectedItemsWithTotal,
      total,
      totalItems,
    };
  },
  {
    // **Persistence Configuration**
    persist: {
      key: "menuStore", // Key used in local storage
      storage: window.localStorage, // Storage type
      paths: ["selectedItems", "orders"], // State properties to persist
    },
  }
);
