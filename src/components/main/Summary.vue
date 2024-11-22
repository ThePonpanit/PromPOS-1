<template>
  <Card class="summary-card">
    <template #header>
      <h1>Summary</h1>
    </template>

    <template #content>
      <!-- Summary List -->
      <DataTable
        :value="selectedItemsWithTotal"
        responsiveLayout="scroll"
        stripedRows
        scrollable
        scrollHeight="55vh"
        style="overflow-y: auto; height: 55vh"
      >
        <template #empty>
          <tr
            style="display: flex; justify-content: center; align-items: center"
          >
            <td colspan="5" style="text-align: center; color: gray">
              🚫 No items to display. Add some items to your cart! 🛒
            </td>
          </tr>
        </template>

        <Column
          field="name"
          header="Item Name"
          :style="{ width: '45%' }"
        ></Column>
        <Column header="Price" :style="{ width: '15%' }">
          <template #body="slotProps">฿{{ slotProps.data.price }}</template>
        </Column>
        <Column header="Quantity" :style="{ width: '15%' }">
          <template #body="slotProps">{{ slotProps.data.quantity }}</template>
        </Column>
        <Column header="Total Price" :style="{ width: '15%' }">
          <template #body="slotProps"
            >฿{{ slotProps.data.totalPrice }}</template
          >
        </Column>
        <Column header="Actions" :style="{ width: '10%' }">
          <template #body="slotProps">
            <Button
              icon="pi pi-minus"
              @click="removeItem(slotProps.data.id)"
              severity="danger"
              rounded
              outlined
            />
          </template>
        </Column>
      </DataTable>

      <!-- Footer Summary -->
      <div class="summary-footer">
        <Button
          @click="removeAllItems"
          severity="danger"
          rounded
          outlined
          style="margin-left: -1rem"
        >
          <span class="material-icons">remove_shopping_cart</span>
          <span>Empty Cart</span>
        </Button>
        <div style="display: flex">
          <div class="summary-item">
            <p class="summary-label">Total Items</p>
            <p class="summary-value-total-items">{{ totalItems }}</p>
          </div>
          <Divider layout="vertical" style="margin-left: 2rem" />
          <div class="summary-item">
            <p class="summary-label">Total Amount</p>
            <p class="summary-value">{{ valueNumberFormat(total) }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useMenuStore } from "./composables/useMenuStore.js";
import { valueNumberFormatter } from "./utils/valueNumberFormatter.js";

const {
  selectedItemsWithTotal,
  removeItem,
  total,
  totalItems,
  removeAllItems,
} = useMenuStore();

// Direct usage of the valueNumberFormatter function
const valueNumberFormat = valueNumberFormatter;
</script>

<style scoped>
.summary-card {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background-color: var(--surface-0);
  padding-left: 10px;
}

.summary {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background-color: var(--surface-0);
}

.summary h2 {
  margin-bottom: 10px;
}

.summary ul {
  list-style: none;
  padding: 0;
}

.summary li {
  margin-bottom: 5px;
}

.summary p {
  font-weight: bold;
  margin: 10px 0;
}

/* add styles for the template #header */
.summary-card h1 {
  text-align: center;
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 1vh;
}

.summary-footer {
  font-family: "Roboto Mono", monospace;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  flex-wrap: wrap; /* Allow content to wrap */
  align-items: flex-start;
}

.summary-label {
  margin: 0;
  font-weight: bold;
  white-space: nowrap; /* Prevent label from wrapping */
  width: 100%;
  text-align: right;
}

.summary-value {
  margin: 0;
  flex-basis: 100%; /* Value takes full width when wrapping */
  word-break: break-word; /* Allow long numbers to wrap */
  text-align: right;
  width: 1rem;
}

.total-amount {
  font-weight: bold;
  color: var(--primary-color);
}

.summary-value-total-items {
  margin: 0;
  flex-basis: 100%;
  word-break: break-word;
  text-align: right;
  width: 1rem;
}
</style>
