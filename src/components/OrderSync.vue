<template>
  <!-- Network Status Indicator -->
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
  runTransaction,
} from "firebase/firestore";

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
    (order) => order.sendStatus !== "sent"
  );

  for (const order of pendingOrders) {
    try {
      const shopId = "shop123"; // Use your shop ID here
      const shopName = "Your Shop Name"; // Use your shop name here

      // Extract dateString from order.timestamp
      const orderDate = new Date(order.timestamp);
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, "0");
      const day = String(orderDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`; // 'YYYY-MM-DD'

      // **Create a reference to the shop document**
      const shopDocRef = doc(db, "orders", shopId);

      let orderId = order.id;

      if (!order.id || order.id === "n/a") {
        // Need to generate orderId
        let invoiceNumber = 0;

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

        // Update the order object
        order.id = orderId;

        // Update the order in the local store
        menuStore.updateOrderId(order.localID, orderId);
      }

      // Ensure the date document exists
      const dateDocRef = doc(
        collection(db, "orders", shopId, "shopOrders"),
        dateString
      );

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

      // Update the date document
      await updateDoc(dateDocRef, {
        totalOrder: increment(1),
        grandTotal: increment(order.total),
        lastUpdate: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
      });

      // **Create a reference to the order document**
      const orderRef = doc(
        collection(db, "orders", shopId, "shopOrders", dateString, "orders"),
        orderId
      );

      // Send order to Firestore
      await setDoc(orderRef, {
        ...order,
        sendStatus: "sent",
      });

      // Update order status in the store
      menuStore.updateOrderSendStatus(order.id, "sent");
      console.log(`Order ${order.id} sent successfully.`);
    } catch (error) {
      console.error("Error sending order:", error);
      // Optionally update status to 'failed'
      menuStore.updateOrderSendStatus(order.id, "failed");
    }
  }
}

onMounted(() => {
  // Start the interval to sync orders every 30 seconds
  syncInterval = setInterval(syncOrders, 30000); // 30,000 ms = 30 seconds

  // Call syncOrders immediately on mount
  syncOrders();

  // Add event listeners for network status
  window.addEventListener("online", () => {
    updateNetworkStatus();
    syncOrders(); // Try to sync immediately when back online
  });
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
  /* border: 2px solid var(--border-color); */
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
