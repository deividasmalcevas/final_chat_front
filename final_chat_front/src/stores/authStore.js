import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    change: false,
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    setChange: (status) => set({ change: status }),
    logout: () => {
        Cookies.remove('isLoggedIn'); // Remove the token cookie if still exist
        set({ isLoggedIn: false });
    },
    checkLoginStatus: () => {
        const token = Cookies.get('isLoggedIn'); // Check for the token cookie
        set({ isLoggedIn: !!token });
    },
}));

export default useAuthStore;