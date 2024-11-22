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
        <Column field="status" header="Data Status"></Column>
        <Column header="Grand Total">
          <template #body="storedData">฿ {{ storedData.total }}</template>
        </Column>
        <Column field="timestampUTC7" header="Timestamp"></Column>
        <Column field="orderStatus" header="Order Status"></Column>
        <!-- Action Column -->
        <Column header="Action">
          <template #body="storedData">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info"
              @click="openDialog(storedData)"
            />
          </template>
        </Column>
      </DataTable>

      <!-- Dialog -->
      <template>
        <Dialog
          header="Edit Order Status"
          v-model:visible="isDialogVisible"
          :modal="true"
          :closable="true"
          :draggable="false"
        >
          <form @submit.prevent="updateOrderStatus">
            <p>
              Order ID: <b>{{ selectedOrder?.id || "N/A" }}</b>
            </p>
            <p>
              Current Status:
              <b>{{
                getCurrentStatusLabel(selectedOrder?.orderStatus) || "N/A"
              }}</b>
            </p>
            <label for="orderStatus">New Status:</label>
            <Select
              id="orderStatus"
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              placeholder="Select a Status"
              class="w-full"
            />
            <div style="text-align: right; margin-top: 1rem">
              <Button label="Save" type="submit" class="p-button-success" />
              <Button
                label="Cancel"
                class="p-button-secondary"
                @click="isDialogVisible = false"
              />
            </div>
          </form>
        </Dialog>
      </template>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";

const orders = ref([]);
const isDialogVisible = ref(false); // Controls dialog visibility
const selectedOrder = ref(null); // Holds the currently selected order for editing
const selectedStatus = ref(null); // Holds the currently selected status in the dropdown

// Options for the PrimeVue Select
const statusOptions = ref([
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]);

// Load orders from localStorage
onMounted(() => {
  const storedData = localStorage.getItem("menuStore");
  if (storedData) {
    const localData = JSON.parse(storedData);
    if (localData.orders) {
      orders.value = localData.orders;
    } else {
      console.error("No orders found in local storage data.");
    }
  } else {
    console.error("No menuStore data found in local storage.");
  }
});

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
</style>
