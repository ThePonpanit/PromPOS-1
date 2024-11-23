import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// PrimeVue
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

// Custom Theme
const customTheme = definePreset(Aura, {
  components: {
    menubar: {
      colorScheme: {
        light: {
          root: {
            background: "{surface.0}", // Use the light theme's surface color
            color: "{text.color}", // Use the light theme's text color
          },
          item: {
            color: "{text.color}",
            hoverBackground: "{surface.100}",
            hoverColor: "{text.color}",
          },
        },
        dark: {
          root: {
            background: "{surface.900}", // Use the dark theme's surface color
            color: "{text.color}", // Use the dark theme's text color
          },
          item: {
            color: "{text.color}",
            hoverBackground: "{surface.800}",
            hoverColor: "{text.color}",
          },
        },
      },
    },
  },
});

import "./global.css";

// Import PrimeVue Components
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import Card from "primevue/card";
import { Divider } from "primevue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import SelectButton from "primevue/selectbutton";

// import Firebase
import "./firebase/init.js";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: customTheme,
    options: {
      darkModeSelector: '[data-theme="dark"]',
    },
  },
});

// Register PrimeVue Components
app.component("Button", Button);
app.component("Menubar", Menubar);
app.component("Card", Card);
app.component("Divider", Divider);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Dialog", Dialog);
app.component("Select", Select);
app.component("DatePicker", DatePicker);
app.component("SelectButton", SelectButton);

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// Router
app.use(router);

// Mount the app
app.mount("#app");
