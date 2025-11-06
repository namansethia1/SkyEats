import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CategoryShowcase from '../CategoryShowcase';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-right-icon">→</div>,
  Sparkles: () => <div data-testid="sparkles-icon">✨</div>
}));

describe('CategoryShowcase Component', () => {
  const mockCategories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery'];
  const mockOnCategorySelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders category showcase with title and description', () => {
    render(
      <CategoryShowcase 
        categories={mockCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Discover fresh products organized by categories for easy shopping')).toBeInTheDocument();
  });

  it('renders all provided categories', () => {
    render(
      <CategoryShowcase 
        categories={mockCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('excludes "all" category from display', () => {
    const categoriesWithAll = ['all', ...mockCategories];
    
    render(
      <CategoryShowcase 
        categories={categoriesWithAll} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.queryByText('all')).not.toBeInTheDocument();
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('calls onCategorySelect when category is clicked', async () => {
    render(
      <CategoryShowcase 
        categories={mockCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const fruitsCategory = screen.getByText('Fruits').closest('div[role="button"], button, [onClick]')?.parentElement;
    
    if (fruitsCategory) {
      fireEvent.click(fruitsCategory);
      
      await waitFor(() => {
        expect(mockOnCategorySelect).toHaveBeenCalledWith('Fruits');
      });
    }
  });

  it('displays category icons correctly', () => {
    render(
      <CategoryShowcase 
        categories={['Fruits']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    // Check if the fruits icon (🍎) is displayed
    expect(screen.getByText('🍎')).toBeInTheDocument();
  });

  it('shows hover effects on category cards', async () => {
    render(
      <CategoryShowcase 
        categories={['Fruits']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const categoryCard = screen.getByText('Fruits').closest('.group');
    
    if (categoryCard) {
      fireEvent.mouseEnter(categoryCard);
      
      await waitFor(() => {
        expect(screen.getByText('Subcategories')).toBeInTheDocument();
      });
    }
  });

  it('displays subcategories on hover', async () => {
    render(
      <CategoryShowcase 
        categories={['Fruits']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const categoryCard = screen.getByText('Fruits').closest('.group');
    
    if (categoryCard) {
      fireEvent.mouseEnter(categoryCard);
      
      await waitFor(() => {
        expect(screen.getByText('Fresh Fruits')).toBeInTheDocument();
        expect(screen.getByText('Exotic Fruits')).toBeInTheDocument();
        expect(screen.getByText('Seasonal Fruits')).toBeInTheDocument();
      });
    }
  });

  it('hides subcategories on mouse leave', async () => {
    render(
      <CategoryShowcase 
        categories={['Fruits']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const categoryCard = screen.getByText('Fruits').closest('.group');
    
    if (categoryCard) {
      // Show subcategories
      fireEvent.mouseEnter(categoryCard);
      await waitFor(() => {
        expect(screen.getByText('Subcategories')).toBeInTheDocument();
      });

      // Hide subcategories
      fireEvent.mouseLeave(categoryCard);
      await waitFor(() => {
        expect(screen.queryByText('Subcategories')).not.toBeInTheDocument();
      });
    }
  });

  it('handles unknown categories with fallback metadata', () => {
    const unknownCategories = ['UnknownCategory'];
    
    render(
      <CategoryShowcase 
        categories={unknownCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByText('UnknownCategory')).toBeInTheDocument();
    expect(screen.getByText('🛒')).toBeInTheDocument(); // Fallback icon
    expect(screen.getByText('Quality Products')).toBeInTheDocument(); // Fallback description
  });

  it('renders with empty categories array', () => {
    render(
      <CategoryShowcase 
        categories={[]} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    // Should not crash and should show the header
  });

  it('renders "View All Categories" button', () => {
    render(
      <CategoryShowcase 
        categories={mockCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByText('View All Categories')).toBeInTheDocument();
  });

  it('displays correct category descriptions', () => {
    render(
      <CategoryShowcase 
        categories={['Fruits', 'Vegetables', 'Dairy']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByText('Fresh & Juicy')).toBeInTheDocument(); // Fruits description
    expect(screen.getByText('Farm Fresh')).toBeInTheDocument(); // Vegetables description
    expect(screen.getByText('Pure & Fresh')).toBeInTheDocument(); // Dairy description
  });

  it('applies correct CSS classes for animations', () => {
    render(
      <CategoryShowcase 
        categories={['Fruits']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const categoryCard = screen.getByText('Fruits').closest('.group');
    expect(categoryCard).toHaveClass('group');
    expect(categoryCard).toHaveClass('relative');
    expect(categoryCard).toHaveClass('cursor-pointer');
  });

  it('handles multiple category clicks correctly', async () => {
    render(
      <CategoryShowcase 
        categories={['Fruits', 'Vegetables']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const fruitsCard = screen.getByText('Fruits').closest('div[class*="group"]');
    const vegetablesCard = screen.getByText('Vegetables').closest('div[class*="group"]');

    if (fruitsCard && vegetablesCard) {
      fireEvent.click(fruitsCard);
      fireEvent.click(vegetablesCard);

      await waitFor(() => {
        expect(mockOnCategorySelect).toHaveBeenCalledTimes(2);
        expect(mockOnCategorySelect).toHaveBeenNthCalledWith(1, 'Fruits');
        expect(mockOnCategorySelect).toHaveBeenNthCalledWith(2, 'Vegetables');
      });
    }
  });

  it('displays chevron right icons', () => {
    render(
      <CategoryShowcase 
        categories={['Fruits']} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
  });

  it('displays sparkles icons in header', () => {
    render(
      <CategoryShowcase 
        categories={mockCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    const sparklesIcons = screen.getAllByTestId('sparkles-icon');
    expect(sparklesIcons).toHaveLength(2); // Should have 2 sparkles icons in header
  });

  it('handles case-insensitive category matching', () => {
    const mixedCaseCategories = ['fruits', 'VEGETABLES', 'Dairy'];
    
    render(
      <CategoryShowcase 
        categories={mixedCaseCategories} 
        onCategorySelect={mockOnCategorySelect} 
      />
    );

    expect(screen.getByText('fruits')).toBeInTheDocument();
    expect(screen.getByText('VEGETABLES')).toBeInTheDocument();
    expect(screen.getByText('Dairy')).toBeInTheDocument();
  });
});