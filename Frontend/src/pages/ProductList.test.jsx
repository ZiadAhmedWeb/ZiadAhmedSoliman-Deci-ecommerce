import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import ProductList from './ProductList';

function renderProductList() {
  render(
    <BrowserRouter>
      <ProductList />
    </BrowserRouter>
  );
}

describe('ProductList page', () => {
  test('renders products from the mocked API', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.getByText('Mock Shirt')).toBeInTheDocument();
      expect(screen.getByText('Mock Shorts')).toBeInTheDocument();
    });
  });

  test('renders the search input', () => {
    renderProductList();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });
});