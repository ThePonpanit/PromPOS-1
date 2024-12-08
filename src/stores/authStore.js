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
    async logout() {
      await signOut(auth);
      this.user = null;
    },
    fetchUser() {
      return new Promise((resolve) => {
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
