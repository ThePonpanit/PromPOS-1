<template>
  <main>
    <Card style="height: 100vh">
      <template #title>
        <h2>Orders</h2>
      </template>
      <template #subtitle style="display: flex; flex-direction: column">
        <div style="display: flex; gap: 2rem">
          <!-- Toggle Selection Button -->
          <SelectButton v-model="selectedOption" :options="options" />
          <Divider layout="vertical" />
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
            />
          </div>
        </div>
        <p style="margin-top: 1rem; margin-left: 1rem; font-size: large">
          Show all the orders from
          <strong style="text-decoration: underline">{{
            selectedOption
          }}</strong>
          . Showing orders for date:
          <strong style="text-decoration: underline">{{
            selectedDateFormatted
          }}</strong>
        </p>
      </template>
      <template #content>
        <!-- Conditional Rendering of Children -->
        <div v-if="selectedOption === 'Persisted Orders'">
          <PersistedOrdersData :selectedDate="selectedDate" />
        </div>
        <div v-else-if="selectedOption === 'Firestore Orders'">
          <OrdersFromFirestore :selectedDate="selectedDate" />
        </div>
      </template>
    </Card>
  </main>
</template>

<script setup>
import { ref, watch } from "vue";
import PersistedOrdersData from "./PersistedOrdersData.vue";
import OrdersFromFirestore from "./OrdersFromFirestore.vue";

// Toggle options
const options = ref(["Persisted Orders", "Firestore Orders"]);
const selectedOption = ref("Persisted Orders"); // Default selection

// DatePicker values
const selectedDateRaw = ref(null); // Raw date object from DatePicker
const selectedDate = ref(null); // Normalized date (yyyy-mm-dd)
const selectedDateFormatted = ref(null); // Formatted date (dd/mm/yyyy)

// Watch for changes in selectedDateRaw and normalize it
watch(selectedDateRaw, (newValue) => {
  if (newValue instanceof Date) {
    // Normalize to yyyy-mm-dd
    selectedDate.value = `${newValue.getFullYear()}-${String(
      newValue.getMonth() + 1
    ).padStart(2, "0")}-${String(newValue.getDate()).padStart(2, "0")}`;

    // Format to mmmm dd, yyyy
    selectedDateFormatted.value = `${newValue.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  } else {
    selectedDate.value = null; // Reset if cleared
    selectedDateFormatted.value = null;
  }
});

// Set default date on component mount
import { onMounted } from "vue";
onMounted(() => {
  const today = new Date();
  selectedDateRaw.value = today; // Set today's date in DatePicker
  selectedDate.value = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
});
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
</style>
