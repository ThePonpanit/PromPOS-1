<template>
  <!-- Orders Table -->
  <DataTable
    :value="orders"
    responsiveLayout="scroll"
    scrollable
    stripedRows
    scrollHeight="55vh"
    style="height: 55vh"
  >
    <template #empty>
      <tr style="display: flex; justify-content: center; align-items: center">
        <td colspan="7" style="text-align: center; color: gray">
          🚫 No orders found for the selected date.
        </td>
      </tr>
    </template>

    <Column header="Local ID">
      <template #body="{ data }">
        <span>{{ data.localID || "N/A" }}</span>
      </template>
    </Column>
    <Column header="Database ID">
      <template #body="{ data }">
        <span>{{ data.id || "N/A" }}</span>
      </template>
    </Column>

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

    <Column header="Grand Total" style="text-align: right">
      <template #body="{ data }">
        <span class="mono-fonts" style="margin-right: 1rem">
          {{ formatPrice(data.total) ?? 0 }}</span
        ></template
      >
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

    <!-- New Action Column -->
    <Column header="Action">
      <template #body="{ data }">
        <Button
          label="Details"
          class="p-button-rounded p-button-info custom-edit-button"
          @click="openDialog(data)"
          text
        />
      </template>
    </Column>
  </DataTable>

  <!-- Dialog -->
  <Dialog
    header="Order Details"
    v-model:visible="isDialogVisible"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="order-dialog"
  >
    <div class="dialog-content">
      <!-- Order Information -->
      <div class="order-info">
        <!-- Order ID -->
        <p>
          <strong>Order ID:</strong>
          <span style="margin-left: 1rem">
            {{ selectedOrder?.id || "N/A" }}
          </span>
        </p>

        <!-- Local ID -->
        <p>
          <strong>Local ID:</strong>
          <span style="margin-left: 1rem">
            {{ selectedOrder?.localID || "N/A" }}
          </span>
        </p>

        <!-- Timestamp -->
        <p>
          <strong>Timestamp:</strong>
          <span style="margin-left: 1rem">
            {{ selectedOrder?.timestampUTC7 || "N/A" }}
          </span>
        </p>

        <!-- Order Status -->
        <p>
          <strong>Order Status:</strong>
          <span
            style="margin-left: 1rem"
            :class="{
              'status-underline-cancelled':
                selectedOrder?.orderStatus === 'cancelled',
              'status-underline-success':
                selectedOrder?.orderStatus === 'success',
            }"
          >
            {{ getCurrentStatusLabel(selectedOrder?.orderStatus || "unknown") }}
          </span>
        </p>

        <!-- Grand Total -->
        <p>
          <strong>Grand Total:</strong>
          <span class="grand-total mono-fonts">
            ฿ {{ formatPrice(selectedOrder?.total) || "N/A" }}
          </span>
        </p>
      </div>

      <Divider />
      <!-- Order Items -->
      <div class="order-items">
        <h4>Items:</h4>
        <table class="order-items-table">
          <thead style="border-bottom: 1px solid var(--border-color)">
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th style="text-align: right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedOrder?.items || []" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td class="item-price mono-fonts">
                {{ formatPrice(item.price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="text-align: right">
        <span>
          Total Items:
          <span style="font-weight: 700">
            {{ selectedOrder?.items?.length || 0 }}
          </span>
        </span>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { db } from "@/firebase/init.js"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";

// Accept selectedDateRange as a prop
const props = defineProps({
  selectedDateRange: {
    type: Object,
    default: () => ({ startDate: null, endDate: null }),
  },
});

// Firestore orders
const orders = ref([]); // Holds the fetched orders
const shopId = "shop123"; // Replace with your shop ID

// Dialog and Selected Order
const isDialogVisible = ref(false);
const selectedOrder = ref(null);

// Open the dialog and set the selected order
const openDialog = (order) => {
  selectedOrder.value = order;
  isDialogVisible.value = true;
};

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

// Helper function to format the number to 2 decimal places and add the comma separator
const formatPrice = (price) => {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style scoped>
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

.custom-edit-button {
  height: 20px !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1 !important;
}

.custom-edit-button:hover {
  background-color: none !important;
}

/* Adjust alignment for cells with buttons */
.p-datatable-tbody > tr > td {
  vertical-align: middle !important;
}
</style>

<style scoped>
.order-dialog {
  text-wrap: nowrap;
  min-width: 350px;
}

.dialog-content {
  font-size: 14px;
  line-height: 1.6;
}

.order-info p {
  margin: 0.5rem 0;
}

.order-info .grand-total {
  margin-left: 1rem;
  font-weight: bold;
  color: #4caf50; /* Highlight the grand total in green */
}

.order-items {
  margin: 1rem 0;
}

.order-items h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items .item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.order-items .item-price {
  font-weight: bold;
  text-align: right;
  color: #4caf50; /* Match the grand total color */
}

.edit-status-form {
  margin-top: 1.5rem;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.save-button {
  background-color: #4caf50;
  border-color: #4caf50;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #333;
}
/* Styles for the Table */
.order-items-table {
  width: 100%; /* Make the table stretch across the dialog width */
  border-collapse: collapse; /* Remove spacing between table cells */
  margin-top: 1rem;
  font-size: 14px;
}

.order-items-table th,
.order-items-table td {
  padding: 0.125rem;
  text-align: left; /* Align text to the left */
}

.order-items-table th {
  font-weight: bold;
}

.item-price {
  font-weight: bold;
  color: #4caf50; /* Match grand total color */
}
</style>
