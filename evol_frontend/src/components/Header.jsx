import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

const Header = ({ 
  showBackButton = true, 
  showCartAndWishlist = false, 
  customRightContent = null,
  className = "",
  backTo = null
}) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { 
    toggleCart, 
    toggleWishlist, 
    cart, 
    wishlist 
  } = useAppStore();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <div className="bg-white">
      <div 
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px'} 24px`
        }}
      >
        {/* Left side - Back button (conditional) */}
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {!showBackButton && <div style={{ width: '88px' }}></div>}
        </div>

        {/* Center - Logo */}
        <img 
          src="/images/logo.png" 
          alt="EVOL" 
          style={{
            height: windowWidth >= 1200 ? '80px' : windowWidth >= 768 ? '72px' : '64px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />

        {/* Right side - Wishlist and Cart icons (conditional) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {showCartAndWishlist ? (
            <>
              {/* Wishlist Icon */}
              <button 
                onClick={toggleWishlist}
                style={{
                  position: 'relative',
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              {/* Cart Icon */}
              <button 
                onClick={toggleCart}
                style={{
                  position: 'relative',
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
                </svg>
                {cart.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#d97706',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </>
          ) : (
            <div style={{ width: '88px' }}></div>
          )}
        </div>
      </div>
      
      {/* Thin line below header */}
      <div className="w-full h-px bg-gray-200"></div>
    </div>
  );
};

export default Header;