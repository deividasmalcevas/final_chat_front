import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    logout: () => {
        Cookies.remove('isLoggedIn'); // Remove the token cookie
        set({ isLoggedIn: false });
    },
    checkLoginStatus: () => {
        const token = Cookies.get('isLoggedIn'); // Check for the token cookie
        set({ isLoggedIn: !!token });
    },
}));

export default useAuthStore;