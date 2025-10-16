// ML API Service for EVOL Jewels Recommendations

const ML_API_BASE_URL = 'https://evol-45609451577.asia-south1.run.app';

/**
 * Transform survey answers to ML API format
 */
const transformSurveyToMLFormat = (answers) => {
  const surveyData = {};
  
  // Map survey answers to ML expected format
  if (answers[0]) { // Style preference
    surveyData.style_preference = answers[0];
  }
  
  if (answers[1]) { // Occasions (multiple)
    surveyData.occasions = Array.isArray(answers[1]) ? answers[1] : [answers[1]];
  }
  
  if (answers[2]) { // Jewelry type
    surveyData.jewelry_type = answers[2];
  }
  
  if (answers[3]) { // Sparkle level
    surveyData.sparkle_level = answers[3];
  }
  
  if (answers[4]) { // Budget
    surveyData.budget = answers[4];
  }
  
  if (answers[5]) { // Celebrity inspiration (optional)
    surveyData.celebrity_inspiration = answers[5];
  }
  
  if (answers[6]) { // Additional preferences (optional)
    surveyData.additional_preferences = answers[6];
  }

  return surveyData;
};

/**
 * Transform ML response to frontend format
 */
const transformMLResponseToFrontend = (mlResponse) => {
  console.log('🔄 Transforming ML response:', mlResponse);
  
  const transformed = {
    celebrities: [],
    products: [],
    metadata: {
      status: 'success',
      timestamp: new Date().toISOString(),
      totalRecommendations: 0
    }
  };

  // Transform from celebrity_product_groups (reference implementation structure)
  if (mlResponse.celebrity_product_groups) {
    console.log('📊 Processing celebrity_product_groups:', mlResponse.celebrity_product_groups.length);
    
    // Extract celebrities
    transformed.celebrities = mlResponse.celebrity_product_groups.map(group => ({
      id: group.celebrity.id,
      name: group.celebrity.name,
      image: group.celebrity.image_url || `/images/celebrities/${group.celebrity.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      similarity_score: group.celebrity.similarity_score,
      match_percentage: Math.round(group.celebrity.similarity_score * 100),
      vibe_tags: [...(group.celebrity.primary_vibe_tags || []), ...(group.celebrity.secondary_vibe_tags || [])],
      primary_vibe_tags: group.celebrity.primary_vibe_tags || [],
      secondary_vibe_tags: group.celebrity.secondary_vibe_tags || [],
      description: group.celebrity.vibe_description || '',
      vibe_description: group.celebrity.vibe_description || ''
    }));

    // Extract all products from all celebrity groups
    const allProducts = [];
    mlResponse.celebrity_product_groups.forEach(group => {
      if (group.products) {
        group.products.forEach(product => {
          // Generate a fallback price if null
          const fallbackPrice = generateFallbackPrice(product.category);
          const productPrice = product.price ? parsePrice(product.price) : fallbackPrice;
          
          console.log('🔧 Processing product:', product.name, 'Category:', product.category, 'Price:', productPrice);
          console.log('🖼️ Using ML API image:', product.image_url);
          
          allProducts.push({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: productPrice,
            priceFormatted: `₹${productPrice.toLocaleString()}`,
            image: product.image_url || '', // Use ML API image directly
            category: product.category || '', // Keep original case for proper mapping in ProductGrid
            material: product.material || '',
            primary_style_tags: product.primary_style_tags || [],
            secondary_style_tags: product.secondary_style_tags || [],
            occasions: product.occasions || [],
            vibe_description: product.vibe_description || '',
            match_score: product.match_score || 0,
            deliveryTime: '15-17 DAYS'
          });
        });
      }
    });

    // Remove duplicates and sort by match score
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    ).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    transformed.products = uniqueProducts;
    transformed.metadata.totalRecommendations = uniqueProducts.length;

    console.log('✅ Transformed:', {
      celebrities: transformed.celebrities.length,
      products: transformed.products.length
    });
  }

  return transformed;
};

/**
 * Parse price string to number
 */
const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  
  // Remove currency symbols and commas, extract number
  const numericString = priceString.replace(/[₹,INR\s]/g, '');
  return parseInt(numericString) || 0;
};

/**
 * Generate fallback price based on category
 */
const generateFallbackPrice = (category) => {
  const categoryKey = (category || '').toLowerCase().trim();
  
  // Determine price range based on category type
  let priceRange = [15000, 50000]; // default
  
  if (categoryKey.includes('necklace') || categoryKey.includes('chain') || categoryKey.includes('neck') || categoryKey === 'choker') {
    priceRange = [25000, 85000];
  } else if (categoryKey.includes('earring') || categoryKey.includes('stud') || categoryKey.includes('hoop') || categoryKey.includes('drop')) {
    priceRange = [15000, 45000];
  } else if (categoryKey === 'ring' || categoryKey.includes('ring') || categoryKey.includes('band') || categoryKey.includes('solitaire')) {
    priceRange = [20000, 60000];
  } else if (categoryKey === 'bracelet' || categoryKey.includes('bracelet') || categoryKey.includes('bangle') || categoryKey.includes('cuff')) {
    priceRange = [18000, 50000];
  } else if (categoryKey.includes('pendant') || categoryKey.includes('locket') || categoryKey.includes('charm')) {
    priceRange = [12000, 35000];
  }
  
  // Generate random price within range
  return Math.floor(Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]);
};

// Removed fallback image system - using ML API images only

/**
 * Get recommendations from ML API
 */
export const getRecommendations = async (surveyAnswers, options = {}) => {
  console.log('🚀 Starting ML API call with survey answers:', surveyAnswers);
  
  try {
    const transformedData = transformSurveyToMLFormat(surveyAnswers);
    console.log('📝 Transformed survey data:', transformedData);
    
    // Match the reference implementation structure
    const requestData = {
      survey: transformedData,
      top_n: options.topN || 15,
      celebrity_threshold: options.celebrityThreshold || 0.4,
      include_scores: true
    };

    console.log('📤 Sending request to ML API:', requestData);
    console.log('🌐 API URL:', `${ML_API_BASE_URL}/api/v1/recommendations`);

    const response = await fetch(`${ML_API_BASE_URL}/api/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ML API Error Response:', errorText);
      throw new Error(`ML API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const mlResponse = await response.json();
    console.log('✅ ML API Response received:', mlResponse);

    const transformedResponse = transformMLResponseToFrontend(mlResponse);
    console.log('🔄 Transformed response:', transformedResponse);

    return transformedResponse;
  } catch (error) {
    console.error('💥 Error fetching recommendations:', error);
    
    // Return fallback data structure
    return {
      celebrities: [],
      products: [],
      metadata: {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        totalRecommendations: 0
      }
    };
  }
};

/**
 * Test ML API connection
 */
export const testMLConnection = async () => {
  try {
    // Test with a simple request to the recommendations endpoint
    const testData = {
      survey: {
        style_preference: "Classic and timeless - I love pieces that never go out of style",
        occasions: ["Weddings"],
        jewelry_type: "Solitaire diamonds - Simple and stunning",
        sparkle_level: "Moderate sparkle - Noticeable but balanced",
        budget: "₹50,000 - ₹1,50,000 (Premium)"
      },
      top_n: 3,
      celebrity_threshold: 0.4,
      include_scores: true
    };

    const response = await fetch(`${ML_API_BASE_URL}/api/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    return {
      success: response.ok,
      status: response.status,
      message: response.ok ? 'ML API is working correctly' : `ML API returned ${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: `Connection failed: ${error.message}`
    };
  }
};