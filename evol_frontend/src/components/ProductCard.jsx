import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import { formatPrice } from '../utils/recommendationLogic';

const ProductCard = ({ product, onClick }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useAppStore();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const isInWishlist = wishlist.some(item => item.id === product.id);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('❤️ Wishlist toggle clicked for:', product.name);
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => {
        console.log('🎯 ProductCard clicked:', product);
        console.log('🎯 Product ID type:', typeof product.id, product.id);
        onClick(product);
      }}
      style={{
        cursor: 'pointer',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        maxWidth: windowWidth >= 1200 ? '320px' : windowWidth >= 768 ? '280px' : '100%',
        width: '100%',
        margin: '0 auto',
        ':hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Product Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}>
        <img 
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            // Show a simple placeholder if ML API image fails
            e.target.style.display = 'none';
            e.target.parentElement.style.backgroundColor = '#f3f4f6';
            e.target.parentElement.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280; font-size: 14px;">
                Image from ML API
              </div>
            `;
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: 'absolute',
            top: windowWidth >= 768 ? '12px' : '8px',
            right: windowWidth >= 768 ? '12px' : '8px',
            width: windowWidth >= 768 ? '32px' : '28px',
            height: windowWidth >= 768 ? '32px' : '28px',
            backgroundColor: 'white',
            borderRadius: '50%',
            border: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg 
            style={{
              width: windowWidth >= 768 ? '16px' : '14px',
              height: windowWidth >= 768 ? '16px' : '14px',
              color: isInWishlist ? '#ef4444' : '#9ca3af',
              fill: isInWishlist ? 'currentColor' : 'none',
              stroke: 'currentColor',
              transition: 'color 0.2s ease'
            }}
            viewBox="0 0 24 24"
            onMouseEnter={(e) => {
              if (!isInWishlist) {
                e.target.style.color = '#ef4444';
              }
            }}
            onMouseLeave={(e) => {
              if (!isInWishlist) {
                e.target.style.color = '#9ca3af';
              }
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div style={{
        padding: windowWidth >= 1200 ? '16px 12px' : windowWidth >= 768 ? '12px 8px' : '8px 6px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontWeight: 'normal',
          color: '#1f2937',
          fontSize: windowWidth >= 1200 ? '15px' : windowWidth >= 768 ? '14px' : '13px',
          marginBottom: '4px',
          lineHeight: '1.4',
          margin: '0 0 4px 0'
        }}>
          {product.name}
        </h3>
        <p style={{
          fontSize: windowWidth >= 1200 ? '14px' : windowWidth >= 768 ? '13px' : '12px',
          fontWeight: '500',
          color: '#4b5563',
          margin: 0
        }}>
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;