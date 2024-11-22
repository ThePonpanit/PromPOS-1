<template>
  <!-- show color dot status for the is online -->
  <div class="network-status">
    <p v-if="isOnline" style="color: green">
      <span class="material-icons dot">wifi</span>
      Online
    </p>
    <p v-else style="color: red">
      <span class="material-icons dot">wifi_off</span>
      Offline
    </p>
  </div>
</template>

<style scoped>
.dot {
  border-radius: 50%;
  display: inline-block;
}

.network-status {
  border: 1px solid var(--border-color);
  /* Set border color to the net work Status */

  padding: 5px;
  border-radius: 10px;
}

.network-status p {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>

<script setup>
import { useMenuStore } from "@/stores/useMenuStore";
import { onMounted, onUnmounted } from "vue";
import { db } from "@/firebase/init.js";
import { collection, addDoc } from "firebase/firestore";

const menuStore = useMenuStore();

let syncInterval;

// Check if the browser is online
function isOnline() {
  return navigator.onLine;
}

// Sync pending orders with Firestore
async function syncOrders() {
  if (!isOnline()) {
    console.log("No internet connection. Will retry when online.");
    return;
  }

  const pendingOrders = menuStore.orders.filter(
    (order) => order.status === "pending"
  );

  for (const order of pendingOrders) {
    try {
      // Send order to Firestore
      await addDoc(collection(db, "orders"), {
        ...order,
        status: "sent",
      });
      // Update order status in the store
      menuStore.updateOrderStatus(order.id, "sent");
    } catch (error) {
      console.error("Error sending order:", error);
      // Optionally update status to 'failed'
      menuStore.updateOrderStatus(order.id, "failed");
    }
  }
}

onMounted(() => {
  // Start the interval to sync orders every 30 seconds
  syncInterval = setInterval(syncOrders, 30000); // 30,000 ms = 30 seconds
  // Also call it immediately on mount
  syncOrders();
});

onUnmounted(() => {
  clearInterval(syncInterval);
});
</script>
