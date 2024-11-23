<template>
  <Card class="main-card">
    <template #title>
      <h2>All Orders</h2>
    </template>
    <template #subtitle>
      Show all the Persisted Orders that have been saved to local storage.
    </template>
    <template #content>
      <!-- Date Picker for filtering -->
      <div class="filter-container">
        <span>Filter by Date Range:</span>
        <DatePicker
          v-model="selectedDateRange"
          selectionMode="range"
          appendTo="body"
          class="date-picker"
          dateFormat="yy-mm-dd"
          placeholder="Select date range"
          ref="datePicker"
        >
          <!-- Custom Header with Close Button -->
          <template #header>
            <div class="custom-header">
              <span>Select Date Range</span>
              <button class="close-button" @click="closeCalendar">✖</button>
            </div>
          </template>

          <!-- Custom Button Bar -->
          <template #buttonbar>
            <div class="custom-buttonbar">
              <Button label="Today" class="p-button-text" @click="setToday" />
              <Button
                label="Close"
                class="p-button-text"
                @click="closeCalendar"
              />
            </div>
          </template>
        </DatePicker>
      </div>

      <!-- Orders Table -->
      <DataTable
        :value="filteredOrders"
        responsiveLayout="scroll"
        scrollable
        scrollHeight="65vh"
        style="height: 65vh"
        stripedRows
      >
        <template #empty>
          <tr
            style="display: flex; justify-content: center; align-items: center"
          >
            <td colspan="5" style="text-align: center; color: gray">
              🚫 No items to display.
            </td>
          </tr>
        </template>
        <Column field="id" header="Order ID"></Column>
        <Column header="Data Status">
          <template #body="storedData">
            <span
              :class="{
                'status-pending': storedData.data.sendStatus === 'pending',
              }"
            >
              <i
                v-if="storedData.data.sendStatus === 'pending'"
                class="pi pi-exclamation-triangle"
              />
              {{
                storedData.data.sendStatus.charAt(0).toUpperCase() +
                storedData.data.sendStatus.slice(1)
              }}
            </span>
          </template>
        </Column>
        <Column header="Grand Total">
          <template #body="storedData">฿ {{ storedData.data.total }}</template>
        </Column>
        <Column field="timestampUTC7" header="Timestamp"></Column>
        <Column header="Order Status">
          <!-- Add conditional underline style based on the order status -->
          <template #body="storedData">
            <span
              :class="{
                'status-underline-cancelled':
                  storedData.data.orderStatus === 'cancelled',
                'status-underline-success':
                  storedData.data.orderStatus === 'success',
                'status-underline': true,
              }"
            >
              {{ getCurrentStatusLabel(storedData.data.orderStatus) }}
            </span>
          </template>
        </Column>
        <!-- Action Column -->
        <Column header="Action">
          <template #body="storedData">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info"
              @click="openDialog(storedData)"
              outlined
            />
          </template>
        </Column>
      </DataTable>

      <!-- Dialog -->
      <template>
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
              <p><strong>Order ID:</strong> {{ selectedOrder?.id || "N/A" }}</p>
              <p>
                <strong>Timestamp:</strong>
                {{ selectedOrder?.timestampUTC7 || "N/A" }}
              </p>
              <p>
                <strong>Current Order Status:</strong>
                <span
                  :class="{
                    'status-underline-cancelled':
                      selectedOrder?.orderStatus === 'cancelled',
                    'status-underline-success':
                      selectedOrder?.orderStatus === 'success',
                  }"
                  class="status-underline"
                >
                  {{
                    getCurrentStatusLabel(selectedOrder?.orderStatus) || "N/A"
                  }}
                </span>
              </p>

              <p>
                <strong>Grand Total:</strong>
                <span class="grand-total"
                  >฿ {{ selectedOrder?.total || "N/A" }}</span
                >
              </p>
            </div>
            <Divider />
            <!-- Order Items -->
            <div class="order-items">
              <h4>Items:</h4>
              <ul>
                <li
                  v-for="item in selectedOrder?.items || []"
                  :key="item.id"
                  class="item"
                >
                  <span>
                    <span style="font-weight: bold">
                      {{ item.quantity }}
                    </span>
                    x {{ item.name }}</span
                  >
                  <span class="item-price">฿{{ item.price }}</span>
                </li>
              </ul>
            </div>
            <div style="text-align: right">
              <span>
                Total Items:

                <span style="font-weight: 700">
                  {{ selectedOrder?.items?.length || 0 }}
                </span>
              </span>
            </div>
            <Divider />
            <!-- Editable Status -->
            <form @submit.prevent="updateOrderStatus" class="edit-status-form">
              <label for="orderStatus"
                ><strong>Update Order Status:</strong></label
              >
              <Select
                id="orderStatus"
                v-model="selectedStatus"
                :options="statusOptions"
                optionLabel="label"
                placeholder="Select a Status"
                class="w-full status-select"
              />
              <div class="dialog-buttons">
                <Button
                  label="Cancel"
                  class="p-button-secondary cancel-button"
                  @click="isDialogVisible = false"
                  text
                  severity="danger"
                />
                <Button
                  label="Save"
                  type="submit"
                  class="p-button-success save-button"
                />
              </div>
            </form>
          </div>
        </Dialog>
      </template>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";

// Use Menu Store
const menuStore = useMenuStore();
const orders = computed(() => menuStore.orders);

// Date range selected from the DatePicker
const selectedDateRange = ref([]); // Holds start and end dates

// Function to close the calendar popup
const closeDatePicker = () => {
  const calendarPanel = document.querySelector(".p-datepicker");
  if (calendarPanel) {
    calendarPanel.classList.remove("p-connected-overlay-visible"); // Remove visibility class
    calendarPanel.style.display = "none"; // Hide the panel
  }
};

// Set today as the selected range
const setToday = () => {
  const today = new Date();
  selectedDateRange.value = [today, today]; // Set start and end to today
};

// Normalize date range into start and end for filtering
const filteredOrders = computed(() => {
  if (!selectedDateRange.value || selectedDateRange.value.length !== 2) {
    return orders.value; // Return all orders if no range is selected
  }

  const [startDateRaw, endDateRaw] = selectedDateRange.value;

  // Normalize start and end to `yyyy-mm-dd`
  const startDate = new Date(startDateRaw);
  const endDate = new Date(endDateRaw);
  const normalizedStartDate = `${startDate.getFullYear()}-${String(
    startDate.getMonth() + 1
  ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
  const normalizedEndDate = `${endDate.getFullYear()}-${String(
    endDate.getMonth() + 1
  ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

  console.log(
    `Filtering Orders: From ${normalizedStartDate} To ${normalizedEndDate}`
  );

  // Filter orders within the selected range
  return orders.value.filter((order) => {
    if (!order.timestampUTC7) {
      return false;
    }

    const orderDate = new Date(order.timestampUTC7);
    const normalizedOrderDate = `${orderDate.getFullYear()}-${String(
      orderDate.getMonth() + 1
    ).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`;

    return (
      normalizedOrderDate >= normalizedStartDate &&
      normalizedOrderDate <= normalizedEndDate
    );
  });
});
// Dialog and Selected Order
const isDialogVisible = ref(false);
const selectedOrder = ref(null);
const selectedStatus = ref(null);

// Options for the PrimeVue Select
const statusOptions = ref([
  { label: "Cancelled", value: "cancelled" },
  { label: "Success", value: "success" },
]);

// Open the dialog and set the selected order
const openDialog = (storedData) => {
  selectedOrder.value = { ...storedData.data };
  selectedStatus.value = statusOptions.value.find(
    (option) => option.value === selectedOrder.value.orderStatus
  );
  isDialogVisible.value = true;
};

// Get the display label for the current status
const getCurrentStatusLabel = (statusValue) => {
  const option = statusOptions.value.find(
    (option) => option.value === statusValue
  );
  return option?.label;
};

// Save changes to the order
const updateOrderStatus = () => {
  if (!selectedOrder.value || !selectedStatus.value) return;

  // Update the `orderStatus` with the selected status value
  selectedOrder.value.orderStatus = selectedStatus.value.value;

  // Find the order in the list and update it
  const index = orders.value.findIndex((o) => o.id === selectedOrder.value.id);
  if (index !== -1) {
    orders.value[index] = { ...selectedOrder.value };

    // Optionally, persist the updated orders back to localStorage
    localStorage.setItem("menuStore", JSON.stringify({ orders: orders.value }));
  }
  isDialogVisible.value = false;
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
  width: fit-content;
}

.status-pending {
  color: #ffc107;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

<style>
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
</style>
