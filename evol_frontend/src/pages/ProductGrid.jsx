import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
// Removed unused imports - using ML recommendations only
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const ProductGrid = () => {
  const navigate = useNavigate();
  const {
    selectedCelebrity,
    selectedCategory,
    selectProduct,
    recommendations
  } = useAppStore();

  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProductSelect = (product) => {
    console.log('🚀 ProductGrid - handleProductSelect called with:', product);
    console.log('🚀 Product ID:', product.id, 'Type:', typeof product.id);
    selectProduct(product);
    console.log('🚀 Navigating to:', `/product/${product.id}`);
    navigate(`/product/${product.id}`);
  };

  // Use ML recommendations only - no fallback to mock data
  const productsToUse = recommendations.products;
  
  // Debug logging
  console.log('💎 ProductGrid - Recommendations:', recommendations);
  console.log('💎 ProductGrid - Products to use:', productsToUse);
  console.log('💎 ProductGrid - Selected Category:', selectedCategory);
  console.log('💎 ProductGrid - Filter By:', filterBy);

  // Apply filtering and sorting
  let filteredProducts = [...productsToUse];

  // Category mapping to handle different naming conventions
  const normalizeCategoryName = (category) => {
    if (!category) return '';
    
    const normalized = category.toLowerCase().trim();
    
    // Map ML API categories to UI categories (using plural forms to match filter dropdown)
    const categoryMap = {
      // Necklaces (including chokers)
      'necklace': 'NECKLACES',
      'necklaces': 'NECKLACES',
      'choker': 'NECKLACES',
      'chokers': 'NECKLACES',
      'neck piece': 'NECKLACES',
      'neckpiece': 'NECKLACES',
      'chain': 'NECKLACES',
      'chains': 'NECKLACES',
      
      // Earrings
      'earring': 'EARRINGS',
      'earrings': 'EARRINGS',
      'ear ring': 'EARRINGS',
      'studs': 'EARRINGS',
      'stud': 'EARRINGS',
      'hoops': 'EARRINGS',
      'hoop': 'EARRINGS',
      'drops': 'EARRINGS',
      'drop': 'EARRINGS',
      'chandelier': 'EARRINGS',
      
      // Rings (exact match for ML API)
      'ring': 'RINGS',
      'rings': 'RINGS',
      'band': 'RINGS',
      'bands': 'RINGS',
      'finger ring': 'RINGS',
      'solitaire': 'RINGS',
      'engagement ring': 'RINGS',
      'wedding ring': 'RINGS',
      
      // Bracelets (exact match for ML API)
      'bracelet': 'BRACELETS',
      'bracelets': 'BRACELETS',
      'bangle': 'BRACELETS',
      'bangles': 'BRACELETS',
      'wrist band': 'BRACELETS',
      'wristband': 'BRACELETS',
      'cuff': 'BRACELETS',
      'cuffs': 'BRACELETS',
      
      // Pendants
      'pendant': 'PENDANTS',
      'pendants': 'PENDANTS',
      'locket': 'PENDANTS',
      'lockets': 'PENDANTS',
      'charm': 'PENDANTS',
      'charms': 'PENDANTS'
    };
    
    const mapped = categoryMap[normalized];
    if (!mapped) {
      console.log('⚠️ Unknown category:', category, 'normalized:', normalized);
      // Try to guess the category based on common patterns
      if (normalized.includes('ear')) return 'EARRINGS';
      if (normalized.includes('ring')) return 'RINGS';
      if (normalized.includes('bracelet') || normalized.includes('bangle')) return 'BRACELETS';
      if (normalized.includes('pendant') || normalized.includes('charm')) return 'PENDANTS';
      if (normalized.includes('neck') || normalized.includes('chain')) return 'NECKLACES';
      
      return category.toUpperCase();
    }
    return mapped;
  };

  // Debug: Log all product categories before filtering
  console.log('💎 All products with categories:', productsToUse.map(p => ({ 
    name: p.name, 
    rawCategory: p.category, 
    normalized: normalizeCategoryName(p.category) 
  })));
  
  // Debug: Count products by category
  const categoryCount = {};
  productsToUse.forEach(p => {
    const normalized = normalizeCategoryName(p.category);
    categoryCount[normalized] = (categoryCount[normalized] || 0) + 1;
  });
  console.log('💎 Products by category:', categoryCount);

  // Apply category filter - prioritize selectedCategory from store over local filterBy
  const categoryToFilter = selectedCategory || filterBy;
  if (categoryToFilter && categoryToFilter !== 'All') {
    console.log('💎 Filtering by category:', categoryToFilter);
    console.log('💎 Total products before filter:', productsToUse.length);
    
    // Debug: Show what we're looking for
    const normalizedFilter = normalizeCategoryName(categoryToFilter);
    console.log('💎 Looking for normalized category:', normalizedFilter);
    
    filteredProducts = filteredProducts.filter(product => {
      const productCategory = normalizeCategoryName(product.category);
      const filterCategory = normalizedFilter;
      const matches = productCategory === filterCategory;
      
      if (matches) {
        console.log('✅ MATCH - Product:', product.name, 'Category:', product.category, '→', productCategory);
      } else {
        console.log('❌ NO MATCH - Product:', product.name, 'Category:', product.category, '→', productCategory, 'Expected:', filterCategory);
      }
      
      return matches;
    });
    
    console.log('💎 Total products after filter:', filteredProducts.length);
    console.log('💎 Filtered products:', filteredProducts.map(p => ({ name: p.name, category: p.category })));
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
  }

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
  };

  const handleFilterChange = (filterOption) => {
    console.log('🔧 Filter changed to:', filterOption);
    setFilterBy(filterOption);
    setShowFilterDropdown(false);
    
    // If "All" is selected, clear the selected category from store
    if (filterOption === 'All') {
      // We could call viewAllProducts() here, but let's keep it simple
      // and just use local state for manual filtering
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}
      onClick={() => {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
      }}
    >
      {/* Header */}
      <Header showCartAndWishlist={true} />

      {/* Hero Section - Celebrity Photo Display */}
      {selectedCelebrity && (
        <div style={{
          position: 'relative',
          height: windowWidth >= 1600 ? '550px' : windowWidth >= 1200 ? '500px' : windowWidth >= 768 ? '350px' : '240px',
          overflow: 'hidden',
          borderRadius: '16px',
          margin: windowWidth >= 1200 ? '20px 40px' : windowWidth >= 768 ? '16px 24px' : '12px 16px',
          marginBottom: windowWidth >= 768 ? '32px' : '24px'
        }}>
          <img
            src={selectedCelebrity.image}
            alt={selectedCelebrity.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%' // Position to show face better
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDQwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iOTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjUwMCI+Q2VsZWJyaXR5IEltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+Cg==';
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white',
              marginTop: windowWidth >= 1600 ? '100px' : windowWidth >= 1200 ? '90px' : windowWidth >= 768 ? '75px' : '50px'
            }}>
              <h1 style={{
                fontSize: windowWidth >= 1200 ? '28px' : windowWidth >= 768 ? '24px' : '20px',
                fontFamily: 'serif',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                margin: 0
              }}>
                INSPIRED BY {selectedCelebrity.name.toUpperCase()}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{
        padding: windowWidth >= 1200 ? '20px 32px' : windowWidth >= 768 ? '16px 24px' : '12px 16px',
        backgroundColor: '#f9fafb',
        margin: windowWidth >= 1200 ? '0 40px 32px 40px' : windowWidth >= 768 ? '0 24px 24px 24px' : '0 16px 20px 16px',
        borderRadius: '8px',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}>
            {/* Filter By Dropdown */}
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Filter By {(selectedCategory || filterBy) && `(${selectedCategory || filterBy})`}</span>
              </button>
              
              {showFilterDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  minWidth: '150px',
                  marginTop: '4px'
                }}>
                  {['All', 'NECKLACES', 'EARRINGS', 'RINGS', 'BRACELETS', 'PENDANTS'].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange(category)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 12px',
                        textAlign: 'left',
                        border: 'none',
                        background: (selectedCategory === category || filterBy === category) ? '#f3f4f6' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Sort by</span>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSortDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  minWidth: '180px',
                  marginTop: '4px'
                }}>
                  {[
                    { value: 'price-low-high', label: 'Price: Low to High' },
                    { value: 'price-high-low', label: 'Price: High to Low' },
                    { value: 'name-a-z', label: 'Name: A to Z' },
                    { value: 'name-z-a', label: 'Name: Z to A' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 12px',
                        textAlign: 'left',
                        border: 'none',
                        background: sortBy === option.value ? '#f3f4f6' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <span style={{
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {filteredProducts.length} Products
          </span>
        </div>
      </div>

      {/* Products Grid - Responsive Layout */}
      <div style={{
        padding: windowWidth >= 1200 ? '0 40px 40px 40px' : windowWidth >= 768 ? '0 24px 32px 24px' : '0 16px 24px 16px',
        maxWidth: windowWidth >= 1600 ? '1600px' : '100%',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: windowWidth >= 1600 ? 'repeat(auto-fit, minmax(280px, 1fr))' : 
                                windowWidth >= 1200 ? 'repeat(auto-fit, minmax(250px, 1fr))' : 
                                windowWidth >= 768 ? 'repeat(auto-fit, minmax(200px, 1fr))' : 
                                'repeat(2, 1fr)',
            gap: windowWidth >= 1200 ? '24px' : windowWidth >= 768 ? '20px' : '16px',
            justifyContent: 'center'
          }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <ProductCard
                product={product}
                onClick={handleProductSelect}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 0'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '18px',
              marginBottom: '16px'
            }}>No personalized products available.</p>
            <p style={{
              color: '#9ca3af',
              fontSize: '16px'
            }}>Please complete the survey to get ML-powered recommendations.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductGrid;