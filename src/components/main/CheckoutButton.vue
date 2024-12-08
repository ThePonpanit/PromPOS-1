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
      <h3 style="margin-bottom: 0.5rem">Select Payment Method</h3>
      <div class="field-radiobutton">
        <RadioButton
          inputId="payment1"
          name="payment"
          value="cash"
          v-model="paymentMethod"
        />
        <label for="payment1">
          <span> Cash </span>
          <i class="material-icons">payments</i>
        </label>
      </div>
      <div class="field-radiobutton">
        <RadioButton
          inputId="payment2"
          name="payment"
          value="qr"
          v-model="paymentMethod"
        />
        <label for="payment2">
          <span> QR Payment </span>
          <i class="material-icons">qr_code_scanner</i>
        </label>
      </div>
    </div>

    <div v-if="paymentMethod">
      <Divider />
    </div>

    <!-- Scrollable Content Container -->
    <div ref="dialogContent">
      <!-- If cash, show amount received and change with number pad -->
      <div v-if="paymentMethod === 'cash'" class="cash-payment-section">
        <h3>
          <span>Cash Payment</span>
          <i class="material-icons">payments</i>
        </h3>
        <div>
          <p class="total-amount">
            Total Amount: ฿ {{ formatPrice(menuStore.totalWithVAT) }}
          </p>
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
                :icon="n === 'del' ? 'pi pi-delete-left' : ''"
                @click="onPadButtonClick(n)"
                class="pad-button"
                :class="{
                  'double-width': n === '0',
                  'del-button': n === 'del',
                  'clear-button': n === 'clear',
                }"
              />
            </div>
            <div class="mono-fonts change-display-amount">
              <p v-if="change === 0">No Change</p>
              <p v-else>Change: ฿{{ formatPrice(change) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Payment Section -->
      <div v-else-if="paymentMethod === 'qr'" class="qr-payment-section">
        <h3>
          <span> QR Payment </span>
          <i class="material-icons">qr_code_scanner</i>
        </h3>
        <p>Total Amount: ฿{{ formatPrice(menuStore.totalWithVAT) }}</p>
        <Card class="qr-payment-card">
          <template #content class="qr-image-container">
            <p>Scan the QR code to pay with PromptPay.</p>
            <img
              src="/src/assets/images/promptpay-logo.png"
              alt="PromptPay Logo"
              class="PromptPay-logo"
            />
            <img :src="qrCodeDataUrl" alt="QR Code" class="qr-code-image" />
            <p class="mono-fonts" style="font-weight: 700">
              *Total Amount: ฿{{ formatPrice(menuStore.totalWithVAT) }}*
            </p>
          </template>
        </Card>
      </div>
      <!-- Scroll Target for Smooth Scrolling -->
      <div ref="scrollTarget"></div>
    </div>

    <!-- Dialog footer with Finish and Cancel buttons -->
    <template #footer>
      <div style="width: 100%">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5rem;
          "
        >
          <Button
            label="Cancel"
            icon="pi pi-times"
            @click="onCancel"
            class="p-button-text"
            severity="danger"
          />
          <Button
            label="Finish"
            icon="pi pi-check"
            @click="onFinish"
            :disabled="!canFinish"
            :outlined="!canFinish"
            style="width: 50%"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useMenuStore } from "@/stores/useMenuStore";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

const menuStore = useMenuStore();

const showDialog = ref(false);
const paymentMethod = ref(null);

// Cash Payment Variables
const amountReceivedDisplay = ref("");
const amountReceived = ref(0);

// QR Payment Variables
const qrCodeDataUrl = ref("");

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
  "clear",
  "del",
];

// Reference to the dialog content container
const dialogContent = ref(null);

// Reference to the scroll target (used for scrollIntoView)
const scrollTarget = ref(null);

// Format price to 2 decimal places with comma separators
const formatPrice = (price) => {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Handle number pad button clicks
function onPadButtonClick(value) {
  if (value === "del") {
    // Delete the last character
    amountReceivedDisplay.value = amountReceivedDisplay.value.slice(0, -1);
  } else if (value === "clear") {
    // Reset the display and amount
    amountReceivedDisplay.value = "";
    amountReceived.value = 0;
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
    return amountReceived.value - menuStore.totalWithVAT;
  }
  return 0;
});

// Determine if the Finish button should be enabled
const canFinish = computed(() => {
  if (paymentMethod.value === "cash") {
    return (
      amountReceived.value >= menuStore.totalWithVAT && amountReceived.value > 0
    );
  } else if (paymentMethod.value === "qr") {
    return true;
  }
  return false;
});

// Reset dialog state on cancel
function onCancel() {
  resetDialog();
}

const promptpayAccount = "0804920305"; // Replace with your PromptPay number (without dashes)

// Watch payment method selection to generate QR code
watch(
  () => paymentMethod.value,
  async (newMethod) => {
    if (newMethod === "qr") {
      // Generate PromptPay QR code
      const mobileNumber = promptpayAccount;
      const amount = menuStore.totalWithVAT;
      const payload = generatePayload(mobileNumber, { amount });

      // Generate QR code data URL
      try {
        qrCodeDataUrl.value = await QRCode.toDataURL(payload);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    } else {
      qrCodeDataUrl.value = "";
    }

    // After updating payment method, scroll to the bottom
    await nextTick(); // Wait for DOM to update
    if (dialogContent.value) {
      dialogContent.value.scrollTop = dialogContent.value.scrollHeight;
    }

    // Alternatively, use scrollIntoView on the scrollTarget
    if (scrollTarget.value) {
      scrollTarget.value.scrollIntoView({ behavior: "smooth" });
    }
  }
);

// Handle finish action and save payment details
function onFinish() {
  // Prepare payment details
  const paymentDetails = {
    method: paymentMethod.value,
    amountReceived: amountReceived.value,
    change: change.value,
    account: promptpayAccount, // Replace with your PromptPay number (without dashes)
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

<style>
.payment-dialog {
  width: 30rem;
}
</style>

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
  margin-left: 0.65rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
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
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 0.5rem;
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
  grid-column: span 2;
}

.clear-button {
  background-color: var(--blue-500);
  color: #fff;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--primary-color);
}

.change-display-amount > p {
  text-align: center;
  font-size: 1.5rem;
}

.qr-payment-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid var(--border-color);
}

.PromptPay-logo,
.qr-code-image {
  display: block;
  margin: 0 auto;
  width: 50%;
  height: auto;
}

.PromptPay-logo {
  z-index: 9;
  margin-bottom: -1rem;
}

.qr-code-image {
  z-index: 10;
}

div > h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
