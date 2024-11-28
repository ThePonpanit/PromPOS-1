<template>
  <div>
    <h2 class="styledHeader2">{{ formattedDate }} Sales Data</h2>
    <div class="summary-container mono-fonts">
      <!-- Total Sales -->
      <div class="summary-item total-sales">
        <h3>Total Sales</h3>
        <template v-if="isLoading">
          <div class="loading-spinner">
            <ProgressSpinner
              style="width: 50px; height: 50px"
              strokeWidth="8"
              fill="transparent"
              animationDuration="1s"
              aria-label="Custom ProgressSpinner"
            />
          </div>
        </template>
        <template v-else>
          <p class="amount number-fonts-family">
            {{ formatCurrency(totalSales) }}
          </p>
          <div class="payment-breakdown">
            <h4>Payment Breakdown</h4>
            <div class="payment-detail">
              <span class="label">Cash:</span>
              <span class="value number-fonts-family">
                {{ formatCurrency(totalCash) }} ({{ cashPercentage }}%)
              </span>
            </div>
            <div class="payment-detail">
              <span class="label">QR:</span>
              <span class="value number-fonts-family">
                {{ formatCurrency(totalQr) }} ({{ qrPercentage }}%)
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- Sales By Category -->
      <div class="summary-item sales-breakdown">
        <h3>Sales By Category</h3>
        <template v-if="isLoading">
          <div class="loading-spinner">
            <ProgressSpinner
              style="width: 50px; height: 50px"
              strokeWidth="8"
              fill="transparent"
              animationDuration="1s"
              aria-label="Custom ProgressSpinner"
            />
          </div>
        </template>
        <template v-else>
          <div class="breakdown-detail" style="margin-top: 1rem">
            <span class="label">Drinks:</span>
            <span class="value number-fonts-family">
              {{ formatCurrency(drinksSales) }} ({{ drinksPercentage }}%)
            </span>
          </div>
          <div class="breakdown-detail">
            <span class="label">Bakery:</span>
            <span class="value number-fonts-family">
              {{ formatCurrency(bakerySales) }} ({{ bakeryPercentage }}%)
            </span>
          </div>
          <div class="breakdown-detail" v-if="unknownItems.length > 0">
            <span class="label">Unknown:</span>
            <span class="value number-fonts-family">
              {{ formatCurrency(unknownSales) }} ({{ unknownPercentage }}%)
            </span>
          </div>
        </template>
      </div>

      <!-- Total Transactions -->
      <div class="summary-item total-transactions">
        <h3>Total Transactions</h3>
        <template v-if="isLoading">
          <div class="loading-spinner">
            <ProgressSpinner
              style="width: 50px; height: 50px"
              strokeWidth="8"
              fill="transparent"
              animationDuration="1s"
              aria-label="Custom ProgressSpinner"
            />
          </div>
        </template>
        <template v-else>
          <p class="amount number-fonts-family">{{ totalTransactions }}</p>
          <div class="payment-breakdown">
            <h4>Transactions Breakdown</h4>
            <div class="payment-detail">
              <span class="label">Cash Transactions:</span>
              <span class="value number-fonts-family">{{
                cashTransactions
              }}</span>
            </div>
            <div class="payment-detail">
              <span class="label">QR Transactions:</span>
              <span class="value number-fonts-family">{{
                qrTransactions
              }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Avg Sales Per Transaction -->
      <div class="summary-item avg-sales-per-transaction">
        <h3>Sales/Transaction</h3>
        <template v-if="isLoading">
          <div class="loading-spinner">
            <ProgressSpinner
              style="width: 50px; height: 50px"
              strokeWidth="8"
              fill="transparent"
              animationDuration="1s"
              aria-label="Custom ProgressSpinner"
            />
          </div>
        </template>
        <template v-else>
          <p class="amount number-fonts-family">{{ avgSalesPerTransaction }}</p>
          <div class="payment-breakdown">
            <h4>Transactions Breakdown</h4>
            <div class="payment-detail">
              <span class="label">Min Value:</span>
              <span class="value number-fonts-family">{{
                minTransactionValue
              }}</span>
            </div>
            <div class="payment-detail">
              <span class="label">Max Value:</span>
              <span class="value number-fonts-family">{{
                maxTransactionValue
              }}</span>
            </div>
            <div class="payment-detail">
              <span class="label">SD:</span>
              <span class="value number-fonts-family">{{
                transactionValueSD
              }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import ProgressSpinner from "primevue/progressspinner";

// Props for orders data and selected date
const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  selectedDate: {
    type: String, // Ensure this matches your expected input
    required: true,
  },
});

// Loading state
const isLoading = ref(false);

// Set loading state to true when orders are empty
watch(
  () => props.orders,
  (orders) => {
    isLoading.value = orders.length === 0;
  }
);

// Reactive variables
const totalSales = ref(0);
const totalCash = ref(0);
const totalQr = ref(0);
const cashTransactions = ref(0);
const qrTransactions = ref(0);
const totalTransactions = ref(0);
const drinksSales = ref(0);
const bakerySales = ref(0);
const unknownSales = ref(0);
const unknownItems = ref([]);
const avgSalesPerTransaction = ref(0);
const minTransactionValue = ref(0);
const maxTransactionValue = ref(0);
const transactionValueSD = ref(0);

// Reset summary values
function resetSummary() {
  totalSales.value = 0;
  totalCash.value = 0;
  totalQr.value = 0;
  cashTransactions.value = 0;
  qrTransactions.value = 0;
  totalTransactions.value = 0;
  drinksSales.value = 0;
  bakerySales.value = 0;
  unknownSales.value = 0;
  unknownItems.value = [];
  avgSalesPerTransaction.value = 0;
  minTransactionValue.value = 0;
  maxTransactionValue.value = 0;
  transactionValueSD.value = 0;
}

// Process the orders
function processOrders() {
  resetSummary();

  if (!props.orders.length) {
    console.warn("No orders to process.");
    return;
  }

  const transactionAmounts = [];

  props.orders.forEach((order) => {
    if (order.orderStatus === "success") {
      const grandTotal = order.total || 0;
      totalSales.value += grandTotal;
      totalTransactions.value += 1;
      transactionAmounts.push(grandTotal);

      // Process payment method
      const paymentMethod = order.paymentDetails.method;
      if (paymentMethod === "cash") {
        totalCash.value += grandTotal;
        cashTransactions.value += 1;
      } else if (paymentMethod === "qr") {
        totalQr.value += grandTotal;
        qrTransactions.value += 1;
      }

      // Process items
      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity || 0;

        // Categorize items
        if (item.name.toLowerCase().includes("drink")) {
          drinksSales.value += itemTotal;
        } else if (item.name.toLowerCase().includes("bakery")) {
          bakerySales.value += itemTotal;
        } else {
          unknownSales.value += itemTotal;
          unknownItems.value.push(item);
        }
      });
    }
  });

  if (transactionAmounts.length) {
    // Calculate average sales per transaction
    avgSalesPerTransaction.value = (
      totalSales.value / totalTransactions.value
    ).toFixed(2);

    // Calculate min and max transaction values
    minTransactionValue.value = Math.min(...transactionAmounts).toFixed(2);
    maxTransactionValue.value = Math.max(...transactionAmounts).toFixed(2);

    // Calculate standard deviation (SD)
    const mean =
      transactionAmounts.reduce((sum, value) => sum + value, 0) /
      transactionAmounts.length;
    const variance =
      transactionAmounts.reduce(
        (sum, value) => sum + Math.pow(value - mean, 2),
        0
      ) / transactionAmounts.length;
    transactionValueSD.value = Math.sqrt(variance).toFixed(2);
  }
}

// Watch for changes in orders data and reprocess
watch(() => props.orders, processOrders, { immediate: true });

// Computed Properties
const cashPercentage = computed(() =>
  totalSales.value
    ? ((totalCash.value / totalSales.value) * 100).toFixed(2)
    : "0.00"
);
const qrPercentage = computed(() =>
  totalSales.value
    ? ((totalQr.value / totalSales.value) * 100).toFixed(2)
    : "0.00"
);
const drinksPercentage = computed(() =>
  totalSales.value
    ? ((drinksSales.value / totalSales.value) * 100).toFixed(2)
    : "0.00"
);
const bakeryPercentage = computed(() =>
  totalSales.value
    ? ((bakerySales.value / totalSales.value) * 100).toFixed(2)
    : "0.00"
);
const unknownPercentage = computed(() =>
  totalSales.value
    ? ((unknownSales.value / totalSales.value) * 100).toFixed(2)
    : "0.00"
);

const formattedDate = computed(() => {
  return dayjs(props.selectedDate).format("MMMM DD, YYYY");
});

// Helper function to format numbers as currency
const formatCurrency = (value) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(value);
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Fill the card */
  font-size: 20rem;
  color: #666;
}

.styledHeader2 {
  font-weight: 800;
  font-size: 2rem;
  text-align: center;
  margin: 2vh 0;
}

.summary-container {
  color: #333;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2vh;
  margin: 3vh 1vh;
  text-wrap: nowrap;
}

.summary-item {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2vh 2vw;
  text-align: center;

  width: calc(25% - 2vh);
  min-width: 250px;
  width: fit-content;

  min-height: 250px;
}

.amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.payment-breakdown {
  margin-top: 1.5vh;
  text-align: left;
}

.payment-breakdown h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5vh;
  color: #666;
}

.payment-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5vh;
}

.payment-detail .label {
  font-weight: 600;
  color: #444;
}

.payment-detail .value {
  color: #555;
  font-weight: 500;
}

.total-sales {
  background-color: #d0e8c5;
}

.sales-breakdown {
  background-color: #fffed3;
}

.total-transactions {
  background-color: #bbe9ff;
}

.avg-sales-per-transaction {
  background-color: #b1afff;
}

@media (max-width: 768px) {
  .summary-container {
    flex-direction: column;
    align-items: center;
  }

  .summary-item {
    width: 90%;
    padding: 1.5vh 1.5vw;
    margin: 1vh 0;
  }
}
</style>
