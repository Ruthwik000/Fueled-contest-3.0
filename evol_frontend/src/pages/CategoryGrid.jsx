import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import Header from '../components/Header';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { selectCategory, viewAllProducts } = useAppStore();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategorySelect = (categoryName) => {
    selectCategory(categoryName);
    navigate('/products');
  };

  const handleViewAllProducts = () => {
    viewAllProducts();
    navigate('/products');
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
      <Header showBackButton={true} backTo="/celebrities" />

      {/* Content - Responsive for all screen sizes */}
      <div style={{
        padding: windowWidth >= 1600 ? '80px 40px' : windowWidth >= 1200 ? '60px 30px' : windowWidth >= 768 ? '40px 20px' : '32px 12px',
        maxWidth: windowWidth >= 1600 ? '1600px' : windowWidth >= 1200 ? '1200px' : windowWidth >= 768 ? '900px' : '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)'
      }}>
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            textAlign: 'center',
            marginBottom: windowWidth >= 1200 ? '60px' : windowWidth >= 768 ? '40px' : '32px'
          }}
        >
          <h1 style={{
            fontSize: windowWidth >= 1200 ? '32px' : windowWidth >= 768 ? '28px' : '24px',
            fontFamily: 'serif',
            color: '#000000',
            letterSpacing: '0.2em',
            fontWeight: '400',
            margin: 0
          }}>
            SELECT A CATEGORY
          </h1>
        </motion.div>

        {/* Category Grid Layout - Always 2 Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: windowWidth >= 1600 ? '20px' : windowWidth >= 1200 ? '16px' : windowWidth >= 768 ? '12px' : '8px',
          maxWidth: windowWidth >= 1600 ? '1400px' : windowWidth >= 1200 ? '1100px' : windowWidth >= 768 ? '800px' : '100%',
          width: '100%'
        }}>

          {/* Left Column - 3 Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: windowWidth >= 1600 ? '20px' : windowWidth >= 1200 ? '16px' : windowWidth >= 768 ? '12px' : '8px'
          }}>
            {/* Bracelets */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleCategorySelect("BRACELETS")}
            >
              <img
                src="/images/bracelets.png"
                alt="Bracelets"
                style={{
                  width: '100%',
                  height: windowWidth >= 1200 ? '280px' : windowWidth >= 768 ? '240px' : '200px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+QlJBQ0VMRVRTIC0gSW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }} />
              <div style={{
                position: 'absolute',
                bottom: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                left: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                color: 'white',
                fontSize: windowWidth >= 1200 ? '16px' : windowWidth >= 768 ? '14px' : '12px',
                fontWeight: '500',
                letterSpacing: '0.1em'
              }}>
                BRACELETS
              </div>
            </motion.div>

            {/* Pendants */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleCategorySelect("PENDANTS")}
            >
              <img
                src="/images/pendant.png"
                alt="Pendants"
                style={{
                  width: '100%',
                  height: windowWidth >= 1200 ? '280px' : windowWidth >= 768 ? '240px' : '200px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+UEVOREFOVFMGIC0gSW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }} />
              <div style={{
                position: 'absolute',
                bottom: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                left: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                color: 'white',
                fontSize: windowWidth >= 1200 ? '16px' : windowWidth >= 768 ? '14px' : '12px',
                fontWeight: '500',
                letterSpacing: '0.1em'
              }}>
                PENDANTS
              </div>
            </motion.div>

            {/* Rings */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleCategorySelect("RINGS")}
            >
              <img
                src="/images/rings.png"
                alt="Rings"
                style={{
                  width: '100%',
                  height: windowWidth >= 1200 ? '280px' : windowWidth >= 768 ? '240px' : '200px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+UklOR1MgLSBJbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }} />
              <div style={{
                position: 'absolute',
                bottom: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                left: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                color: 'white',
                fontSize: windowWidth >= 1200 ? '16px' : windowWidth >= 768 ? '14px' : '12px',
                fontWeight: '500',
                letterSpacing: '0.1em'
              }}>
                RINGS
              </div>
            </motion.div>
          </div>

          {/* Right Column - 2 Cards + Button */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: windowWidth >= 1200 ? '12px' : windowWidth >= 770 ? '8px' : '4px'
          }}>
            {/* Necklace - Taller */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleCategorySelect("NECKLACES")}
            >
              <img
                src="/images/necklace.png"
                alt="Necklace"
                style={{
                  width: '100%',
                  height: windowWidth >= 1200 ? '520px' : windowWidth >= 768 ? '420px' : '360px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwOCIgdmlld0JveD0iMCAwIDMwMCAyMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjA4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MzgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPk5FQ0tMQUNFIC0gSW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }} />
              <div style={{
                position: 'absolute',
                bottom: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                left: windowWidth >= 1200 ? '20px' : windowWidth >= 768 ? '16px' : '12px',
                color: 'white',
                fontSize: windowWidth >= 1200 ? '16px' : windowWidth >= 768 ? '14px' : '12px',
                fontWeight: '500',
                letterSpacing: '0.1em'
              }}>
                NECKLACE
              </div>
            </motion.div>

            {/* Earrings */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleCategorySelect("EARRINGS")}
            >
              <img
                src="/images/earring.png"
                alt="Earrings"
                style={{
                  width: '100%',
                  height: windowWidth >= 1200 ? '320px' : windowWidth >= 768 ? '260px' : '220px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iNjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+RUFSUKLOR1MgLSBJbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
              <div className="absolute inset-0  bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />

            </motion.div>

            {/* Show All Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
              onClick={handleViewAllProducts}
            >
              <button className="w-full h-10 py-10 px-6 inline-flex items-center justify-center text-black font-medium text-sm tracking-[0.1em] group">
                SHOW ALL
                <svg
                  className="ml-2 w-4 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryGrid;