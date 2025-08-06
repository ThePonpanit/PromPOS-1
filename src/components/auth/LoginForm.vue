<template>
  <div class="login-container">
    <Card class="login-card">
      <template #header>
        <div class="login-header">
          <h2>Welcome to PromPOS</h2>
          <p>Please sign in to continue</p>
        </div>
      </template>

      <template #content>
        <!-- Guest Login for HR/Demo -->
        <div class="guest-login-section">
          <h3>🎯 For HR & Demo Testing</h3>
          <p class="guest-description">
            Quick access to explore all features without registration
          </p>
          <Button
            label="Continue as Guest"
            icon="pi pi-user"
            @click="loginAsGuest"
            :loading="guestLoading"
            class="guest-login-btn"
            severity="success"
            size="large"
          />
        </div>

        <Divider align="center">
          <span class="divider-text">OR</span>
        </Divider>

        <!-- Email Login -->
        <form @submit.prevent="handleEmailLogin" class="login-form">
          <div class="field">
            <label for="email">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :class="{ 'p-invalid': emailError }"
              fluid
            />
            <small v-if="emailError" class="p-error">{{ emailError }}</small>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Enter your password"
              :class="{ 'p-invalid': passwordError }"
              fluid
              :feedback="false"
              toggleMask
            />
            <small v-if="passwordError" class="p-error">{{
              passwordError
            }}</small>
          </div>

          <Button
            type="submit"
            label="Sign In"
            icon="pi pi-sign-in"
            :loading="emailLoading"
            class="login-btn"
            size="large"
          />
        </form>

        <Divider />

        <!-- Google Login -->
        <Button
          label="Sign in with Google"
          icon="pi pi-google"
          @click="handleGoogleLogin"
          :loading="googleLoading"
          class="google-login-btn"
          outlined
          size="large"
        />

        <!-- Error Message -->
        <Message v-if="errorMessage" severity="error" class="error-message">
          {{ errorMessage }}
        </Message>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Form data
const email = ref("");
const password = ref("");

// Loading states
const emailLoading = ref(false);
const googleLoading = ref(false);
const guestLoading = ref(false);

// Error states
const emailError = ref("");
const passwordError = ref("");
const errorMessage = ref("");

// Clear errors
const clearErrors = () => {
  emailError.value = "";
  passwordError.value = "";
  errorMessage.value = "";
};

// Guest login
const loginAsGuest = async () => {
  guestLoading.value = true;
  clearErrors();

  try {
    await authStore.loginAsGuest();
    // Redirect to main app
    router.push("/");
  } catch (error) {
    errorMessage.value = "Failed to login as guest. Please try again.";
  } finally {
    guestLoading.value = false;
  }
};

// Email login
const handleEmailLogin = async () => {
  emailLoading.value = true;
  clearErrors();

  // Basic validation
  if (!email.value) {
    emailError.value = "Email is required";
    emailLoading.value = false;
    return;
  }
  if (!password.value) {
    passwordError.value = "Password is required";
    emailLoading.value = false;
    return;
  }

  try {
    await authStore.loginWithEmail(email.value, password.value);
    router.push("/");
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    emailLoading.value = false;
  }
};

// Google login
const handleGoogleLogin = async () => {
  googleLoading.value = true;
  clearErrors();

  try {
    await authStore.loginWithGoogle();
    router.push("/");
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    googleLoading.value = false;
  }
};

// Error message helper
const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled. Please try again.";
    default:
      return "An error occurred during sign-in. Please try again.";
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  padding: 2rem 2rem 0;
}

.login-header h2 {
  margin: 0 0 0.5rem;
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 1rem;
}

.guest-login-section {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.guest-login-section h3 {
  margin: 0 0 0.5rem;
  color: var(--primary-color);
  font-size: 1.2rem;
}

.guest-description {
  margin: 0 0 1rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.guest-login-btn {
  width: 100%;
  margin-bottom: 0.5rem;
}

.divider-text {
  background: var(--surface-0);
  padding: 0 1rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.login-form {
  margin: 1rem 0;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
}

.google-login-btn {
  width: 100%;
  margin-top: 1rem;
}

.error-message {
  margin-top: 1rem;
  width: 100%;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }

  .login-header {
    padding: 1rem 1rem 0;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>
