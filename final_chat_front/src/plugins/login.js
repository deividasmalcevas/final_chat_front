import Cookies from 'js-cookie';

export const checkLoginStatus = () => {
    return Cookies.get('isLoggedIn') === 'true'; // Assuming 'isLoggedIn' is a string 'true'
};
