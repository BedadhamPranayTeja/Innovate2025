import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "@/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: Role }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  switchRole: (role: Role) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Check localStorage for registered users
        const storedUsers = JSON.parse(localStorage.getItem("innovate_users") || "[]");
        const foundUser = storedUsers.find((u: User & { password: string }) => 
          u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password: _, ...user } = foundUser;
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
          throw new Error("Invalid credentials");
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const storedUsers = JSON.parse(localStorage.getItem("innovate_users") || "[]");
        
        if (storedUsers.find((u: User) => u.email === data.email)) {
          set({ isLoading: false });
          throw new Error("Email already exists");
        }
        
        const newUser: User = {
          id: crypto.randomUUID(),
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: new Date(),
        };
        
        storedUsers.push({ ...newUser, password: data.password });
        localStorage.setItem("innovate_users", JSON.stringify(storedUsers));
        
        set({ user: newUser, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      switchRole: (role) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, role } });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
