<template>
  <Button
    @click="refreshPage"
    icon="pi pi-refresh"
    label="Refresh"
    outlined
    rounded
    severity="secondary"
  />
</template>

<script>
export default {
  name: "RefreshButton",
  methods: {
    refreshPage() {
      // Perform a hard refresh equivalent to Ctrl + F5
      window.location.reload(true);
    },
  },
};
</script>

<style scoped></style>
