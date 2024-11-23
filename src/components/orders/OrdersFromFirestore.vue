<template>
  <!-- Orders Table -->
  <DataTable
    :value="orders"
    responsiveLayout="scroll"
    scrollable
    scrollHeight="55vh"
    stripedRows
    style="height: 55vh"
  >
    <template #empty>
      <tr>
        <td colspan="5" style="text-align: center; color: gray">
          🚫 No items to display.
        </td>
      </tr>
    </template>
    <Column field="id" header="Order ID"></Column>
    <Column header="Data Status">
      <template #body="storedData">
        <span
          :class="{ 'status-pending': storedData.sendStatus === 'pending' }"
        >
          <i
            v-if="storedData.sendStatus === 'pending'"
            class="pi pi-exclamation-triangle"
          ></i>
          {{
            (storedData.sendStatus ?? "unknown").charAt(0).toUpperCase() +
            (storedData.sendStatus ?? "unknown").slice(1)
          }}
        </span>
      </template>
    </Column>
    <Column header="Grand Total">
      <template #body="storedData">฿ {{ storedData.total ?? 0 }}</template>
    </Column>
    <Column field="timestampUTC7" header="Timestamp"></Column>
    <Column header="Order Status">
      <template #body="storedData">
        <span
          :class="{
            'status-underline-cancelled':
              storedData.orderStatus === 'cancelled',
            'status-underline-success': storedData.orderStatus === 'success',
          }"
        >
          {{ getCurrentStatusLabel(storedData.orderStatus ?? "unknown") }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { db } from "@/firebase/init.js"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";

// Firestore orders
const orders = ref([]); // Holds the fetched orders
const selectedDate = ref(new Date().toISOString().split("T")[0]); // Default to today's date
const shopId = "shop123"; // Replace with your shop ID

// Fetch orders based on the selected date
const fetchOrdersByDate = async (date) => {
  try {
    const datePath = `${date}`; // e.g., "2024-11-23"
    const ordersRef = collection(
      db,
      "orders",
      shopId,
      "shopOrders",
      datePath,
      "orders"
    );

    const querySnapshot = await getDocs(ordersRef);

    // Map Firestore data to an array
    orders.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(`Orders for ${date} loaded:`, orders.value);
  } catch (error) {
    console.error(`Error fetching orders for date ${date}:`, error);
    orders.value = []; // Clear on error
  }
};

// Watch selectedDate and fetch orders when it changes
watch(selectedDate, (newDate) => {
  console.log("Fetching orders for date:", newDate);
  fetchOrdersByDate(newDate);
});

// Fetch orders for the default date on component mount
onMounted(() => {
  fetchOrdersByDate(selectedDate.value);
});

// Get display label for order status
const getCurrentStatusLabel = (statusValue) => {
  const statusLabels = {
    pending: "Pending",
    cancelled: "Cancelled",
    success: "Success",
    unknown: "Unknown", // Fallback
  };
  return statusLabels[statusValue] || "Unknown";
};
</script>

<style scoped>
.filter-container {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-picker {
  width: 200px;
}

.status-pending {
  color: #ffc107;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-underline-cancelled {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: #f44336; /* Red underline */
}

.status-underline-success {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: #4caf50; /* Green underline */
}
</style>
