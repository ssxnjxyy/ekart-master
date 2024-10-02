// context/AuthContext.js
import { API_ROUTES } from '@/apis/routes';
import  { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { requestInterceptor } from '@/components/requestInterceptor';
import { BASE_URL } from '@/apis/baseurl';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
const router =useRouter()

  // Get token from localStorage
  const getToken = () => {
    console.log('Get token from localStorage')
    return localStorage.getItem('token');
  };
  // console.log(user)

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Fetch user data based on the token (similar to before)
      fetch(`${BASE_URL}/api/user/details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        requestInterceptor(data.token)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., clear invalid token)
        // localStorage.removeItem('token');
      });
    }
    else{
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {

    try {
      const response = await fetch(`${BASE_URL}${API_ROUTES.USER_LOGIN}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.is_error) {
        const data = await response.json();

        // Store token in localStorage
        localStorage.setItem('token', data.token); 

        setUser(data.user);
        return data; // Indicate successful login
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
        // return false
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    router.push('/')
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };