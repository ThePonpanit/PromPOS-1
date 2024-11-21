<template>
  <div>
    <h1>Firestore Health Check</h1>
    <p>Checking the health of Firestore...</p>
    <p v-if="status === 'loading'">Loading...</p>
    <p v-else-if="status === 'success'">Firestore is healthy!</p>
    <p v-else-if="status === 'error'">Firestore is not healthy!</p>
    <p v-else>Unknown status: {{ status }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/init.js";

// Define reactive status
const status = ref("loading");

// Function to check Firestore health
async function checkFirestoreHealth() {
  try {
    // Perform a simple Firestore query
    const testCollection = collection(db, "healthCheck");
    const querySnapshot = await getDocs(testCollection);

    // Check if the collection has any documents
    if (querySnapshot.empty) {
      console.warn("The collection 'healthCheck' does not exist or is empty.");
      status.value = "error"; // Update status to error if the collection is empty
    } else {
      status.value = "success"; // Update status to success if documents exist
    }
  } catch (error) {
    console.error("Firestore health check failed:", error);

    // If an error occurs, update status to error
    status.value = "error";
  }
}

// Call the health check function on component load
onMounted(() => {
  checkFirestoreHealth();
});
</script>

<style scoped>
/* Add any styles if needed */
</style>
