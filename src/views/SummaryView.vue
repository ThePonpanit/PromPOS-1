<template>
  <OrdersSummary
    :orders="orders"
    :selectedDate="selectedDate"
    :shopId="shopId"
  />
</template>

<script setup>
import OrdersSummary from "@/components/OrdersSummary.vue";
import { ref, onMounted } from "vue";
import { db } from "@/firebase/init.js";
import { collection, getDocs } from "firebase/firestore";

// Reactive variables
const selectedDate = ref("2024-11-26");
const shopId = ref("shop123");
const orders = ref([]); // Store the fetched orders

// Fetch orders from Firebase
async function fetchOrders() {
  const datePath = selectedDate.value;
  const ordersRef = collection(
    db,
    "orders",
    shopId.value,
    "shopOrders",
    datePath,
    "orders"
  );

  try {
    const querySnapshot = await getDocs(ordersRef);
    orders.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Orders fetched:", orders.value);
  } catch (error) {
    console.error("Error fetching orders:", error);
    orders.value = [];
  }
}

// Fetch orders on mount
onMounted(fetchOrders);
</script>
