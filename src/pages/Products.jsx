// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiService } from '../services/aiServices';
import ProductCard from '../components/products/ProductCard';
import { Filter, Search } from 'lucide-react';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const results = await aiService.intelligentSearch(
                searchParams.get('search') || '',
                {
                    category: searchParams.get('category'),
                    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
                    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null
                }
            );
            setProducts(results);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams({ search: searchQuery });
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        updateSearchParams({ ...newFilters, search: searchQuery });
    };

    const updateSearchParams = (params) => {
        const newParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) newParams.set(key, value);
        });
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: ''
        });
        setSearchQuery('');
        setSearchParams({});
    };

    const categories = ['electronics', 'food', 'furniture'];

    return (
        <div className="products-page">
          <div className="container">
            <div className="page-header">
              <h1>Products</h1>
              <p>Discover amazing products with AI-powered search</p>
            </div>

            {/* Search and Filters */}
            <div className="search-filter-section">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search products with AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <Search size={20} />
                </button>
              </form>

              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="filter-panel">
                  <div className="filter-group">
                    <label>Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  <button onClick={clearFilters} className="clear-filters">
                    Clear All Filters
                  </button>
                </div>
            )}

            {/* Results */}
            <div className="products-section">
              {loading ? (
                  <div className="loading-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="product-card-skeleton"></div>
                    ))}
                  </div>
              ) : (
                  <>
                    <div className="results-header">
                      <p>{products.length} products found</p>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="products-grid">
                          {products.map(product => (
                              <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                    ) : (
                        <div className="no-results">
                          <p>No products found matching your criteria.</p>
                          <button onClick={clearFilters} className="clear-filters">
                            Clear Filters
                          </button>
                        </div>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>
    );
};

export default Products;
