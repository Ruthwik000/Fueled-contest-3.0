import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import { surveyQuestions } from '../mock/data';
import Header from '../components/Header';

const TerminalSurvey = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { answerQuestion, finishSurvey, answers } = useAppStore();

  // Reset selections when question changes
  useEffect(() => {
    setSelectedOptions([]);
    setTextInput('');
  }, [currentQuestionIndex]);

  const getCurrentQuestion = () => {
    return surveyQuestions[currentQuestionIndex];
  };

  const handleOptionClick = (option) => {
    if (isProcessing) return;
    
    const question = getCurrentQuestion();
    
    if (question.type === 'multiple') {
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(opt => opt !== option)
          : [...prev, option]
      );
    } else {
      // Single selection - proceed immediately
      handleNext(option);
    }
  };

  const handleNext = (singleOption = null) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    const question = getCurrentQuestion();
    let answer;
    
    if (question.isTextInput) {
      answer = textInput.trim();
    } else if (singleOption) {
      answer = singleOption;
    } else {
      answer = question.type === 'multiple' ? selectedOptions : selectedOptions[0];
    }
    
    // Save answer
    answerQuestion(currentQuestionIndex, answer);
    
    setTimeout(async () => {
      if (currentQuestionIndex >= surveyQuestions.length - 1) {
        // Finish survey and get ML recommendations
        console.log('🎯 Survey completed! Answers:', answers);
        try {
          navigate('/loading');
          console.log('📞 Calling finishSurvey...');
          const result = await finishSurvey();
          console.log('✅ Survey finished with result:', result);
          // Navigation to results will be handled by the loading page
        } catch (error) {
          console.error('❌ Error completing survey:', error);
          // Still navigate to loading page to show error state
        }
      } else {
        // Next question
        setCurrentQuestionIndex(prev => prev + 1);
      }
      setIsProcessing(false);
    }, 300);
  };

  const totalQuestions = surveyQuestions.length;
  const currentQuestion = getCurrentQuestion();
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

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
      <Header showBackButton={true} backTo="/" />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 24px',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginBottom: '60px',
            marginTop: '20px'
          }}
        >
          <h2 style={{
            fontSize: '20px',
            fontWeight: '500',
            color: '#374151',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            FIND YOUR CELEBRITY STYLE
          </h2>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ marginBottom: '50px' }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#374151'
            }}>
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: '#e5e7eb',
            height: '3px'
          }}>
            <motion.div
              style={{
                backgroundColor: '#374151',
                height: '3px'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginBottom: '40px' }}
        >
          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#374151',
            lineHeight: '1.5',
            margin: 0
          }}>
            {currentQuestion.question}
          </h3>
        </motion.div>

        {/* Answer Options */}
        <AnimatePresence mode="wait">
          {currentQuestion.isTextInput ? (
            // Text Input
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={currentQuestion.placeholder || "Type your message..."}
                  style={{
                    width: '100%',
                    padding: '16px 40px 16px 0',
                    border: 'none',
                    borderBottom: '2px solid #e5e7eb',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    color: '#374151',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#d97706'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                  disabled={isProcessing}
                />
                <button
                  onClick={() => handleNext()}
                  disabled={!textInput.trim() || isProcessing}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: !textInput.trim() || isProcessing ? '#d1d5db' : '#d97706',
                    cursor: !textInput.trim() || isProcessing ? 'not-allowed' : 'pointer',
                    padding: '4px'
                  }}
                >
                  <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentQuestion.question.includes('(Optional)') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNext()}
                    disabled={isProcessing}
                    style={{
                      flex: 1,
                      backgroundColor: isProcessing ? '#d1d5db' : '#e5e7eb',
                      color: isProcessing ? '#9ca3af' : '#374151',
                      padding: '16px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }}
                  >
                    Skip
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNext()}
                  disabled={(!textInput.trim() && !currentQuestion.question.includes('(Optional)')) || isProcessing}
                  style={{
                    flex: currentQuestion.question.includes('(Optional)') ? 1 : 'none',
                    width: currentQuestion.question.includes('(Optional)') ? 'auto' : '100%',
                    backgroundColor: ((!textInput.trim() && !currentQuestion.question.includes('(Optional)')) || isProcessing) ? '#d1d5db' : '#d97706',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: ((!textInput.trim() && !currentQuestion.question.includes('(Optional)')) || isProcessing) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Next'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Button Options
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedOptions.includes(option);
                
                return (
                  <motion.button
                    key={option}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(option)}
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s',
                      backgroundColor: isSelected ? '#d97706' : '#e5e7eb',
                      color: isSelected ? 'white' : '#374151',
                      opacity: isProcessing ? 0.5 : 1
                    }}
                  >
                    {option}
                  </motion.button>
                );
              })}
              
              {/* Continue button for multiple choice */}
              {currentQuestion.type === 'multiple' && selectedOptions.length > 0 && (
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNext()}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    backgroundColor: isProcessing ? '#d1d5db' : '#d97706',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    marginTop: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Next'}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TerminalSurvey;