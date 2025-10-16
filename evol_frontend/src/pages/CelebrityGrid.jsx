import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
// Removed mock data import - using ML recommendations only
import Header from '../components/Header';

const CelebrityGrid = () => {
  const navigate = useNavigate();
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { selectCelebrity, recommendations } = useAppStore();

  // Use ML recommendations only - no fallback to mock data
  const celebritiesToShow = recommendations.celebrities;
  
  // Debug logging
  console.log('🎭 CelebrityGrid - Recommendations:', recommendations);
  console.log('🎭 CelebrityGrid - Celebrities to show:', celebritiesToShow);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCelebrityClick = (celebrity) => {
    setSelectedCelebrity(celebrity);
  };

  const handleConfirmCelebrity = () => {
    if (selectedCelebrity) {
      selectCelebrity(selectedCelebrity);
      navigate('/categories');
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
    >
      {/* Header */}
      <Header showBackButton={true} backTo="/survey" />
      
      {/* Debug component removed */}

      <AnimatePresence mode="wait">
        {!selectedCelebrity ? (
          /* Celebrity Selection View - Responsive for all screens */
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: windowWidth >= 1200 ? '80px 40px' : windowWidth >= 768 ? '60px 24px' : '48px 24px',
              maxWidth: windowWidth >= 1200 ? '1200px' : windowWidth >= 768 ? '900px' : '600px',
              margin: '0 auto'
            }}
          >
            {/* Title */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                textAlign: 'center',
                marginBottom: window.innerWidth >= 1200 ? '120px' : window.innerWidth >= 768 ? '100px' : '80px'
              }}
            >
              <h2 style={{
                fontSize: window.innerWidth >= 1200 ? '32px' : window.innerWidth >= 768 ? '28px' : '24px',
                fontFamily: 'serif',
                letterSpacing: '0.2em',
                color: '#000000',
                fontWeight: '400',
                margin: 0
              }}>
                SELECT A CELEBRITY
              </h2>
            </motion.div>

            {/* Celebrity Grid - Responsive Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth >= 1200 ? 'repeat(3, 1fr)' : window.innerWidth >= 768 ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
                gap: window.innerWidth >= 1200 ? '60px' : window.innerWidth >= 768 ? '40px' : '24px',
                maxWidth: window.innerWidth >= 1200 ? '800px' : window.innerWidth >= 768 ? '600px' : '400px',
                margin: '0 auto',
                marginBottom: window.innerWidth >= 1200 ? '80px' : window.innerWidth >= 768 ? '60px' : '40px'
              }}
            >
              {celebritiesToShow && celebritiesToShow.length > 0 ? celebritiesToShow.slice(0, 3).map((celebrity, index) => (
                <motion.div
                  key={celebrity.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.4
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCelebrityClick(celebrity)}
                >
                  <div style={{
                    position: 'relative',
                    width: window.innerWidth >= 1600 ? '280px' : window.innerWidth >= 1200 ? '250px' : window.innerWidth >= 768 ? '200px' : '140px',
                    height: window.innerWidth >= 1600 ? '280px' : window.innerWidth >= 1200 ? '250px' : window.innerWidth >= 768 ? '200px' : '140px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: window.innerWidth >= 1600 ? '40px' : window.innerWidth >= 1200 ? '36px' : window.innerWidth >= 768 ? '28px' : '20px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  >
                    <img
                      src={`${celebrity.image}?t=${Date.now()}`}
                      alt={celebrity.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                      }}
                      onLoad={() => console.log(`Loaded image for ${celebrity.name}: ${celebrity.image}`)}
                      onError={(e) => {
                        console.error(`Failed to load image for ${celebrity.name}: ${celebrity.image}`);
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjY0IiBjeT0iNjQiIHI9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI2NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZCNzM4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iNTAwIj5JbWFnZTwvdGV4dD4KPC9zdmc+Cg==';
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <h3 style={{
                    textAlign: 'center',
                    fontSize: window.innerWidth >= 1600 ? '24px' : window.innerWidth >= 1200 ? '22px' : window.innerWidth >= 768 ? '18px' : '14px',
                    fontFamily: 'serif',
                    color: '#000000',
                    letterSpacing: '0.15em',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    margin: 0
                  }}>
                    {celebrity.name}
                  </h3>
                </motion.div>
              )) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <h3 style={{ marginBottom: '16px' }}>No celebrity recommendations available</h3>
                  <p>Please complete the survey to get personalized recommendations.</p>
                </div>
              )}
            </div>

            {/* Description Text - Centered and Responsive */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: window.innerWidth >= 1200 ? '0 60px' : window.innerWidth >= 768 ? '0 40px' : '0 24px'
              }}
            >
              <p style={{
                fontSize: window.innerWidth >= 1200 ? '18px' : window.innerWidth >= 768 ? '16px' : '14px',
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: '1.6',
                fontWeight: '400',
                maxWidth: window.innerWidth >= 1200 ? '600px' : window.innerWidth >= 768 ? '500px' : '350px',
                margin: 0
              }}>
                Based on your preferences for elegant and timeless pieces, we've selected these celebrities who share your classic style.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          /* Celebrity Detail View - Responsive Centered Layout */
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 120px)',
              padding: window.innerWidth >= 1200 ? '60px 40px' : window.innerWidth >= 768 ? '40px 24px' : '32px 24px'
            }}
          >
            {/* Celebrity Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: window.innerWidth >= 1200 ? '500px' : window.innerWidth >= 768 ? '450px' : '400px',
                width: '100%'
              }}
            >
              {/* Celebrity Image */}
              <div style={{
                overflow: 'hidden',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                height: window.innerWidth >= 1200 ? '500px' : window.innerWidth >= 768 ? '450px' : '400px'
              }}>
                <img
                  src={selectedCelebrity.image}
                  alt={selectedCelebrity.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MzgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI1MDAiPkNlbGVicml0eSBJbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                  }}
                />
              </div>

              {/* Celebrity Info */}
              <div style={{
                padding: window.innerWidth >= 1200 ? '48px 40px 56px 40px' : window.innerWidth >= 768 ? '40px 32px 48px 32px' : '32px 24px 40px 24px',
                textAlign: 'center',
                backgroundColor: '#ffffff'
              }}>
                <h1 style={{
                  fontSize: window.innerWidth >= 1200 ? '24px' : window.innerWidth >= 768 ? '22px' : '20px',
                  fontFamily: 'serif',
                  color: '#000000',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: '400',
                  marginBottom: window.innerWidth >= 1200 ? '32px' : window.innerWidth >= 768 ? '28px' : '24px',
                  margin: `0 0 ${window.innerWidth >= 1200 ? '32px' : window.innerWidth >= 768 ? '28px' : '24px'} 0`
                }}>
                  {selectedCelebrity.name}
                </h1>

                <p style={{
                  fontSize: window.innerWidth >= 1200 ? '18px' : window.innerWidth >= 768 ? '16px' : '14px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  padding: window.innerWidth >= 1200 ? '0 20px' : window.innerWidth >= 768 ? '0 16px' : '0 12px',
                  marginBottom: window.innerWidth >= 1200 ? '48px' : window.innerWidth >= 768 ? '40px' : '32px',
                  margin: `0 ${window.innerWidth >= 1200 ? '20px' : window.innerWidth >= 768 ? '16px' : '12px'} ${window.innerWidth >= 1200 ? '48px' : window.innerWidth >= 768 ? '40px' : '32px'} ${window.innerWidth >= 1200 ? '20px' : window.innerWidth >= 768 ? '16px' : '12px'}`
                }}>
                  {selectedCelebrity.description}
                </p>

                {/* View Products Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmCelebrity}
                  style={{
                    backgroundColor: '#eab308',
                    color: 'white',
                    fontSize: window.innerWidth >= 1200 ? '16px' : window.innerWidth >= 768 ? '15px' : '14px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    padding: window.innerWidth >= 1200 ? '18px 48px' : window.innerWidth >= 768 ? '16px 40px' : '14px 32px',
                    borderRadius: '24px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ca8a04';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#eab308';
                  }}
                >
                  View Products
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CelebrityGrid;