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
  runTransaction,
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
      { id: 16, name: "Item 16", price: 85, image: defaultImage },
      { id: 17, name: "Item 17", price: 90, image: defaultImage },
      { id: 18, name: "Item 18", price: 95.25, image: defaultImage },
      { id: 19, name: "Item 19", price: 100.5, image: defaultImage },
      { id: 20, name: "Item 20", price: 105.75, image: defaultImage },
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
    async function checkout(paymentDetails) {
      if (selectedItems.value.length === 0) return;

      const isOnline = navigator.onLine;

      // Define your shop ID
      const shopId = "shop123"; // Replace with your unique shop ID
      const shopName = "Your Shop Name"; // Replace with your shop name

      // Get current date in YYYY-MM-DD format
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`; // 'YYYY-MM-DD'

      // Generate a localID
      const localID = `${shopId}-${Date.now()}`;

      let orderId = "n/a"; // Initialize orderId

      if (isOnline) {
        // Proceed to generate orderId using Firestore transaction
        const shopDocRef = doc(db, "orders", shopId);
        let invoiceNumber = 0;

        try {
          await runTransaction(db, async (transaction) => {
            const shopDoc = await transaction.get(shopDocRef);
            if (!shopDoc.exists()) {
              invoiceNumber = 1;
              transaction.set(shopDocRef, {
                shopId: shopId,
                shopName: shopName,
                createdAt: new Date().toLocaleString("en-US", {
                  timeZone: "Asia/Bangkok",
                }),
                invoiceNumber: invoiceNumber,
              });
            } else {
              const shopData = shopDoc.data();
              invoiceNumber = shopData.invoiceNumber || 0;
              invoiceNumber += 1;
              transaction.update(shopDocRef, {
                invoiceNumber: invoiceNumber,
              });
            }
          });

          // Generate the orderId
          const yearString = String(new Date().getFullYear()).slice(-2); // e.g., '24'
          const invoiceNumberString = String(invoiceNumber).padStart(6, "0"); // e.g., '000001'
          orderId = `${shopId}-${yearString}${invoiceNumberString}`;
        } catch (e) {
          console.error("Transaction failed: ", e);
          // If transaction fails, set orderId to 'n/a' and handle it in syncOrders
          orderId = "n/a";
        }
      } else {
        // Offline: set orderId to 'n/a'
        orderId = "n/a";
      }

      const order = {
        id: orderId, // 'n/a' if offline
        localID: localID, // Unique local ID
        total: total.value,
        sendStatus: "pending",
        timestampUTC7: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
        timestamp: new Date().toISOString(),
        items: selectedItems.value.map((item) => ({ ...item })), // Deep copy items
        orderStatus: "success",
        paymentDetails: paymentDetails, // Add payment details here
      };

      orders.value.push(order);
      selectedItems.value = []; // Clear cart after checkout

      if (isOnline && orderId !== "n/a") {
        // Attempt to send order to Firestore immediately
        try {
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
            collection(
              db,
              "orders",
              shopId,
              "shopOrders",
              dateString,
              "orders"
            ),
            order.id
          );

          // Send order to Firestore with specified document ID
          await setDoc(orderRef, {
            ...order,
            sendStatus: "sent", // Update status to sent
          });

          // Update order status in the store
          updateOrderSendStatus(order.id, "sent");
          console.log(`Order ${order.id} sent successfully.`);
        } catch (error) {
          console.error("Error sending order:", error);
          // Order will be synced later
        }
      } else {
        console.log("Offline mode: Order saved locally with localID:", localID);
      }
    }

    // Update order status and ensure DataTable reflects changes
    function updateOrderSendStatus(orderId, newStatus) {
      const index = orders.value.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        // Replace the object with a new one to trigger reactivity
        orders.value[index] = { ...orders.value[index], sendStatus: newStatus };

        // Replace the entire array to ensure Vue detects the update
        orders.value = [...orders.value];

        // Persist the updated orders back to localStorage
        localStorage.setItem(
          "menuStore",
          JSON.stringify({ orders: orders.value })
        );
      }
    }

    // Update order status in Firestore
    async function updateOrderStatusInFirestore(orderId, newOrderStatus) {
      // Find the order in the local store
      const index = orders.value.findIndex((o) => o.id === orderId);
      if (index === -1) {
        console.error(`Order ${orderId} not found in local store.`);
        return;
      }

      // Update the order status locally
      orders.value[index] = {
        ...orders.value[index],
        orderStatus: newOrderStatus,
      };
      orders.value = [...orders.value]; // Ensure reactivity

      // Persist the updated orders back to localStorage
      localStorage.setItem(
        "menuStore",
        JSON.stringify({ orders: orders.value })
      );

      // Extract the dateString from the order's timestamp
      const orderDate = new Date(orders.value[index].timestamp);
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, "0");
      const day = String(orderDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`; // 'YYYY-MM-DD'

      // Define your shop ID
      const shopId = "shop123"; // Replace with your unique shop ID

      try {
        // Create a reference to the order document in Firestore
        const orderRef = doc(
          db,
          "orders",
          shopId,
          "shopOrders",
          dateString,
          "orders",
          orderId
        );

        // Update the orderStatus in Firestore
        await updateDoc(orderRef, {
          orderStatus: newOrderStatus,
        });

        console.log(
          `Order ${orderId} status updated to '${newOrderStatus}' in Firestore.`
        );
      } catch (error) {
        console.error(`Error updating order ${orderId} in Firestore:`, error);
      }
    }

    // Add the updateOrderId function
    function updateOrderId(localID, newOrderId) {
      const index = orders.value.findIndex((o) => o.localID === localID);
      if (index !== -1) {
        orders.value[index] = {
          ...orders.value[index],
          id: newOrderId,
        };
        orders.value = [...orders.value]; // Ensure reactivity

        // Persist the updated orders back to localStorage
        localStorage.setItem(
          "menuStore",
          JSON.stringify({ orders: orders.value })
        );
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
      updateOrderSendStatus,
      updateOrderStatusInFirestore,
      updateOrderId,

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
