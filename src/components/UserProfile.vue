<template>
  <div>
    <!-- Button to trigger the popover -->
    <Button
      v-if="authStore.user"
      :label="authStore.user?.displayName?.split(' ')[0] || 'User'"
      icon="pi pi-user"
      @click="toggle"
      outlined
      rounded
    />

    <!-- Show login Button -->
    <Button
      v-else
      label="Login"
      icon="pi pi-sign-in"
      @click="() => router.push('/login')"
      outlined
    />

    <!-- Popover content -->
    <Popover ref="op">
      <div>
        <!-- User Info Section -->
        <div>
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 1rem;
            "
          >
            <Avatar
              class="mr-2"
              style="background-color: #dee9fc; color: #1a2551"
              shape="circle"
              size="xlarge"
              :image="authStore.user?.photoURL || fallbackPhoto"
            />
          </div>
          <Divider />
          <div style="display: flex; flex-direction: column" class="user-info">
            <p>
              <i
                class="pi pi-user user-icon-decoration"
                style="color: #9aa6b2; opacity: 0.5"
              />
              <span>{{ displayName }}</span>
            </p>

            <p>
              <i class="pi pi-envelope user-icon-decoration" />
              <span>{{ email }}</span>
            </p>

            <p>
              <i class="pi pi-calendar user-icon-decoration" />
              <span>Created At: {{ formattedCreatedAt }}</span>
            </p>

            <p>
              <i class="pi pi-clock user-icon-decoration" />
              <span>Last Login: {{ formattedDate }}</span>
            </p>
          </div>
        </div>

        <!-- Divider -->
        <Divider />
        <div style="display: flex; justify-content: center">
          <!-- Logout Button -->
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            @click="handleLogout"
            severity="danger"
            rounded
            raised
          />
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const op = ref(); // Reference for the Popover
const authStore = useAuthStore();
const router = useRouter();

// Fallback photo
const fallbackPhoto = "https://via.placeholder.com/96";

// Computed properties for user data
const displayName = computed(() => authStore.user?.displayName || "Guest User");
const email = computed(() => authStore.user?.email || "No Email Available");

// Toggle Popover
const toggle = (event) => {
  op.value.toggle(event);
};

// Logout function
const handleLogout = async () => {
  try {
    await authStore.logout(); // Call the logout action in the auth store
    router.push("/login"); // Redirect to the login page
    // Close the popover after logout
    op.value.hide();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Computed property for formatted date
const formattedDate = computed(() => {
  const timestamp = Number(authStore.user?.metadata?.lastLoginAt);
  if (!timestamp) {
    return "No login timestamp available";
  }

  const date = new Date(timestamp);
  const options = {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleString("en-US", options); // Format to date and time only
});

// Computed property for formatted createdAt
const formattedCreatedAt = computed(() => {
  const timestamp = Number(authStore.user?.metadata?.createdAt);
  if (!timestamp) {
    return "No creation timestamp available";
  }

  const date = new Date(timestamp);
  const options = {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleString("en-US", options); // Format to date and time only
});

// // Log user data and handle initial state
onMounted(() => {
  console.log("Initial User Data:", authStore.user);

  // Watch for changes in user data (optional)
  watch(
    () => authStore.user,
    (newValue) => {
      console.log("Updated User Data:", newValue);
    }
  );
});
</script>

<style scoped>
.user-icon-decoration {
  color: #9aa6b2;
  opacity: 0.5;
}

.user-info > p {
  gap: 0.5rem;
  text-wrap: nowrap;
}

.user-info > p > i {
  margin-right: 0.5rem;
}
</style>
