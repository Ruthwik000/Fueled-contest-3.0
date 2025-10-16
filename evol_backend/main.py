"""
FastAPI Server for Jewelry Recommendation System
Provides REST API endpoints for celebrity-based product recommendations
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
import uvicorn
from pathlib import Path
import logging
from datetime import datetime
import os

from recommender_engine import CelebrityProductRecommender

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Jewelry Recommendation API",
    description="AI-powered jewelry recommendations based on celebrity style matching",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global recommender instance (loaded once at startup)
recommender: Optional[CelebrityProductRecommender] = None


# ==================== Pydantic Models ====================

class SurveyResponse(BaseModel):
    """User survey response model"""
    style_preference: str = Field(
        ...,
        description="User's overall style preference",
        example="Elegant and sophisticated - Refined with subtle luxury"
    )
    occasions: List[str] = Field(
        ...,
        description="List of occasions user is shopping for",
        example=["Weddings", "Formal Events", "Anniversary"]
    )
    jewelry_type: str = Field(
        ...,
        description="Preferred jewelry type",
        example="Solitaire diamonds - Simple and stunning"
    )
    sparkle_level: str = Field(
        ...,
        description="Preferred sparkle level",
        example="Moderate sparkle - Noticeable but balanced"
    )
    budget: str = Field(
        ...,
        description="Budget range",
        example="₹50,000 - ₹1,50,000 (Premium)"
    )
    celebrity_inspiration: Optional[str] = Field(
        None,
        description="Celebrity style inspiration (optional)",
        example="Classic elegance like Deepika Padukone"
    )
    additional_preferences: Optional[str] = Field(
        None,
        description="Additional preferences (optional)",
        example="Prefer white gold or platinum"
    )
    
    @validator('occasions')
    def validate_occasions(cls, v):
        if not v or len(v) == 0:
            raise ValueError("At least one occasion must be selected")
        return v


class RecommendationRequest(BaseModel):
    """Request model for getting recommendations"""
    survey: SurveyResponse
    top_n: int = Field(
        10,
        ge=1,
        le=50,
        description="Number of product recommendations to return"
    )
    celebrity_threshold: float = Field(
        0.4,
        ge=0.0,
        le=1.0,
        description="Minimum similarity threshold for celebrity matching"
    )
    include_scores: bool = Field(
        False,
        description="Include detailed scoring breakdown"
    )


class CelebrityMatch(BaseModel):
    """Celebrity match response model"""
    id: str
    name: str
    similarity_score: float
    primary_vibe_tags: List[str]
    secondary_vibe_tags: List[str]
    vibe_description: str
    image_url: Optional[str]


class ProductRecommendation(BaseModel):
    """Product recommendation response model"""
    id: int
    name: str
    price: str
    category: str
    primary_style_tags: List[str]
    secondary_style_tags: List[str]
    occasions: List[str]
    vibe_description: str
    image_url: str
    match_score: float
    scores_breakdown: Optional[Dict[str, float]] = None


class CelebrityWithProducts(BaseModel):
    """Celebrity with their matched products"""
    celebrity: CelebrityMatch
    products: List[ProductRecommendation]
    total_products: int


class RecommendationResponse(BaseModel):
    """Complete recommendation response"""
    status: str = "success"
    timestamp: str
    matched_celebrities: List[CelebrityMatch]
    celebrity_product_groups: List[CelebrityWithProducts]
    all_recommendations: List[ProductRecommendation]
    total_recommendations: int
    request_params: Dict[str, Any]


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    recommender_loaded: bool
    timestamp: str


class ErrorResponse(BaseModel):
    """Error response model"""
    status: str = "error"
    message: str
    detail: Optional[str] = None
    timestamp: str


# ==================== Helper Functions ====================

def map_budget_to_tier(budget: str) -> str:
    """Map budget string to tier"""
    budget_map = {
        "Under ₹50,000 (Accessible luxury)": "affordable",
        "under ₹50,000": "affordable",
        "₹50,000 - ₹1,50,000 (Premium)": "moderate",
        "₹50,000 - ₹1,50,000": "moderate",
        "₹1,50,000 - ₹3,00,000 (Luxury)": "luxury",
        "₹1,50,000 - ₹3,00,000": "luxury",
        "Above ₹3,00,000 (Ultra-luxury)": "ultra-luxury",
        "above ₹3,00,000": "ultra-luxury"
    }
    
    # Try exact match first
    if budget in budget_map:
        return budget_map[budget]
    
    # Try case-insensitive match
    budget_lower = budget.lower()
    for key, value in budget_map.items():
        if key.lower() == budget_lower:
            return value
    
    # Default to moderate
    return "moderate"


def generate_user_vibe_text(survey: SurveyResponse) -> str:
    """Generate comprehensive vibe text from survey responses"""
    vibe_text = f"""
User Style Profile:

Overall Style Preference: {survey.style_preference}

Jewelry Type Preference: {survey.jewelry_type}

Sparkle Preference: {survey.sparkle_level}

Shopping For: {', '.join(survey.occasions)}

Budget Range: {survey.budget}

Celebrity Style Inspiration: {survey.celebrity_inspiration or 'Open to suggestions'}

Additional Preferences: {survey.additional_preferences or 'None'}

Style Summary: I prefer {survey.style_preference.lower()}. 
I'm looking for jewelry that works for {', '.join(survey.occasions[:3])}. 
I love {survey.jewelry_type.lower()} with {survey.sparkle_level.lower()}.
{f"I'm inspired by {survey.celebrity_inspiration}." if survey.celebrity_inspiration else ""}
    """.strip()
    
    return vibe_text


def group_products_by_celebrity(recommendations: List[Dict], 
                               celebrities: List[Dict],
                               include_scores: bool = False) -> List[Dict]:
    """
    Group recommended products by their best-matching celebrity
    """
    # Initialize groups for each celebrity
    celebrity_groups = []
    
    for celeb in celebrities:
        celeb_products = []
        
        for rec in recommendations:
            product = rec['product']
            
            # Calculate which celebrity this product best matches
            # For now, we'll distribute products across celebrities
            # In a more sophisticated version, you could track which celebrity 
            # influenced each product's recommendation
            
            celeb_products.append({
                'id': product['id'],
                'name': product['name'],
                'price': product['price'],
                'category': product['category'],
                'primary_style_tags': product.get('primary_style_tags', []),
                'secondary_style_tags': product.get('secondary_style_tags', []),
                'occasions': product.get('occasions', []),
                'vibe_description': product.get('vibe_description', ''),
                'image_url': product.get('image_url', ''),
                'match_score': float(rec['final_score']),
                'scores_breakdown': rec.get('scores_breakdown') if include_scores else None
            })
        
        # Distribute products roughly equally, or based on match scores
        products_per_celeb = len(recommendations) // len(celebrities)
        start_idx = celebrities.index(celeb) * products_per_celeb
        end_idx = start_idx + products_per_celeb if celeb != celebrities[-1] else len(recommendations)
        
        celebrity_groups.append({
            'celebrity': {
                'id': celeb['id'],
                'name': celeb['name'],
                'similarity_score': float(celeb['similarity_score']),
                'primary_vibe_tags': celeb.get('primary_vibe_tags', []),
                'secondary_vibe_tags': celeb.get('secondary_vibe_tags', []),
                'vibe_description': celeb.get('vibe_description', ''),
                'image_url': celeb.get('image_url')
            },
            'products': [celeb_products[i] for i in range(start_idx, min(end_idx, len(celeb_products)))],
            'total_products': min(end_idx - start_idx, len(celeb_products))
        })
    
    return celebrity_groups


# ==================== Startup & Shutdown ====================

@app.on_event("startup")
async def startup_event():
    """Load recommender on startup"""
    global recommender
    logger.info("Starting up Jewelry Recommendation API...")
    
    try:
        logger.info("Loading recommendation engine...")
        recommender = CelebrityProductRecommender('.')
        logger.info("✓ Recommendation engine loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load recommender: {e}")
        logger.warning("API will start but recommendations will fail until data is loaded")
        recommender = None


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Jewelry Recommendation API...")


# ==================== API Endpoints ====================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Jewelry Recommendation API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "recommendations": "POST /api/v1/recommendations",
            "health": "GET /health"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if recommender is not None else "degraded",
        "version": "1.0.0",
        "recommender_loaded": recommender is not None,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post(
    "/api/v1/recommendations",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Recommendations"],
    summary="Get jewelry recommendations",
    description="Submit user survey and get personalized jewelry recommendations with celebrity matches"
)
async def get_recommendations(request: RecommendationRequest):
    """
    Main recommendation endpoint
    
    Takes user survey responses and returns:
    - Matched celebrities
    - Product recommendations grouped by celebrity
    - Overall product recommendations
    """
    try:
        # Check if recommender is loaded
        if recommender is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Recommendation engine not loaded. Please ensure embeddings are generated."
            )
        
        logger.info(f"Processing recommendation request for {len(request.survey.occasions)} occasions")
        
        # Generate user vibe text
        user_vibe_text = generate_user_vibe_text(request.survey)
        
        # Map budget to tier
        budget_tier = map_budget_to_tier(request.survey.budget)
        
        # Get recommendations
        recommendations, matched_celebrities = recommender.recommend_products(
            user_vibe_text=user_vibe_text,
            user_occasions=request.survey.occasions,
            user_budget=budget_tier,
            top_n=request.top_n,
            celebrity_threshold=request.celebrity_threshold,
            explain=request.include_scores
        )
        
        logger.info(f"Generated {len(recommendations)} recommendations with {len(matched_celebrities)} celebrity matches")
        
        # Format celebrity matches
        celebrity_matches = [
            {
                'id': celeb['id'],
                'name': celeb['name'],
                'similarity_score': float(celeb['similarity_score']),
                'primary_vibe_tags': celeb.get('primary_vibe_tags', []),
                'secondary_vibe_tags': celeb.get('secondary_vibe_tags', []),
                'vibe_description': celeb.get('vibe_description', ''),
                'image_url': celeb.get('image_url')
            }
            for celeb in matched_celebrities
        ]
        
        # Group products by celebrity
        celebrity_product_groups = group_products_by_celebrity(
            recommendations, 
            matched_celebrities,
            request.include_scores
        )
        
        # Format all recommendations
        all_recommendations = [
            {
                'id': rec['product']['id'],
                'name': rec['product']['name'],
                'price': rec['product']['price'],
                'description': rec['product'].get('description', ''),
                'category': rec['product']['category'],
                'primary_style_tags': rec['product'].get('primary_style_tags', []),
                'secondary_style_tags': rec['product'].get('secondary_style_tags', []),
                'occasions': rec['product'].get('occasions', []),
                'vibe_description': rec['product'].get('vibe_description', ''),
                'image_url': rec['product'].get('image_url', ''),
                'match_score': float(rec['final_score']),
                'scores_breakdown': rec.get('scores_breakdown') if request.include_scores else None
            }
            for rec in recommendations
        ]
        
        # Build response
        response = {
            'status': 'success',
            'timestamp': datetime.utcnow().isoformat(),
            'matched_celebrities': celebrity_matches,
            'celebrity_product_groups': celebrity_product_groups,
            'all_recommendations': all_recommendations,
            'total_recommendations': len(all_recommendations),
            'request_params': {
                'top_n': request.top_n,
                'celebrity_threshold': request.celebrity_threshold,
                'budget_tier': budget_tier,
                'occasions': request.survey.occasions
            }
        }
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing recommendation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recommendations: {str(e)}"
        )


@app.post(
    "/api/v1/celebrities/match",
    tags=["Celebrities"],
    summary="Match user with celebrities only",
    description="Get celebrity matches without product recommendations"
)
async def match_celebrities(survey: SurveyResponse, top_k: int = 3):
    """
    Match user with celebrities based on their style preferences
    """
    try:
        if recommender is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Recommendation engine not loaded"
            )
        
        # Generate user vibe text
        user_vibe_text = generate_user_vibe_text(survey)
        
        # Encode user preferences
        user_embedding = recommender.encode_user_preferences(user_vibe_text)
        
        # Find matching celebrities
        matched_celebrities = recommender.find_matching_celebrities(
            user_embedding,
            top_k=top_k,
            threshold=0.3
        )
        
        # Format response
        celebrity_matches = [
            {
                'id': celeb['id'],
                'name': celeb['name'],
                'similarity_score': float(celeb['similarity_score']),
                'primary_vibe_tags': celeb.get('primary_vibe_tags', []),
                'secondary_vibe_tags': celeb.get('secondary_vibe_tags', []),
                'vibe_description': celeb.get('vibe_description', ''),
                'image_url': celeb.get('image_url')
            }
            for celeb in matched_celebrities
        ]
        
        return {
            'status': 'success',
            'timestamp': datetime.utcnow().isoformat(),
            'matched_celebrities': celebrity_matches,
            'total_matches': len(celebrity_matches)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error matching celebrities: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error matching celebrities: {str(e)}"
        )


# ==================== Error Handlers ====================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "status": "error",
        "message": "Endpoint not found",
        "detail": f"The endpoint {request.url.path} does not exist",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {
        "status": "error",
        "message": "Internal server error",
        "detail": "An unexpected error occurred",
        "timestamp": datetime.utcnow().isoformat()
    }


# ==================== Run Server ====================

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080)),
        reload=False,
        log_level="info"
    )
