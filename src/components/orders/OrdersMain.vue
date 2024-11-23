<template>
  <main>
    <Card style="height: 100vh">
      <template #title>
        <h2>Orders</h2>
      </template>
      <template #subtitle style="display: flex; flex-direction: column">
        <div style="display: flex; gap: 2rem">
          <!-- Toggle Selection Button -->
          <ButtonGroup class="button-group-styles">
            <Button
              v-for="option in options"
              :key="option.label"
              :label="option.label"
              :icon="option.icon"
              :class="{
                'custom-selected-button': selectedOption === option.label,
              }"
              @click="handleButtonClick(option.label)"
              :severity="
                selectedOption === option.label ? 'success' : 'secondary'
              "
              raised
            />
          </ButtonGroup>

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
              dateFormat="yy/mm/dd"
              placeholder="Select date range"
              selectionMode="range"
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
        <div v-if="selectedOption === 'Firestore Orders'">
          <OrdersFromFirestore :selectedDateRange="selectedDate" />
        </div>
        <div v-else-if="selectedOption === 'Persisted Orders'">
          <PersistedOrdersData :selectedDateRange="selectedDate" />
        </div>
      </template>
    </Card>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import PersistedOrdersData from "./PersistedOrdersData.vue";
import OrdersFromFirestore from "./OrdersFromFirestore.vue";

// Toggle options with icons
const options = ref([
  { icon: "pi pi-cloud", label: "Firestore Orders" },
  { icon: "pi pi-save", label: "Persisted Orders" },
]);

const selectedOption = ref("Firestore Orders"); // Default selection

// DatePicker values
const selectedDateRaw = ref([]); // Raw date objects from DatePicker
const selectedDate = ref({ startDate: null, endDate: null }); // Normalized date range (yyyy-mm-dd)
const selectedDateFormatted = ref(""); // Formatted date range

// Watch for changes in selectedDateRaw and normalize it
watch(selectedDateRaw, (newValue) => {
  if (Array.isArray(newValue) && newValue.length === 2) {
    const [start, end] = newValue;

    if (start instanceof Date && end instanceof Date) {
      // Normalize to yyyy-mm-dd
      selectedDate.value.startDate = `${start.getFullYear()}-${String(
        start.getMonth() + 1
      ).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;

      selectedDate.value.endDate = `${end.getFullYear()}-${String(
        end.getMonth() + 1
      ).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;

      // Format to mmmm dd, yyyy
      selectedDateFormatted.value = `${start.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} To ${end.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }
  } else {
    selectedDate.value.startDate = null;
    selectedDate.value.endDate = null;
    selectedDateFormatted.value = "";
  }
});

// Set default date range on component mount
onMounted(() => {
  const today = new Date();
  selectedDateRaw.value = [today, today]; // Set today's date range
  selectedDate.value.startDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  selectedDate.value.endDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  selectedDateFormatted.value = `${today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} - ${today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
});

// Handle button click to set selected option
const handleButtonClick = (label) => {
  selectedOption.value = label; // Update the selected option
};
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.button-group-styles {
  border: 3px solid var(--border-color);
  border-radius: 10px;
}
</style>
