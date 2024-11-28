<template>
  <div>
    <h1>
      <span> 404 - Page Not Found </span>
      <span class="material-icons sentiment_dissatisfied"
        >sentiment_dissatisfied</span
      >
    </h1>
    <p>The page you are looking for does not exist.</p>

    <div style="text-align: center; margin-top: 3vh">
      <router-link to="/" class="link">Go back to Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
h1 {
  color: red;
}

.link {
  text-decoration: underline;
}

.sentiment_dissatisfied {
  font-size: 2rem;
}

div > h1 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
