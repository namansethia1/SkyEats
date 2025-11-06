import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CartProvider, useCart } from '../CartContext';
import { AuthContext } from '../AuthContext';
import * as api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  cartAPI: {
    getCart: vi.fn(),
    addToCart: vi.fn(),
    updateCart: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
    getCartSummary: vi.fn()
  }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Test component that uses the cart context
const TestComponent = () => {
  const {
    cart,
    cartSummary,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isItemInCart,
    getItemQuantity
  } = useCart();

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="cart-items">{Object.keys(cart.items || {}).length}</div>
      <div data-testid="total-items">{cartSummary.totalItems}</div>
      <div data-testid="total-amount">{cartSummary.totalAmount}</div>
      <div data-testid="all-in-stock">{cartSummary.allInStock ? 'Yes' : 'No'}</div>
      
      <button onClick={() => addToCart('item1', 2)} data-testid="add-to-cart">
        Add to Cart
      </button>
      <button onClick={() => updateCartItem('item1', 3)} data-testid="update-cart">
        Update Cart
      </button>
      <button onClick={() => removeFromCart('item1')} data-testid="remove-from-cart">
        Remove from Cart
      </button>
      <button onClick={clearCart} data-testid="clear-cart">
        Clear Cart
      </button>
      
      <div data-testid="cart-count">{getCartItemCount()}</div>
      <div data-testid="cart-total">{getCartTotal()}</div>
      <div data-testid="item-in-cart">{isItemInCart('item1') ? 'Yes' : 'No'}</div>
      <div data-testid="item-quantity">{getItemQuantity('item1')}</div>
    </div>
  );
};

// Mock auth context
const mockAuthContext = {
  currentUser: { uid: 'test-user', email: 'test@example.com' },
  loading: false
};

const renderWithProviders = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <CartProvider>
        {component}
      </CartProvider>
    </AuthContext.Provider>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock responses
    api.cartAPI.getCart.mockResolvedValue({
      data: {
        items: {
          item1: {
            itemId: 'item1',
            name: 'Test Item',
            quantity: 2,
            price: 100,
            totalPrice: 200
          }
        }
      }
    });

    api.cartAPI.getCartSummary.mockResolvedValue({
      data: {
        totalItems: 2,
        totalAmount: 200,
        allInStock: true,
        itemCount: 1
      }
    });
  });

  it('provides initial cart state', async () => {
    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('cart-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('200');
    expect(screen.getByTestId('all-in-stock')).toHaveTextContent('Yes');
  });

  it('adds item to cart successfully', async () => {
    api.cartAPI.addToCart.mockResolvedValue({
      data: { success: true, message: 'Item added successfully' }
    });

    renderWithProviders(<TestComponent />);

    const addButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(api.cartAPI.addToCart).toHaveBeenCalledWith('item1', 2);
    });

    // Should refetch cart after adding
    expect(api.cartAPI.getCart).toHaveBeenCalled();
  });

  it('handles add to cart error', async () => {
    api.cartAPI.addToCart.mockRejectedValue({
      response: { data: 'Insufficient stock' }
    });

    renderWithProviders(<TestComponent />);

    const addButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(api.cartAPI.addToCart).toHaveBeenCalledWith('item1', 2);
    });
  });

  it('updates cart item successfully', async () => {
    api.cartAPI.updateCart.mockResolvedValue({
      data: { success: true, message: 'Cart updated successfully' }
    });

    renderWithProviders(<TestComponent />);

    const updateButton = screen.getByTestId('update-cart');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(api.cartAPI.updateCart).toHaveBeenCalledWith('item1', 3);
    });

    // Should refetch cart after updating
    expect(api.cartAPI.getCart).toHaveBeenCalled();
  });

  it('removes item from cart successfully', async () => {
    api.cartAPI.removeFromCart.mockResolvedValue({});

    renderWithProviders(<TestComponent />);

    const removeButton = screen.getByTestId('remove-from-cart');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(api.cartAPI.removeFromCart).toHaveBeenCalledWith('item1');
    });

    // Should refetch cart after removing
    expect(api.cartAPI.getCart).toHaveBeenCalled();
  });

  it('clears cart successfully', async () => {
    api.cartAPI.clearCart.mockResolvedValue({});

    renderWithProviders(<TestComponent />);

    const clearButton = screen.getByTestId('clear-cart');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(api.cartAPI.clearCart).toHaveBeenCalled();
    });

    // Should refetch cart after clearing
    expect(api.cartAPI.getCart).toHaveBeenCalled();
  });

  it('provides correct cart utility functions', async () => {
    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('200');
      expect(screen.getByTestId('item-in-cart')).toHaveTextContent('Yes');
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
    });
  });

  it('handles empty cart state', async () => {
    api.cartAPI.getCart.mockResolvedValue({
      data: { items: {} }
    });

    api.cartAPI.getCartSummary.mockResolvedValue({
      data: {
        totalItems: 0,
        totalAmount: 0,
        allInStock: true,
        itemCount: 0
      }
    });

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-amount')).toHaveTextContent('0');
      expect(screen.getByTestId('item-in-cart')).toHaveTextContent('No');
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('0');
    });
  });

  it('does not fetch cart when user is not authenticated', () => {
    const noUserAuthContext = {
      currentUser: null,
      loading: false
    };

    render(
      <AuthContext.Provider value={noUserAuthContext}>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthContext.Provider>
    );

    expect(api.cartAPI.getCart).not.toHaveBeenCalled();
  });

  it('shows error toast when add to cart fails without user', async () => {
    const noUserAuthContext = {
      currentUser: null,
      loading: false
    };

    render(
      <AuthContext.Provider value={noUserAuthContext}>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthContext.Provider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addButton);

    // Should not call API when no user
    expect(api.cartAPI.addToCart).not.toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    api.cartAPI.getCart.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Should handle error gracefully and not crash
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
  });

  it('refetches cart when user changes', async () => {
    const { rerender } = renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(api.cartAPI.getCart).toHaveBeenCalledTimes(1);
    });

    // Change user
    const newAuthContext = {
      currentUser: { uid: 'new-user', email: 'new@example.com' },
      loading: false
    };

    rerender(
      <AuthContext.Provider value={newAuthContext}>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(api.cartAPI.getCart).toHaveBeenCalledTimes(2);
    });
  });

  it('clears cart state when user logs out', async () => {
    const { rerender } = renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-items')).toHaveTextContent('1');
    });

    // User logs out
    const noUserAuthContext = {
      currentUser: null,
      loading: false
    };

    rerender(
      <AuthContext.Provider value={noUserAuthContext}>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    });
  });

  it('handles concurrent cart operations', async () => {
    api.cartAPI.addToCart.mockResolvedValue({
      data: { success: true, message: 'Item added successfully' }
    });
    api.cartAPI.updateCart.mockResolvedValue({
      data: { success: true, message: 'Cart updated successfully' }
    });

    renderWithProviders(<TestComponent />);

    const addButton = screen.getByTestId('add-to-cart');
    const updateButton = screen.getByTestId('update-cart');

    // Trigger multiple operations
    fireEvent.click(addButton);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(api.cartAPI.addToCart).toHaveBeenCalled();
      expect(api.cartAPI.updateCart).toHaveBeenCalled();
    });
  });
});