<template>
  <!-- Orders Table -->
  <DataTable
    :value="filteredOrders"
    responsiveLayout="scroll"
    stripedRows
    scrollable
    scrollHeight="47vh"
  >
    <template #empty>
      <tr style="display: flex; justify-content: center; align-items: center">
        <td colspan="5" style="text-align: center; color: gray">
          🚫 No orders found for the selected date.
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

    <Column header="Action">
      <template #body="{ data }">
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-info"
          @click="openDialog(data)"
          outlined
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
            {{ getCurrentStatusLabel(selectedOrder?.orderStatus || "unknown") }}
          </span>
        </p>
        <p>
          <strong>Grand Total:</strong>
          <span class="grand-total">
            ฿ {{ selectedOrder?.total || "N/A" }}
          </span>
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
              x {{ item.name }}
            </span>
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
        <label for="orderStatus"><strong>Update Order Status:</strong></label>
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
            :disabled="isLoading"
          />
          <Button
            label="Save"
            type="submit"
            class="p-button-success save-button"
            :loading="isLoading"
          />
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";

// Correctly define props
const props = defineProps({
  selectedDate: {
    type: String,
    default: null, // Passed from the parent
  },
});

const menuStore = useMenuStore();
const orders = computed(() => menuStore.orders);

var isLoading = ref(false);

// Filter orders based on the selected date
const filteredOrders = computed(() => {
  if (!props.selectedDate) {
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

    return orderDateStr === props.selectedDate;
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
  selectedOrder.value = { ...storedData };
  selectedStatus.value = statusOptions.value.find(
    (option) => option.value === selectedOrder.value.orderStatus
  );
  isDialogVisible.value = true;
};

// Get the display label for the current status
const getCurrentStatusLabel = (statusValue) => {
  const statusLabels = {
    pending: "Pending",
    cancelled: "Cancelled",
    success: "Success",
    unknown: "Unknown", // Fallback
  };
  return statusLabels[statusValue] || "Unknown";
};

// Save changes to the order
const updateOrderStatus = async () => {
  if (!selectedOrder.value || !selectedStatus.value) return;

  isLoading.value = true;

  try {
    // Get the new order status
    const newOrderStatus = selectedStatus.value.value;

    // Call the store function to update the order in local store and Firestore
    await menuStore.updateOrderStatusInFirestore(
      selectedOrder.value.id,
      newOrderStatus
    );

    isLoading.value = false;

    // Close the dialog after the Firestore update is complete
    isDialogVisible.value = false;
  } catch (error) {
    console.error("Failed to update the order status:", error);
    // Optionally, handle the error (e.g., show a notification to the user)
  }
};
</script>

<style scoped>
.main-card {
  height: 100%;
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
