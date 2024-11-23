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
      <template #body="{ data }">
        <span :class="{ 'status-pending': data.sendStatus === 'pending' }">
          <i
            v-if="data.sendStatus === 'pending'"
            class="pi pi-exclamation-triangle"
          ></i>
          {{
            (data.sendStatus ?? "unknown").charAt(0).toUpperCase() +
            (data.sendStatus ?? "unknown").slice(1)
          }}
        </span>
      </template>
    </Column>

    <Column header="Grand Total">
      <template #body="{ data }">฿ {{ data.total ?? 0 }}</template>
    </Column>

    <Column field="timestampUTC7" header="Timestamp"></Column>

    <Column header="Order Status">
      <template #body="{ data }">
        <span
          :class="{
            'status-underline-cancelled': data.orderStatus === 'cancelled',
            'status-underline-success': data.orderStatus === 'success',
          }"
        >
          {{ getCurrentStatusLabel(data.orderStatus ?? "unknown") }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { db } from "@/firebase/init.js"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";

// Accept selectedDate as a prop
const props = defineProps({
  selectedDateRange: {
    type: Object,
    default: () => ({ startDate: null, endDate: null }),
  },
});

// Firestore orders
const orders = ref([]); // Holds the fetched orders
const shopId = "shop123"; // Replace with your shop ID

// Helper function to get dates between two dates
function getDatesBetween(startDateStr, endDateStr) {
  const dates = [];
  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  while (currentDate <= endDate) {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    dates.push(dateStr);

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Fetch orders based on the selected date range
const fetchOrdersByDateRange = async (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) {
    orders.value = []; // Clear orders if no date range is selected
    return;
  }

  try {
    const dateList = getDatesBetween(startDateStr, endDateStr);

    const allOrders = [];

    for (const datePath of dateList) {
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
      const ordersForDate = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      allOrders.push(...ordersForDate);
    }

    orders.value = allOrders;
  } catch (error) {
    console.error(
      `Error fetching orders for date range ${startDateStr} - ${endDateStr}:`,
      error
    );
    orders.value = []; // Clear on error
  }
};

// Watch props.selectedDateRange and fetch orders when it changes
watch(
  () => [props.selectedDateRange.startDate, props.selectedDateRange.endDate],
  ([newStartDate, newEndDate]) => {
    fetchOrdersByDateRange(newStartDate, newEndDate);
  }
);

// Fetch orders for the selected date range on component mount
onMounted(() => {
  fetchOrdersByDateRange(
    props.selectedDateRange.startDate,
    props.selectedDateRange.endDate
  );
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
