<template>
  <main>
    <div class="layout">
      <!-- Left Spacer -->
      <div class="left-spacer"></div>

      <!-- Centered Footer -->
      <div class="center-content">
        <p>Footer</p>
      </div>

      <!-- Right AppVersion -->
      <div class="right-content">
        <p>
          <AppVersion />
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import AppVersion from "./version/AppVersion.vue";
</script>

<style scoped>
.layout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Left Spacer */
.left-spacer {
  flex: 1;
}

/* Centered Footer */
.center-content {
  flex: 1;
  text-align: center;
}

/* Right AppVersion */
.right-content {
  flex: 1;
  text-align: right;
}

/* Styling for Footer and AppVersion */
.center-content p,
.right-content p {
  margin: 0;
  font-size: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    text-align: center;
  }

  .left-spacer,
  .center-content,
  .right-content {
    flex: none;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .right-content {
    text-align: center;
  }
}
</style>
