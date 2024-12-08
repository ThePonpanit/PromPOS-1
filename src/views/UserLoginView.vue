<template>
  <div class="login-page">
    <Card>
      <template #header>
        <h2>Login</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleEmailLogin">
          <div class="p-field">
            <label for="email">Email</label>
            <InputText
              v-model="email"
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div class="p-field">
            <label for="password">Password</label>
            <Password
              v-model="password"
              id="password"
              placeholder="Enter your password"
              :feedback="false"
            />
          </div>
          <Button
            label="Login with Email"
            type="submit"
            class="p-button-primary"
          />
        </form>
        <div class="divider">OR</div>
        <Button
          label="Login with Google"
          icon="pi pi-google"
          class="p-button-danger"
          @click="handleGoogleLogin"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");

// Redirect if user is already authenticated
onBeforeMount(() => {
  if (authStore.user) {
    router.push("/"); // Redirect to the home page
  }
});

const handleEmailLogin = async () => {
  try {
    await authStore.loginWithEmail(email.value, password.value);
    router.push("/"); // Redirect to a protected route
  } catch (error) {
    alert("Email login failed. Please check your credentials.");
  }
};

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle();
    router.push("/"); // Redirect to a protected route
  } catch (error) {
    alert("Google login failed. Please try again.");
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}

.divider {
  margin: 1rem 0;
  font-weight: bold;
  color: #aaa;
}
</style>
