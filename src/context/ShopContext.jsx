import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ShopContext = createContext();

// Custom hook to use the shop context
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};

// Provider component
export const ShopProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  // Initialize selected items state
  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      const savedSelected = localStorage.getItem('selectedItems');
      // If there are saved selected items, use them, otherwise select all items by default
      if (savedSelected) {
        return JSON.parse(savedSelected);
      } else {
        // By default, select all items in the cart
        return cart.map(item => item.id);
      }
    } catch (error) {
      console.error('Error loading selected items from localStorage:', error);
      return cart.map(item => item.id);
    }
  });
  

  
  // Save cart to localStorage when it changes
  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // When cart changes, update selected items to include any new items
    setSelectedItems(prevSelected => {
      const newSelected = [...prevSelected];
      // Add any new items to selected by default
      cart.forEach(item => {
        if (!newSelected.includes(item.id)) {
          newSelected.push(item.id);
        }
      });
      // Remove any selected items that are no longer in the cart
      return newSelected.filter(id => cart.some(item => item.id === id));
    });
  }, [cart]);
  
  // Save selected items to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);
  

  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };
  
  // Update item quantity in cart
  const updateCartItemQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  

  
  // Toggle item selection
  const toggleItemSelection = (id) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  
  // Check if an item is selected
  const isItemSelected = (id) => {
    return selectedItems.includes(id);
  };
  
  // Select all items
  const selectAllItems = () => {
    setSelectedItems(cart.map(item => item.id));
  };
  
  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems([]);
  };
  
  // Calculate cart totals (only for selected items)
  const getCartTotals = () => {
    const subtotal = cart
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10.99 : 0; // Free shipping over $100 could be implemented here
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shipping + tax;
    
    return {
      subtotal,
      shipping,
      tax,
      total
    };
  };
  
  // Get selected items
  const getSelectedItems = () => {
    return cart.filter(item => selectedItems.includes(item.id));
  };
  

  
  // Context value
  const value = {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    toggleItemSelection,
    isItemSelected,
    selectAllItems,
    deselectAllItems,
    getSelectedItems,
    selectedItems
  };
  
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};