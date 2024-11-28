<template>
  <main class="main-summary-view">
    <DatePicker
      v-model="selectedDateRaw"
      showIcon
      fluid
      appendTo="body"
      dateFormat="yy/mm/dd"
      placeholder="Select a date"
      showButtonBar
    />
    <OrdersSummary
      :orders="orders"
      :selectedDate="formattedSelectedDate"
      :shopId="shopId"
    />
  </main>
</template>

<script setup>
import OrdersSummary from "@/components/OrdersSummary.vue";
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import { db } from "@/firebase/init.js";
import { collection, getDocs } from "firebase/firestore";

// Reactive variables
const selectedDateRaw = ref(new Date());
const shopId = ref("shop123");
const orders = ref([]);

// Computed property to format the selected date
const formattedSelectedDate = computed(() => {
  return dayjs(selectedDateRaw.value).format("YYYY-MM-DD");
});

// Function to fetch orders based on the selected date
async function fetchOrders() {
  const formattedDate = dayjs(selectedDateRaw.value).format("YYYY-MM-DD");
  const ordersRef = collection(
    db,
    "orders",
    shopId.value,
    "shopOrders",
    formattedDate,
    "orders"
  );

  try {
    const querySnapshot = await getDocs(ordersRef);
    orders.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Orders fetched for date:", formattedDate, orders.value);
  } catch (error) {
    console.error("Error fetching orders:", error);
    orders.value = [];
  }
}

// Watch for changes in selectedDateRaw and fetch orders
watch(selectedDateRaw, () => {
  fetchOrders();
});

// Fetch orders on component mount
fetchOrders();
</script>

<style scoped>
.main-summary-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
