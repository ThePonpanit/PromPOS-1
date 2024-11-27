<template>
  <Card class="summary-card">
    <template #header>
      <h1>Summary</h1>
    </template>

    <template #content>
      <!-- Summary List -->
      <DataTable
        :value="menuStore.selectedItemsWithTotal"
        responsiveLayout="scroll"
        stripedRows
        scrollable
        scrollHeight="50vh"
        style="overflow-y: auto"
        class="summary-table-items"
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
          class="items-name-column"
        ></Column>

        <Column header="Price" :style="{ width: '15%' }">
          <template #body="slotProps">{{
            formatPrice(slotProps.data.price)
          }}</template>
        </Column>

        <Column header="Qty" :style="{ width: '15%' }">
          <template #body="slotProps">{{ slotProps.data.quantity }}</template>
        </Column>

        <Column header="Total" :style="{ width: '15%' }">
          <template #body="slotProps">{{
            formatPrice(slotProps.data.totalPrice)
          }}</template>
        </Column>

        <Column header="Actions" :style="{ width: '10%', textAlign: 'center' }">
          <template #body="slotProps">
            <Button
              @click="menuStore.removeItem(slotProps.data.id)"
              severity="danger"
              text
              icon="pi pi-trash"
              class="action-button"
            />
          </template>
        </Column>
      </DataTable>

      <!-- Footer Summary -->
      <div class="summary-footer">
        <Button
          @click="menuStore.removeAllItems"
          severity="danger"
          rounded
          outlined
          :disabled="menuStore.totalItems === 0"
          class="empty-cart-button"
        >
          <span class="material-icons empty-cart-icon"
            >remove_shopping_cart</span
          >
          <span>Empty Cart</span>
        </Button>
        <div style="display: flex">
          <div class="summary-item">
            <p class="summary-label">Total Items</p>
            <p class="summary-value-total-items sum-value">
              {{ menuStore.totalItems }}
            </p>
          </div>
          <Divider layout="vertical" style="margin-left: 2rem" />
          <div class="summary-item">
            <p class="summary-label">Total Amount</p>
            <p class="summary-value sum-value">
              {{ valueNumberFormat(menuStore.total) }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useMenuStore } from "@/stores/useMenuStore.js";
import { valueNumberFormatter } from "./utils/valueNumberFormatter.js";

const menuStore = useMenuStore();

// Direct usage of the valueNumberFormatter function
const valueNumberFormat = valueNumberFormatter;

// Helper function to format price to 2 decimal places
function formatPrice(price) {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
  height: 100%;
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
  margin-top: 1vh;
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

.sum-value {
  color: green;
  font-weight: bold;
}

/* adj fonts size in the smaller screen */
@media screen and (max-width: 1185px) {
  .summary-card h1 {
    font-size: 1.25rem;
    margin-top: 1rem;
  }

  .summary-label {
    font-size: 0.75rem;
  }

  .empty-cart-button {
    font-size: 0.75rem;
  }

  .empty-cart-icon {
    font-size: 1.2rem;
  }

  .summary-table-items {
    font-size: 0.75rem;
  }

  .action-button {
    width: 20px;
    height: 20px;
  }
}
</style>
