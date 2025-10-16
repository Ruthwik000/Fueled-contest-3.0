import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/appStore';

const CartModal = () => {
  const { 
    showCart, 
    cart, 
    toggleCart, 
    removeFromCart, 
    updateCartQuantity,
    selectProduct 
  } = useAppStore();

  const handleProductClick = (product) => {
    selectProduct(product);
    toggleCart();
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <AnimatePresence>
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50"
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <button 
              onClick={toggleCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
                fontSize: '16px',
                marginRight: '16px'
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Your Cart
            </h2>
          </div>

          {/* Cart Header Info */}
          {cart.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 20px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                PRODUCT
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                TOTAL
              </span>
            </div>
          )}

          {/* Content */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            padding: '20px'
          }}>
            {cart.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                textAlign: 'center'
              }}>
                <svg style={{ width: '64px', height: '64px', color: '#d1d5db', marginBottom: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Your cart is empty
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  Add some beautiful jewelry to get started
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      paddingBottom: '24px',
                      borderBottom: '1px solid #f3f4f6'
                    }}
                  >
                    {/* Product Image */}
                    <div 
                      onClick={() => handleProductClick(item)}
                      style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '12px',
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
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h3 
                          onClick={() => handleProductClick(item)}
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#111827',
                            cursor: 'pointer',
                            margin: 0,
                            flex: 1,
                            paddingRight: '16px'
                          }}
                        >
                          {item.name}
                        </h3>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0,
                          whiteSpace: 'nowrap'
                        }}>
                          Rs. {(item.price * item.quantity).toLocaleString('en-IN')} INR
                        </p>
                      </div>

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
                        margin: '0 0 16px 0'
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

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #d1d5db',
                              backgroundColor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{ fontSize: '16px', color: '#6b7280' }}>-</span>
                          </button>
                          
                          <span style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            minWidth: '32px',
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #d1d5db',
                              backgroundColor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{ fontSize: '16px', color: '#6b7280' }}>+</span>
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            padding: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280'
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
      )}
    </AnimatePresence>
  );
};

export default CartModal;