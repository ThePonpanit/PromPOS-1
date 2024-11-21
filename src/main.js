import "./global.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

// PrimeVue
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Aura from "@primevue/themes/aura";

// Import PrimeVue Components
import Button from "primevue/button";
import Menubar from "primevue/menubar";

// import Firebase
import "./firebase/init.js";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// Register PrimeVue Components
app.component("Button", Button);
app.component("Menubar", Menubar);

app.use(createPinia());
app.use(router);

app.mount("#app");
