import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import useAppStore from '../store/appStore';
// Removed mock data import - using ML recommendations only
import Header from '../components/Header';
import { getEmailJSConfig } from '../utils/emailConfig';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    recommendations
  } = useAppStore();

  const [selectedPurity, setSelectedPurity] = useState('14kt');
  const [selectedColor, setSelectedColor] = useState('YELLOW GOLD');
  const [showDescription, setShowDescription] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use ML recommendations only - no fallback to mock data
  const allProducts = recommendations.products;
  const productId = parseInt(id);
  const selectedProduct = allProducts.find(product => 
    product.id === productId || product.id === id || product.id === id.toString()
  );
  
  console.log('🔍 ProductDetail - Looking for product ID:', id, 'parsed:', productId);
  console.log('🔍 ProductDetail - Available products:', allProducts.map(p => ({ id: p.id, name: p.name })));
  console.log('🔍 ProductDetail - Found product:', selectedProduct);

  if (!selectedProduct) {
    return <Navigate to="/products" replace />;
  }

  const isInWishlist = wishlist.some(item => item.id === selectedProduct.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(selectedProduct.id);
    } else {
      addToWishlist(selectedProduct);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct);
  };

  const handleShare = () => {
    setShowShareModal(true);
    setShareStatus('');
    setShareEmail('');
    setShareMessage('');
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!shareEmail) return;

    setIsSharing(true);
    setShareStatus('');

    try {
      // Get EmailJS configuration
      const emailConfig = getEmailJSConfig();

      if (!emailConfig) {
        // Demo mode - simulate email sending
        console.log('Demo Mode: Email would be sent with the following details:');
        console.log({
          to_email: shareEmail,
          product_name: selectedProduct.name,
          product_price: `₹${selectedProduct.price.toLocaleString('en-IN')}`,
          product_image: selectedProduct.image.startsWith('http') ? selectedProduct.image : `${window.location.origin}${selectedProduct.image}`,
          product_url: window.location.href,
          purity: selectedPurity,
          color: selectedColor,
          message: shareMessage || 'Check out this beautiful jewelry piece!'
        });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShareStatus('demo');
      } else {
        // Real EmailJS implementation - All required parameters
        const templateParams = {
          to_name: shareEmail.split('@')[0], // Name part of email
          email: shareEmail, // Match your template's {{email}}
          to_email: shareEmail,
          reply_to: shareEmail,
          product_name: selectedProduct.name,
          product_price: `₹${selectedProduct.price.toLocaleString('en-IN')}`,
          product_image: selectedProduct.image.startsWith('http') ? selectedProduct.image : `${window.location.origin}${selectedProduct.image}`,
          product_url: window.location.href,
          purity: selectedPurity,
          color: selectedColor,
          message: shareMessage || 'Check out this beautiful jewelry piece!',
          from_name: emailConfig.fromName
        };

        console.log('Sending email with params:', templateParams);
        console.log('EmailJS config:', {
          serviceId: emailConfig.serviceId,
          templateId: emailConfig.templateId,
          publicKey: emailConfig.publicKey?.substring(0, 5) + '...' // Only show first 5 chars for security
        });
        console.log('Template variables being sent:', Object.keys(templateParams));
        console.log('Product image URL:', templateParams.product_image);

        // EmailJS send with explicit recipient
        await emailjs.send(
          emailConfig.serviceId, 
          emailConfig.templateId, 
          templateParams, 
          {
            publicKey: emailConfig.publicKey,
            limitRate: {
              id: 'app',
              throttle: 10000,
            },
          }
        );
        setShareStatus('success');
      }

      setTimeout(() => {
        setShowShareModal(false);
        setShareStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
      
      // More specific error handling
      if (error.status === 422) {
        console.error('EmailJS 422 Error - Template parameter mismatch or invalid template');
        console.error('Check that your EmailJS template uses these variables:', Object.keys({
          to_email: shareEmail,
          product_name: selectedProduct.name,
          product_price: `₹${selectedProduct.price.toLocaleString('en-IN')}`,
          product_image: selectedProduct.image,
          product_url: window.location.href,
          purity: selectedPurity,
          color: selectedColor,
          message: shareMessage || 'Check out this beautiful jewelry piece!',
          from_name: 'EVOL Jewels'
        }));
      }
      
      setShareStatus('error');
    } finally {
      setIsSharing(false);
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareStatus('');
    setShareEmail('');
    setShareMessage('');
  };

  // Product info for desktop right column
  const renderProductInfo = () => (
    <>
      {/* Purity Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: windowWidth >= 1200 ? '14px' : '12px',
          fontWeight: '500',
          color: '#6b7280',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          PURITY
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['14kt', '18kt'].map((purity) => (
            <button
              key={purity}
              onClick={() => setSelectedPurity(purity)}
              style={{
                padding: windowWidth >= 1200 ? '12px 20px' : '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: selectedPurity === purity ? '#f3f4f6' : 'white',
                color: '#374151',
                fontSize: windowWidth >= 1200 ? '16px' : '14px',
                cursor: 'pointer'
              }}
            >
              {purity}
            </button>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: windowWidth >= 1200 ? '14px' : '12px',
          fontWeight: '500',
          color: '#6b7280',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          COLOR
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['YELLOW GOLD', 'ROSE GOLD', 'WHITE GOLD'].map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                padding: windowWidth >= 1200 ? '12px 16px' : '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: selectedColor === color ? '#f3f4f6' : 'white',
                color: '#374151',
                fontSize: windowWidth >= 1200 ? '14px' : '12px',
                cursor: 'pointer'
              }}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // Action buttons for desktop full width section
  const renderActionButtons = () => (
    <>
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: windowWidth >= 1200 ? '20px' : '16px',
          backgroundColor: '#000000',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: windowWidth >= 1200 ? '18px' : '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: windowWidth >= 1200 ? '20px' : '16px'
        }}
      >
        ADD TO CART
      </button>

      {/* Product Description */}
      <div style={{
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: windowWidth >= 1200 ? '16px' : '12px'
      }}>
        <button
          onClick={() => setShowDescription(!showDescription)}
          style={{
            width: '100%',
            padding: windowWidth >= 1200 ? '20px' : '16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <span style={{ 
            fontSize: windowWidth >= 1200 ? '16px' : '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            PRODUCT DESCRIPTION
          </span>
          <svg
            style={{
              width: windowWidth >= 1200 ? '20px' : '16px',
              height: windowWidth >= 1200 ? '20px' : '16px',
              transform: showDescription ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Expandable Description Content */}
        {showDescription && (
          <div style={{
            padding: `0 ${windowWidth >= 1200 ? '20px' : '16px'} ${windowWidth >= 1200 ? '20px' : '16px'}`,
            borderTop: '1px solid #f3f4f6',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            <div style={{
              fontSize: windowWidth >= 1200 ? '15px' : '14px',
              lineHeight: '1.6',
              color: '#4b5563'
            }}>
              <p style={{ margin: '0 0 12px 0' }}>
                This exquisite piece features premium diamonds carefully selected for their exceptional brilliance and clarity. 
                Each stone is expertly set to maximize light reflection and create stunning sparkle.
              </p>
              <p style={{ margin: '0 0 12px 0' }}>
                <strong>Key Features:</strong>
              </p>
              <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
                <li>Premium quality diamonds with excellent cut and clarity</li>
                <li>Handcrafted by skilled artisans with attention to detail</li>
                <li>Available in multiple gold options for personalization</li>
                <li>Comes with authenticity certificate and warranty</li>
                <li>Perfect for special occasions or everyday elegance</li>
              </ul>
              <p style={{ margin: '0' }}>
                <strong>Care Instructions:</strong> Clean gently with a soft brush and mild soap. Store in provided jewelry box to maintain shine and prevent scratches.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Time */}
      <div style={{
        padding: windowWidth >= 1200 ? '20px' : '16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: '24px'
      }}>
        <span style={{ 
          fontSize: windowWidth >= 1200 ? '16px' : '14px', 
          fontWeight: '500', 
          color: '#374151' 
        }}>
          DELIVERY TIME - {selectedProduct.deliveryTime}
        </span>
      </div>
    </>
  );

  // Mobile shared content (all together)
  const renderMobileContent = () => (
    <>
      {renderProductInfo()}
      {renderActionButtons()}
    </>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Add CSS for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      
      {/* Header with Cart and Wishlist */}
      <Header showCartAndWishlist={true} />

      {/* Product Content */}
      <div style={{ 
        padding: windowWidth >= 1200 ? '40px 60px' : windowWidth >= 768 ? '30px 40px' : '20px',
        maxWidth: windowWidth >= 1600 ? '1400px' : windowWidth >= 1200 ? '1200px' : '100%',
        margin: '0 auto'
      }}>
        {windowWidth >= 1200 ? (
          // Desktop Layout
          <>
            {/* Top Section - Image and Product Info Side by Side */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'start',
              marginBottom: '40px'
            }}>
              {/* Left Column - Product Image */}
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
              </div>

              {/* Right Column - Product Details */}
              <div style={{ paddingTop: '20px' }}>
                {/* Product Name and Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h1 style={{
                    fontSize: windowWidth >= 1600 ? '36px' : '32px',
                    fontWeight: '400',
                    color: '#374151',
                    margin: 0,
                    flex: 1,
                    lineHeight: '1.2'
                  }}>
                    {selectedProduct.name}
                  </h1>

                  {/* Share Button */}
                  <button 
                    onClick={handleShare}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      marginLeft: '16px'
                    }}>
                    <svg style={{ width: '28px', height: '28px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>

                {/* Price and Wishlist */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '40px'
                }}>
                  <p style={{
                    fontSize: windowWidth >= 1600 ? '26px' : '24px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </p>

                  {/* Wishlist Button */}
                  <button
                    onClick={handleWishlistToggle}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isInWishlist ? '#ef4444' : '#6b7280'
                    }}
                  >
                    <svg style={{ width: '28px', height: '28px' }} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Product Info (Purity & Color) */}
                {renderProductInfo()}
              </div>
            </div>

            {/* Bottom Section - Full Width Action Buttons */}
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {renderActionButtons()}
            </div>
          </>
        ) : (
          // Mobile/Tablet Layout - Stacked
          <>
            {/* Product Image */}
            <div style={{
              width: '100%',
              maxWidth: windowWidth >= 768 ? '450px' : '400px',
              margin: '0 auto 24px auto',
              aspectRatio: '1',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
            </div>

            {/* Product Name and Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
              maxWidth: windowWidth >= 768 ? '450px' : '400px',
              margin: '0 auto 8px auto'
            }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '400',
                color: '#374151',
                margin: 0,
                flex: 1
              }}>
                {selectedProduct.name}
              </h1>

              {/* Share Button */}
              <button 
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  marginLeft: '16px'
                }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>

            {/* Price and Wishlist */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              maxWidth: windowWidth >= 768 ? '450px' : '400px',
              margin: '0 auto 24px auto'
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                ₹{selectedProduct.price.toLocaleString('en-IN')}
              </p>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isInWishlist ? '#ef4444' : '#6b7280'
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Mobile Content Container */}
            <div style={{
              maxWidth: windowWidth >= 768 ? '450px' : '400px',
              margin: '0 auto'
            }}>
              {renderMobileContent()}
            </div>
          </>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: windowWidth >= 768 ? '32px' : '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={closeShareModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Share Product
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Send product details to an email address
              </p>
            </div>

            {/* Product Preview */}
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  {selectedProduct.name}
                </h3>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 8px 0'
                }}>
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {selectedPurity} • {selectedColor}
                </p>
              </div>
            </div>

            {/* Share Form */}
            <form onSubmit={handleShareSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Personal Message (Optional)
                </label>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Status Messages */}
              {shareStatus === 'success' && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  ✓ Product details sent successfully!
                </div>
              )}

              {shareStatus === 'demo' && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  ℹ️ Demo Mode: Email functionality ready! Configure EmailJS to send real emails.
                </div>
              )}

              {shareStatus === 'error' && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  ✗ Failed to send email. Please check the console for details and verify your EmailJS template configuration.
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={closeShareModal}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSharing || !shareEmail}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isSharing || !shareEmail ? '#9ca3af' : '#000000',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isSharing || !shareEmail ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSharing ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;