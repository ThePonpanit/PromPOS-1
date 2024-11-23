<template>
  <Card class="main-card">
    <template #title>
      <h2>All Orders</h2>
    </template>
    <template #subtitle>
      Show all the Persisted Orders that have been saved to local storage.
    </template>
    <template #content>
      <DataTable
        :value="orders"
        responsiveLayout="scroll"
        scrollable
        scrollHeight="65vh"
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
import { ref, computed } from "vue";

import { useMenuStore } from "@/stores/useMenuStore";

const menuStore = useMenuStore();
const orders = computed(() => menuStore.orders);

const isDialogVisible = ref(false); // Controls dialog visibility
const selectedOrder = ref(null); // Holds the currently selected order for editing
const selectedStatus = ref(null); // Holds the currently selected status in the dropdown

// Options for the PrimeVue Select
const statusOptions = ref([
  { label: "Cancelled", value: "cancelled" },
  { label: "Success", value: "success" }, // Add this line
]);

// Open the dialog and set the selected order
const openDialog = (storedData) => {
  selectedOrder.value = { ...storedData.data }; // Extract the data property
  console.log("Selected Order Status:", selectedOrder.value.orderStatus); // Debugging log
  selectedStatus.value = statusOptions.value.find(
    (option) => option.value === selectedOrder.value.orderStatus
  ); // Map orderStatus to a statusOptions item
  console.log("Mapped Selected Status:", selectedStatus.value); // Debugging log
  isDialogVisible.value = true; // Open the dialog
};

// Get the display label for the current status
const getCurrentStatusLabel = (statusValue) => {
  const option = statusOptions.value.find(
    (option) => option.value === statusValue
  );
  return option?.label; // Return the label, or undefined if not found
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

    console.log(`Order ${selectedOrder.value.id} updated successfully.`);
  }

  isDialogVisible.value = false; // Close the dialog
};
</script>

<style scoped>
.main-card {
  height: 100%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

/* Base style for underline */
.status-underline {
  text-decoration: underline;
  text-underline-offset: 4px;
  margin-left: 1rem;
}

/* Red underline for "Cancelled" */
.status-underline-cancelled {
  text-decoration-color: #f44336; /* Red underline */
}

/* Green underline for "Success" */
.status-underline-success {
  text-decoration-color: #4caf50; /* Green underline */
}

.status-pending {
  color: #ffc107; /* Yellow for Pending */
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
