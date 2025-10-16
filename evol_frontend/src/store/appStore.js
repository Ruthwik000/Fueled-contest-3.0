import { create } from 'zustand';
import { getRecommendations } from '../services/mlApi';

const useAppStore = create((set, get) => ({

  // Survey data
  answers: [],

  // Selected items
  selectedCelebrity: null,
  selectedCategory: null,
  selectedProduct: null,

  // Recommendations
  recommendations: {
    celebrities: [],
    products: [],
    celebrityProductGroups: [],
    metadata: null
  },
  
  // Loading states
  isLoadingRecommendations: false,
  recommendationError: null,

  // Cart and wishlist
  cart: [],
  wishlist: [],

  // Modal states
  showCart: false,
  showWishlist: false,

  // Actions

  answerQuestion: (questionIndex, answer) => set((state) => {
    const newAnswers = [...state.answers];
    newAnswers[questionIndex] = answer;
    return { answers: newAnswers };
  }),

  finishSurvey: async () => {
    const state = get();
    
    // Set loading state
    set({ 
      isLoadingRecommendations: true, 
      recommendationError: null 
    });

    try {
      // Get recommendations from ML API
      const recommendations = await getRecommendations(state.answers);
      
      // Update store with recommendations
      set({ 
        recommendations,
        isLoadingRecommendations: false,
        recommendationError: null
      });

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      
      set({ 
        isLoadingRecommendations: false,
        recommendationError: error.message || 'Failed to get recommendations'
      });
      
      throw error;
    }
  },

  selectCelebrity: (celebrity) => set({
    selectedCelebrity: celebrity
  }),

  selectCategory: (category) => set({
    selectedCategory: category
  }),

  viewAllProducts: () => set({
    selectedCategory: null
  }),

  selectProduct: (product) => set({
    selectedProduct: product
  }),

  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return {
      cart: [...state.cart, { ...product, quantity: 1 }]
    };
  }),

  addToWishlist: (product) => set((state) => {
    const exists = state.wishlist.find(item => item.id === product.id);
    if (!exists) {
      return { wishlist: [...state.wishlist, product] };
    }
    return state;
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),

  removeFromWishlist: (productId) => set((state) => ({
    wishlist: state.wishlist.filter(item => item.id !== productId)
  })),

  updateCartQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { cart: state.cart.filter(item => item.id !== productId) };
    }
    return {
      cart: state.cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    };
  }),

  toggleCart: () => set((state) => ({ showCart: !state.showCart })),
  toggleWishlist: () => set((state) => ({ showWishlist: !state.showWishlist })),



  // Set recommendations (for manual updates)
  setRecommendations: (recommendations) => set({ recommendations }),

  reset: () => set({
    answers: [],
    selectedCelebrity: null,
    selectedCategory: null,
    selectedProduct: null,
    recommendations: { 
      celebrities: [], 
      products: [], 
      celebrityProductGroups: [], 
      metadata: null 
    },
    isLoadingRecommendations: false,
    recommendationError: null,
    cart: [],
    wishlist: [],
    showCart: false,
    showWishlist: false
  })
}));

export default useAppStore;