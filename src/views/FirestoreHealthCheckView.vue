<template>
  <div>
    <div>
      <h1>Firestore Health Check</h1>
      <p v-if="status === 'loading'">Checking the health of Firestore...</p>
      <p v-else-if="status != 'loading'">
        Checking the health of Firestore completed !
      </p>
      <div style="font-weight: 700; font-size: large">
        <p v-if="status === 'loading'">Loading...</p>
        <p v-else-if="status === 'success'" style="color: green">
          Firestore is healthy!
        </p>
        <p v-else-if="status === 'error'" style="color: red">
          Firestore is not healthy!
        </p>
        <p v-else style="color: yellow">Unknown status: {{ status }}</p>
      </div>
    </div>
    <div style="margin-top: 5vh">
      <!-- add Refresh Button to recheck the Health -->
      <Button
        @click="checkFirestoreHealth"
        label="Refresh"
        icon="pi pi-refresh"
        :disabled="status === 'loading'"
      />
    </div>
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
  console.log("Checking Firestore health...");
  status.value = "loading"; // Update status to loading

  // wait 2 seconds before checking the health
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
