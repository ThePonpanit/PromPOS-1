<template>
  <!-- Orders Table -->
  <DataTable
    :value="filteredOrders"
    responsiveLayout="scroll"
    stripedRows
    scrollable
    scrollHeight="55vh"
    style="height: 55vh"
  >
    <template #empty>
      <tr style="display: flex; justify-content: center; align-items: center">
        <td colspan="5" style="text-align: center; color: gray">
          🚫 No orders found for the selected date.
        </td>
      </tr>
    </template>

    <Column header="Local ID">
      <template #body="{ data }">
        <span>{{ data.localID || "N/A" }}</span>
      </template>
    </Column>
    <Column header="Database ID" v-if="false">
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
          {{ formatPrice((data.total || 0) + (data.vatAmount ?? 0)) }}
        </span>
      </template>
    </Column>

    <Column field="timestampUTC7" header="Timestamp"></Column>

    <Column header="Payment Type">
      <template #body="{ data }">
        <span class="mono-fonts" style="margin-right: 1rem">
          <span v-if="data.paymentDetails?.method === 'cash'">Cash</span>
          <span v-else-if="data.paymentDetails?.method === 'qr'">
            Promptpay QR
          </span>
          <span v-else> N/A </span>
        </span></template
      >
    </Column>

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
          label="Edit"
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
          <strong>Current Order Status:</strong>
          <span
            style="margin-left: 1rem"
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

        <!-- Total -->
        <p>
          <strong>Total:</strong>
          <span class="mono-fonts">
            ฿ {{ formatPrice(selectedOrder?.total) || "N/A" }}
          </span>
        </p>

        <!-- VAT Amount -->
        <p>
          <strong>VAT Amount:</strong>
          <span class="mono-fonts">
            ฿ {{ formatPrice(selectedOrder?.vatAmount) || "N/A" }}
          </span>
        </p>

        <!-- Grand Total -->
        <p>
          <strong>Grand Total:</strong>
          <span class="grand-total mono-fonts">
            ฿
            {{
              formatPrice(
                (selectedOrder.total || 0) + (selectedOrder.vatAmount ?? 0)
              ) || "N/A"
            }}
          </span>
        </p>

        <!-- Payment Method -->
        <p>
          <strong>Payment Method:</strong>
          <span style="margin-left: 1rem">
            <span v-if="selectedOrder.paymentDetails?.method === 'cash'"
              >Cash</span
            >
            <span v-else-if="selectedOrder.paymentDetails?.method === 'qr'">
              Promptpay QR
            </span>
            <span v-else> N/A </span>
          </span>
        </p>

        <div v-if="selectedOrder.paymentDetails?.method === 'cash'">
          <!-- Payment Details -->
          <p>
            <strong>Amount Received:</strong>
            <span style="margin-left: 1rem">
              ฿ {{ formatPrice(selectedOrder?.paymentDetails?.amountReceived) }}
            </span>
          </p>
          <!-- Change -->
          <p>
            <strong>Change:</strong>
            <span style="margin-left: 1rem">
              ฿ {{ formatPrice(selectedOrder?.paymentDetails?.change) }}
            </span>
          </p>
        </div>
        <div v-else-if="selectedOrder.paymentDetails?.method === 'qr'">
          <!-- Payment Account Details -->
          <p>
            <strong>Payment Account:</strong>
            <span style="margin-left: 1rem">
              {{ selectedOrder?.paymentDetails?.account || "N/A" }}
            </span>
          </p>
        </div>
      </div>

      <Divider />
      <!-- Order Items -->
      <div class="order-items">
        <h4>Items List:</h4>
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
            <span class="item-price mono-fonts">{{
              formatPrice(item.price * item.quantity)
            }}</span>
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
          class="status-select"
          style="width: 9vw; min-width: fit-content; margin-left: 0.5rem"
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
            :disabled="isSaveDisabled"
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
  selectedDateRange: {
    type: Object,
    default: () => ({ startDate: null, endDate: null }),
  },
});

const menuStore = useMenuStore();
const orders = computed(() => menuStore.orders);

const isLoading = ref(false);

// Filter orders based on the selected date range
const filteredOrders = computed(() => {
  if (
    !props.selectedDateRange ||
    !props.selectedDateRange.startDate ||
    !props.selectedDateRange.endDate
  ) {
    return orders.value; // Show all orders if no date range is selected
  }

  const startDateStr = props.selectedDateRange.startDate;
  const endDateStr = props.selectedDateRange.endDate;

  return orders.value.filter((order) => {
    if (!order.timestamp) {
      return false;
    }

    const orderDate = new Date(order.timestamp); // Convert to local time
    const orderDateStr = `${orderDate.getFullYear()}-${String(
      orderDate.getMonth() + 1
    ).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`;

    const isIncluded =
      orderDateStr >= startDateStr && orderDateStr <= endDateStr;

    return isIncluded;
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

// Check if the Save button should be disabled
const isSaveDisabled = computed(() => {
  // Disable if the selected order status matches the current status or if no status is selected
  return (
    !selectedStatus.value ||
    selectedOrder.value?.orderStatus === selectedStatus.value.value
  );
});

// Helper function to format the number to 2 decimal places and add the comma separator
const formatPrice = (price) => {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

/* style for the disabled button */
.p-button-success:disabled {
  background-color: gray;
  border-color: gray;
  color: #fff;
  transition: all 0.3s ease;
}

/* style the disabled hover effect */
.p-button-success:disabled:hover {
  background-color: gray;
  border-color: gray;
  color: #fff;
  cursor: not-allowed;
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
  height: 20px !important; /* Ensure button height matches other cell content */
  padding: 0 !important; /* Remove internal padding */
  margin: 0 !important; /* Remove external margin */
  line-height: 1 !important; /* Adjust line height to reduce vertical space */
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
