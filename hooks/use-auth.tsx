"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext, useMemo, useCallback } from "react"

interface User {
  id: string
  name: string
  email: string
  joinDate: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updatedUser: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

/**
 * Provides authentication state and actions to descendant components.
 * Persists user state in localStorage and supports cross-tab synchronization.
 * @param children - React children nodes.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for existing session
      const savedUser = localStorage.getItem("comfortillo-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }

      // Listen for storage changes to update user data when profile is updated
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "comfortillo-user" && e.newValue) {
          setUser(JSON.parse(e.newValue))
        }
      }
      // Note: The "storage" event only fires on other tabs, not the current one.
      // This is used for cross-tab user state synchronization.
      window.addEventListener("storage", handleStorageChange)

      // Also listen for manual updates within the same tab
      const handleUserUpdate = () => {
        const savedUser = localStorage.getItem("comfortillo-user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      }
      window.addEventListener("comfortillo-userUpdated", handleUserUpdate)
      window.addEventListener("userUpdated", handleUserUpdate)

      // Cleanup
      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("comfortillo-userUpdated", handleUserUpdate)
        window.removeEventListener("userUpdated", handleUserUpdate)
      }
    }
    // If window is undefined, do nothing
    return
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, accept any email/password
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      joinDate: Date.now(),
    };

    setUser(newUser);
    localStorage.setItem("comfortillo-user", JSON.stringify(newUser));
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      joinDate: Date.now(),
    };

    setUser(newUser);
    localStorage.setItem("comfortillo-user", JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("comfortillo-user");
  }, []);

  // Function to update user data
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    window.dispatchEvent(new CustomEvent("comfortillo-userUpdated"));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("userUpdated"));
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateUser,
    }),
    // Only user is a dependency; the functions are stable and do not need to be included
    [user, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}


