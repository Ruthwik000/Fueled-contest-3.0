import { useState } from 'react';
import { testMLConnection, getRecommendations } from '../services/mlApi';

const MLApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testMLConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error.message}`
      });
    }
    setIsLoading(false);
  };

  const handleTestRecommendations = async () => {
    setIsLoading(true);
    try {
      // Sample survey data
      const sampleAnswers = [
        "Classic and timeless - I love pieces that never go out of style",
        ["Weddings", "Formal Events"],
        "Solitaire diamonds - Simple and stunning",
        "Moderate sparkle - Noticeable but balanced",
        "₹50,000 - ₹1,50,000 (Premium)",
        "Elegant like Deepika Padukone",
        "Prefer gold jewelry"
      ];

      const result = await getRecommendations(sampleAnswers);
      setTestResult({
        success: true,
        message: `Got ${result.celebrities.length} celebrities and ${result.products.length} products`,
        data: result
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Recommendations test failed: ${error.message}`
      });
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>ML API Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleTestConnection}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button 
          onClick={handleTestRecommendations}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test Recommendations'}
        </button>
      </div>

      {testResult && (
        <div style={{
          padding: '15px',
          borderRadius: '4px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          <strong>Result:</strong> {testResult.message}
          {testResult.data && (
            <pre style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              maxHeight: '300px', 
              overflow: 'auto',
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default MLApiTest;