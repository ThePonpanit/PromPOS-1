<template>
  <Card class="summary-card">
    <template #header>
      <h1>Summary</h1>
    </template>

    <template #content>
      <DataTable
        :value="selectedItemsWithTotal"
        responsiveLayout="scroll"
        stripedRows
        style="overflow-y: auto; height: 55vh"
      >
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
        <p>Total Items: {{ totalItems }}</p>
        <p>Total Amount: {{ valueNumberFormat(total) }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useMenuStore } from "./composables/useMenuStore.js";
import { valueNumberFormatter } from "./utils/valueNumberFormatter.js";

const { selectedItemsWithTotal, removeItem, total, totalItems } =
  useMenuStore();

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
</style>
