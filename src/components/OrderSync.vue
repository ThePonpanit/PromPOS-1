<template>
  <!-- Dynamically set the border color based on network status -->
  <div :class="['network-status', { online: isOnline, offline: !isOnline }]">
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
  padding: 5px;
  border-radius: 10px;
  border: 2px solid var(--border-color); /* Default border color */
}

/* Add conditional styles for online and offline states */
.network-status.online {
  border-color: green;
}

.network-status.offline {
  border-color: red;
}

.network-status p {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";
import { db } from "@/firebase/init.js";
import { collection, addDoc } from "firebase/firestore";

const menuStore = useMenuStore();
const isOnline = ref(navigator.onLine); // Reactive network status
let syncInterval;

// Listen for network status changes
function updateNetworkStatus() {
  isOnline.value = navigator.onLine;
}

// Sync pending orders with Firestore
async function syncOrders() {
  if (!isOnline.value) {
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

  // Log that the interval has started
  console.log("Order sync interval started.");

  // Call syncOrders immediately on mount
  syncOrders();

  // Add event listeners for network status
  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);
});

onUnmounted(() => {
  clearInterval(syncInterval);
  window.removeEventListener("online", updateNetworkStatus);
  window.removeEventListener("offline", updateNetworkStatus);
});
</script>
