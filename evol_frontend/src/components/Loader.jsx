import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import Header from './Header';

const Loader = () => {
  const navigate = useNavigate();
  const { 
    isLoadingRecommendations, 
    recommendationError, 
    recommendations 
  } = useAppStore();
  
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your preferences...');

  useEffect(() => {
    // Update loading messages
    const messages = [
      'Analyzing your preferences...',
      'Finding celebrity matches...',
      'Curating perfect jewelry pieces...',
      'Almost ready...'
    ];
    
    let messageIndex = 0;
    const messageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 1500);

    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    // Handle navigation based on loading state
    if (!isLoadingRecommendations) {
      if (recommendationError) {
        // Show error for 2 seconds then navigate to fallback
        setTimeout(() => {
          navigate('/celebrities');
        }, 2000);
      } else if (recommendations.celebrities.length > 0) {
        // Success - navigate to celebrities
        setTimeout(() => {
          navigate('/celebrities');
        }, 1000);
      } else {
        // No recommendations but no error - navigate after delay
        setTimeout(() => {
          navigate('/celebrities');
        }, 3000);
      }
    }
  }, [isLoadingRecommendations, recommendationError, recommendations, navigate]);

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
      <Header showBackButton={true} backTo="/survey" />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%'
        }}>

          {/* Spinning Ring Animation */}
          <motion.div style={{
            position: 'relative',
            marginBottom: '48px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '80px',
                  height: '80px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #d97706',
                  borderRadius: '50%'
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '80px',
                  height: '80px',
                  border: '4px solid transparent',
                  borderBottom: '4px solid #f59e0b',
                  borderRadius: '50%'
                }}
              />
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '40px' }}
          >
            <h2 style={{
              fontSize: '28px',
              fontFamily: 'serif',
              color: recommendationError ? '#dc2626' : '#1e293b',
              marginBottom: '24px',
              lineHeight: '1.2',
              fontWeight: '400'
            }}>
              {recommendationError 
                ? 'Oops! Something went wrong' 
                : isLoadingRecommendations 
                  ? 'Generating your personalized recommendations...'
                  : 'Your recommendations are ready!'
              }
            </h2>
            <p style={{
              fontSize: '18px',
              color: recommendationError ? '#dc2626' : '#64748b',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              {recommendationError 
                ? `${recommendationError}. Don't worry, we'll show you our curated collection instead.`
                : isLoadingRecommendations
                  ? loadingMessage
                  : `Found ${recommendations.celebrities.length} celebrity matches and ${recommendations.products.length} perfect pieces for you!`
              }
            </p>
          </motion.div>

          {/* Animated Dots */}
          <motion.div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px'
          }}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#d97706',
                  borderRadius: '50%'
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;