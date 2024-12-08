import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore"; // Assuming the auth store is located here
import HomeView from "../views/HomeView.vue";
import UserLogin from "@/views/UserLoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: "/login",
      name: "login",
      component: UserLogin,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: "/firestore-health-check",
      name: "firestore-health-check",
      component: () => import("../views/FirestoreHealthCheckView.vue"),
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("../views/OrdersView.vue"),
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: "/summary",
      name: "summary",
      component: () => import("../views/SummaryView.vue"),
      meta: { requiresAuth: true }, // Protected route
    },
    // Catch-all route for 404
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: { requiresAuth: true }, // Protected route
    },
  ],
});

// Add a global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for the user state to be fetched if it's still loading
  if (authStore.isLoading) {
    await authStore.fetchUser();
  }

  // If the route requires authentication and the user is not logged in
  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: "login" }); // Redirect to login
  } else {
    next(); // Allow navigation
  }
});

export default router;
