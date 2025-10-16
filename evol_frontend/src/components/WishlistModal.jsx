import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/appStore';

const WishlistModal = () => {
  const { 
    showWishlist, 
    wishlist, 
    toggleWishlist, 
    removeFromWishlist, 
    addToCart,
    selectProduct 
  } = useAppStore();

  const handleProductClick = (product) => {
    selectProduct(product);
    toggleWishlist();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <AnimatePresence>
      {showWishlist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleWishlist}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          {/* Centered Modal */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.3, 
              y: -50,
              rotateX: -15
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 20,
              rotateX: 10
            }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.4
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              transformStyle: 'preserve-3d',
              margin: 'auto'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg style={{ width: '24px', height: '24px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  WISHLIST
                </h2>
              </div>
              
              <button 
                onClick={toggleWishlist}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  color: '#6b7280'
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{
              maxHeight: 'calc(80vh - 80px)',
              overflowY: 'auto',
              padding: '20px 24px'
            }}>
              {wishlist.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center'
                }}>
                  <svg style={{ width: '64px', height: '64px', color: '#d1d5db', marginBottom: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    Your wishlist is empty
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    Save items you love to your wishlist
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        border: '1px solid #f3f4f6',
                        borderRadius: '12px',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      {/* Product Image */}
                      <div 
                        onClick={() => handleProductClick(item)}
                        style={{
                          width: '100px',
                          height: '100px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <img 
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 
                          onClick={() => handleProductClick(item)}
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#111827',
                            cursor: 'pointer',
                            margin: '0 0 8px 0'
                          }}
                        >
                          {item.name}
                        </h3>
                        
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 4px 0'
                        }}>
                          Rs. {item.price.toLocaleString('en-IN')} INR
                        </p>
                        
                        <p style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          margin: '0 0 4px 0'
                        }}>
                          Purity: {item.purity}
                        </p>

                        <p style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          margin: '0 0 16px 0'
                        }}>
                          Color: {item.color}
                        </p>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginTop: 'auto'
                        }}>
                          <button
                            onClick={() => handleAddToCart(item)}
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              backgroundColor: '#000000',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            ADD TO CART
                          </button>
                          
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            style={{
                              padding: '8px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#6b7280',
                              borderRadius: '4px'
                            }}
                          >
                            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistModal;