<template>
  <!-- Checkout Button -->
  <Button
    @click="showDialog = true"
    rounded
    :disabled="menuStore.totalItems === 0"
    class="checkout-button"
  >
    <span class="material-icons">shopping_cart_checkout</span>
    <span>Checkout</span>
  </Button>

  <!-- Checkout Dialog -->
  <Dialog
    header="Payment"
    v-model:visible="showDialog"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="payment-dialog"
  >
    <!-- Payment Method Selection -->
    <div>
      <h3>Select Payment Method</h3>
      <div class="field-radiobutton">
        <RadioButton
          inputId="payment1"
          name="payment"
          value="cash"
          v-model="paymentMethod"
        />
        <label for="payment1">Cash</label>
      </div>
      <div class="field-radiobutton">
        <RadioButton
          inputId="payment2"
          name="payment"
          value="qr"
          v-model="paymentMethod"
        />
        <label for="payment2">QR Payment</label>
      </div>
    </div>

    <!-- If cash, show amount received and change with number pad -->
    <div v-if="paymentMethod === 'cash'" class="cash-payment-section">
      <h3>Cash Payment</h3>
      <div>
        <p>Total Amount: ฿{{ formatPrice(menuStore.total) }}</p>
        <p>Amount Received:</p>
        <!-- Number Pad -->
        <div class="number-pad">
          <InputText
            v-model="amountReceivedDisplay"
            readonly
            class="amount-display"
          />
          <div class="pad-buttons">
            <Button
              v-for="n in padButtons"
              :key="n"
              :label="n === 'del' ? 'Del' : n"
              @click="onPadButtonClick(n)"
              class="pad-button"
              :class="{
                'double-width': n === '0',
                'del-button': n === 'del',
              }"
            />
          </div>
        </div>
        <p>Change: ฿{{ formatPrice(change) }}</p>
      </div>
    </div>

    <!-- If QR payment, show total amount -->
    <div v-else-if="paymentMethod === 'qr'" class="qr-payment-section">
      <h3>QR Payment</h3>
      <p>Total Amount: ฿{{ formatPrice(menuStore.total) }}</p>
      <!-- Optionally, you can display a QR code here -->
    </div>

    <!-- Dialog footer with Finish and Cancel buttons -->
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="onCancel"
        class="p-button-text"
      />
      <Button
        label="Finish"
        icon="pi pi-check"
        @click="onFinish"
        :disabled="!canFinish"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";

const menuStore = useMenuStore();

const showDialog = ref(false);
const paymentMethod = ref(null);
const amountReceivedDisplay = ref(""); // String to handle display
const amountReceived = ref(0); // Numeric value for calculations

// Number pad buttons
const padButtons = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
  "0",
  ".",
  "del",
];

// Format price to 2 decimal places with comma separators
const formatPrice = (price) => {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Handle number pad button clicks
function onPadButtonClick(value) {
  if (value === "del") {
    // Delete the last character
    amountReceivedDisplay.value = amountReceivedDisplay.value.slice(0, -1);
  } else {
    // Append the pressed button value
    amountReceivedDisplay.value += value;
  }
  // Update amountReceived as a number
  amountReceived.value = parseFloat(amountReceivedDisplay.value) || 0;
}

// Compute change for cash payments
const change = computed(() => {
  if (paymentMethod.value === "cash") {
    return amountReceived.value - menuStore.total;
  }
  return 0;
});

// Determine if the Finish button should be enabled
const canFinish = computed(() => {
  if (paymentMethod.value === "cash") {
    return amountReceived.value >= menuStore.total && amountReceived.value > 0;
  } else if (paymentMethod.value === "qr") {
    return true;
  }
  return false;
});

// Reset dialog state on cancel
function onCancel() {
  resetDialog();
}

// Handle finish action and save payment details
function onFinish() {
  // Prepare payment details
  const paymentDetails = {
    method: paymentMethod.value,
    amountReceived: amountReceived.value,
    change: change.value,
  };

  // Call checkout with payment details
  menuStore.checkout(paymentDetails);

  // Reset dialog state
  resetDialog();
}

// Reset dialog state function
function resetDialog() {
  showDialog.value = false;
  paymentMethod.value = null;
  amountReceivedDisplay.value = "";
  amountReceived.value = 0;
}
</script>

<style scoped>
.checkout-button {
  width: 100%;
  margin-top: 0.5rem;
}

.checkout-button:active {
  transform: scale(0.95);
  transition: all 0.1s ease;
}

.checkout-button:disabled {
  background-color: var(--disabled-color);
  color: var(--disabled-text-color);
  cursor: not-allowed;
  box-shadow: none;
  transform: scale(1) !important;
}

.payment-dialog .field-radiobutton {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.payment-dialog .field-radiobutton label {
  margin-left: 0.5rem;
}

.cash-payment-section,
.qr-payment-section {
  margin-top: 1rem;
}

.cash-payment-section p,
.qr-payment-section p {
  margin: 0.5rem 0;
}

/* Number Pad Styles */
.number-pad {
  margin-top: 0.5rem;
}

.amount-display {
  width: 100%;
  text-align: right;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.pad-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.pad-button {
  width: 100%;
  height: 3rem;
  font-size: 1.2rem;
}

.double-width {
  grid-column: span 2;
}

.del-button {
  background-color: var(--red-500);
  color: #fff;
}
</style>
