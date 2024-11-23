<template>
  <Card class="main-card">
    <template #title>
      <h2>All Orders</h2>
    </template>
    <template #subtitle>
      Show all the Persisted Orders that have been saved to local storage.
    </template>
    <template #content>
      <!-- Date Picker for Filtering -->
      <div class="filter-container">
        <span>Filter by Date:</span>
        <DatePicker
          v-model="selectedDateRaw"
          showButtonBar
          show-icon
          appendTo="body"
          class="date-picker"
          dateFormat="yy / mm / dd"
          placeholder="Select a date"
          ref="datePicker"
        />
      </div>

      <!-- Orders Table -->
      <DataTable
        :value="filteredOrders"
        responsiveLayout="scroll"
        scrollable
        scrollHeight="65vh"
        stripedRows
        style="height: 65vh"
      >
        <template #empty>
          <tr
            style="display: flex; justify-content: center; align-items: center"
          >
            <td colspan="5" style="text-align: center; color: gray">
              🚫 No orders found for the selected date
              <span style="text-decoration: underline; font-weight: bold"
                >or</span
              >
              No orders found.
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
              ></i>
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
          <template #body="storedData">
            <span
              :class="{
                'status-underline-cancelled':
                  storedData.data.orderStatus === 'cancelled',
                'status-underline-success':
                  storedData.data.orderStatus === 'success',
              }"
            >
              {{ getCurrentStatusLabel(storedData.data.orderStatus) }}
            </span>
          </template>
        </Column>
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
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";

// Use Menu Store
const menuStore = useMenuStore();
const orders = computed(() => menuStore.orders);

// DatePicker values
const selectedDateRaw = ref(null); // Raw date object from DatePicker
const selectedDate = ref(null); // Normalized date (yyyy-mm-dd)

// Reference to DatePicker
const datePicker = ref(null);

// Watch for changes in selectedDateRaw and normalize it
watch(selectedDateRaw, (newValue) => {
  if (newValue instanceof Date) {
    // Normalize to yyyy-mm-dd
    selectedDate.value = `${newValue.getFullYear()}-${String(
      newValue.getMonth() + 1
    ).padStart(2, "0")}-${String(newValue.getDate()).padStart(2, "0")}`;
  } else {
    selectedDate.value = null; // Reset if cleared
  }
});

// Set default date on component mount
onMounted(() => {
  const today = new Date();
  selectedDateRaw.value = today; // Set today's date in DatePicker
  selectedDate.value = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  console.log(
    "Component mounted. Selected Date initialized:",
    selectedDate.value
  );
});

// Filter orders based on the selected date
const filteredOrders = computed(() => {
  if (!selectedDate.value) {
    return orders.value; // Show all orders if no date is selected
  }

  return orders.value.filter((order) => {
    if (!order.timestampUTC7) {
      return false;
    }

    const orderDate = new Date(order.timestampUTC7);
    const orderDateStr = `${orderDate.getFullYear()}-${String(
      orderDate.getMonth() + 1
    ).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`;

    return orderDateStr === selectedDate.value;
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
