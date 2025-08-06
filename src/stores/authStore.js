// src/stores/authStore.js
import { defineStore } from "pinia";
import { auth } from "@/firebase/init";
import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: null,
    isLoading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isGuest: (state) => state.user?.isGuest || false,
    userName: (state) =>
      state.user?.displayName || state.user?.email || "Unknown User",
  },
  actions: {
    async loginWithEmail(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;
      } catch (error) {
        console.error("Email login failed:", error);
        throw error;
      }
    },
    async loginWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;
      } catch (error) {
        console.error("Google login failed:", error);
        throw error;
      }
    },
    async loginAsGuest() {
      try {
        // Create a guest user object with demo credentials
        const guestUser = {
          uid: "guest-user-demo",
          email: "guest@prompos-demo.com",
          displayName: "Guest User",
          isGuest: true,
          photoURL: null,
          emailVerified: false,
        };
        this.user = guestUser;

        // Store guest status in localStorage for persistence
        localStorage.setItem("prompos_guest_user", JSON.stringify(guestUser));

        console.log("Guest login successful");
        return guestUser;
      } catch (error) {
        console.error("Guest login failed:", error);
        throw error;
      }
    },
    async logout() {
      await signOut(auth);
      this.user = null;

      // Clear guest user data if exists
      localStorage.removeItem("prompos_guest_user");
    },
    fetchUser() {
      return new Promise((resolve) => {
        // Check for guest user first
        const guestUser = localStorage.getItem("prompos_guest_user");
        if (guestUser) {
          try {
            this.user = JSON.parse(guestUser);
            this.isLoading = false;
            resolve(this.user);
            return;
          } catch (error) {
            // If parsing fails, remove invalid data and continue with Firebase auth
            localStorage.removeItem("prompos_guest_user");
          }
        }

        // If no guest user, check Firebase auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          this.user = user;
          this.isLoading = false;
          unsubscribe();
          resolve(user);
        });
      });
    },
  },
});
