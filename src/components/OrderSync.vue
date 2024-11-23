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

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";
import { db } from "@/firebase/init.js";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

const menuStore = useMenuStore();
const isOnline = ref(navigator.onLine); // Reactive network status
let syncInterval;

// Listen for network status changes
function updateNetworkStatus() {
  isOnline.value = navigator.onLine;
}

// Helper function to extract date in 'YYYY-MM-DD' format from the timestamp
function extractDateFromTimestamp(timestampUTC7) {
  const [month, day, year] = timestampUTC7.split(",")[0].split("/");
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

// Sync pending orders with Firestore
async function syncOrders() {
  if (!isOnline.value) {
    console.log("No internet connection. Will retry when online.");
    return;
  }

  const pendingOrders = menuStore.orders.filter(
    (order) => order.sendStatus !== "sent"
  );

  for (const order of pendingOrders) {
    try {
      const shopId = "shop123"; // Use your shop ID here
      const dateString = extractDateFromTimestamp(order.timestampUTC7);

      // **Create a reference to the shop document**
      const shopDocRef = doc(db, "orders", shopId);

      // Ensure the shop document exists
      const shopDocSnap = await getDoc(shopDocRef);
      if (!shopDocSnap.exists()) {
        await setDoc(shopDocRef, {
          shopId: shopId,
          shopName: "Your Shop Name",
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

      // Ensure the date document exists
      const dateDocSnap = await getDoc(dateDocRef);
      if (!dateDocSnap.exists()) {
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

      // Update the date document with totalOrder, grandTotal, lastUpdate
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
        sendStatus: "sent", // Update status to sent
      });

      // Update order status in the store
      menuStore.updateOrderStatus(order.id, "sent");
      console.log(`Order ${order.id} sent successfully.`);
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
