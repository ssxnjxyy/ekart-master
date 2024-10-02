import { requestInterceptor } from '@/components/requestInterceptor';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuthModal } from './AuthModalContext';
import { BASE_URL } from '@/apis/baseurl';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    case 'ADD_TO_CART':
      return [...state, { ...action.payload }];
    case 'UPDATE_CART':
      return state.map(item => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item);
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.payload.id);
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const {openModal} =useAuthModal()
   const fetchCartItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/items`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        },
      });
      console.log(response)
      if (response.status==403) {
        openModal()
        throw new Error('Failed to fetch cart items');
      }
     

      const data = await response.json();
      dispatch({
        type: 'SET_CART',
        payload: data.cart_items,
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = async (product, quantity) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/add-item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      if (response.status==403) {
        openModal()
        throw new Error('Failed to add item to cart');
      }

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      fetchCartItems()
      dispatch({
        type: 'ADD_TO_CART',
        payload: { ...product, quantity },
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const updateCartItem = async (productId, operation) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/update-item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning':'true'
        },
        body: JSON.stringify({ product_id: productId, operation }),
      });
      if (response.status==403) {
        openModal()
        throw new Error('Failed to update cart item');
      }

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const data = await response.json();
      fetchCartItems()
      dispatch({
        type: 'UPDATE_CART',
        payload: { id: productId, quantity: data.quantity },
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const incrementCartItem = (productId) => updateCartItem(productId, 'add');
  const decrementCartItem = (productId) => updateCartItem(productId, 'sub');

  const removeFromCart = (id) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id },
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, incrementCartItem, decrementCartItem, removeFromCart ,fetchCartItems}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
