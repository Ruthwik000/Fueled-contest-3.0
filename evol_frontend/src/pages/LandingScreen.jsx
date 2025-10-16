import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const LandingScreen = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Header showBackButton={false} />

      {/* Main Content - Perfectly centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Main Heading */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: '36px',
              fontFamily: 'serif',
              color: '#374151',
              marginBottom: '24px',
              lineHeight: '1.2',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}
          >
            Find Your Signature Piece
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '40px',
              lineHeight: '1.6',
              fontWeight: '300',
              maxWidth: '400px',
              margin: '0 auto 40px auto'
            }}
          >
            Discover jewelry that tells your story. Our curated collection offers timeless elegance and modern sophistication for every occasion.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/survey')}
            style={{
              color: 'white',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: 'linear-gradient(135deg, #B8941F 0%, #D4AF37 100%)',
              boxShadow: '0 4px 15px rgba(184, 148, 31, 0.3)',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 6px 20px rgba(184, 148, 31, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 4px 15px rgba(184, 148, 31, 0.3)';
            }}
          >
            Start Survey
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingScreen;