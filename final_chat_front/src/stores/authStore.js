import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    logout: () => {
        localStorage.removeItem('token');
        set({ isLoggedIn: false });
    },
    login: (token) => {
        localStorage.setItem('token', token);
        set({ isLoggedIn: true });
    },
}));

export default useAuthStore;
