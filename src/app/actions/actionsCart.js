// action types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREMENT_QTY = 'INCREMENT_QTY';
export const DECREMENT_QTY = 'DECREMENT_QTY';
export const CLEAR_CART = 'CLEAR_CART'; // Action for clearing the cart

// Add product to cart action
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

// Remove product from cart action
export const removeFromCart = (productId, selectedSize) => ({
  type: REMOVE_FROM_CART,
  payload: { productId, selectedSize }, // Include productId and selectedSize
});

// Increment quantity of a product in the cart
export const incrementQty = (productId, selectedSize) => ({
  type: INCREMENT_QTY,
  payload: { productId, selectedSize }, // Include productId and selectedSize
});

// Decrement quantity of a product in the cart
export const decrementQty = (productId, selectedSize) => ({
  type: DECREMENT_QTY,
  payload: { productId, selectedSize }, // Include productId and selectedSize
});

// Clear the entire cart
export const clearCart = () => ({
  type: CLEAR_CART,
});
