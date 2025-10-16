"""
Example API Usage and Test Client
Demonstrates how to interact with the Jewelry Recommendation API
"""

import requests
import json
from typing import Dict, Any

# API Base URL
API_URL = "http://localhost:8000"


# ==================== Example Survey Data ====================

EXAMPLE_SURVEYS = {
    "elegant": {
        "style_preference": "Elegant and sophisticated - Refined with subtle luxury",
        "occasions": ["Weddings", "Formal Events", "Anniversary"],
        "jewelry_type": "Solitaire diamonds - Simple and stunning",
        "sparkle_level": "Moderate sparkle - Noticeable but balanced",
        "budget": "₹50,000 - ₹1,50,000 (Premium)",
        "celebrity_inspiration": "Classic elegance like Deepika Padukone",
        "additional_preferences": "Prefer white gold or platinum"
    },
    "modern": {
        "style_preference": "Modern and minimal - Clean lines and understated elegance",
        "occasions": ["Daily Wear", "Office/Professional", "Casual Events"],
        "jewelry_type": "Geometric designs - Modern and architectural",
        "sparkle_level": "Subtle sparkle - Just a hint of shine",
        "budget": "Under ₹50,000 (Accessible luxury)",
        "celebrity_inspiration": "Minimal chic like Alia Bhatt",
        "additional_preferences": "Rose gold preferred"
    },
    "bold": {
        "style_preference": "Bold and statement-making - I want to stand out",
        "occasions": ["Cocktail Parties", "Special Celebrations", "Weddings"],
        "jewelry_type": "Multi-stone pieces - Intricate and detailed",
        "sparkle_level": "Maximum sparkle - I want all the brilliance",
        "budget": "₹1,50,000 - ₹3,00,000 (Luxury)",
        "celebrity_inspiration": "Glamorous like Sonam Kapoor",
        "additional_preferences": "Love layered looks"
    }
}


# ==================== API Functions ====================

def check_health() -> Dict[str, Any]:
    """Check API health"""
    response = requests.get(f"{API_URL}/health")
    return response.json()


def get_recommendations(
    survey_data: Dict[str, Any],
    top_n: int = 10,
    celebrity_threshold: float = 0.4,
    include_scores: bool = False
) -> Dict[str, Any]:
    """
    Get jewelry recommendations
    
    Args:
        survey_data: User survey responses
        top_n: Number of recommendations
        celebrity_threshold: Minimum celebrity similarity
        include_scores: Include detailed scores
    
    Returns:
        API response with recommendations
    """
    payload = {
        "survey": survey_data,
        "top_n": top_n,
        "celebrity_threshold": celebrity_threshold,
        "include_scores": include_scores
    }
    
    response = requests.post(
        f"{API_URL}/api/v1/recommendations",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    return response.json()


def match_celebrities(
    survey_data: Dict[str, Any],
    top_k: int = 3
) -> Dict[str, Any]:
    """
    Match with celebrities only (no product recommendations)
    
    Args:
        survey_data: User survey responses
        top_k: Number of celebrity matches
    
    Returns:
        API response with celebrity matches
    """
    response = requests.post(
        f"{API_URL}/api/v1/celebrities/match",
        json=survey_data,
        params={"top_k": top_k},
        headers={"Content-Type": "application/json"}
    )
    
    return response.json()


# ==================== Display Functions ====================

def print_recommendations(response: Dict[str, Any], detailed: bool = False):
    """Pretty print recommendations"""
    print("\n" + "="*80)
    print("JEWELRY RECOMMENDATIONS")
    print("="*80)
    
    if response.get('status') != 'success':
        print(f"Error: {response.get('message', 'Unknown error')}")
        return
    
    # Celebrity matches
    print("\n🌟 YOUR CELEBRITY STYLE MATCHES:")
    for i, celeb in enumerate(response.get('matched_celebrities', []), 1):
        print(f"\n{i}. {celeb['name']} ({celeb['similarity_score']:.1%} match)")
        print(f"   Vibes: {', '.join(celeb['primary_vibe_tags'])}")
        if detailed:
            print(f"   {celeb['vibe_description'][:150]}...")
    
    # Celebrity-grouped products
    print("\n\n💎 RECOMMENDATIONS BY CELEBRITY:")
    print("="*80)
    
    for group in response.get('celebrity_product_groups', []):
        celeb = group['celebrity']
        products = group['products']
        
        print(f"\n✨ Inspired by {celeb['name']}:")
        print(f"   ({len(products)} products)")
        
        for i, product in enumerate(products[:3], 1):  # Show top 3 per celebrity
            print(f"\n   {i}. {product['name']}")
            print(f"      💰 {product['price']}")
            print(f"      📍 {', '.join(product['occasions'][:2])}")
            if detailed and product.get('scores_breakdown'):
                print(f"      🎯 Match Score: {product['match_score']:.3f}")
    
    # Overall top recommendations
    print("\n\n🏆 TOP 5 OVERALL RECOMMENDATIONS:")
    print("="*80)
    
    for i, product in enumerate(response.get('all_recommendations', [])[:5], 1):
        print(f"\n{i}. {product['name']}")
        print(f"   💰 {product['price']}")
        print(f"   ✨ Style: {', '.join(product['primary_style_tags'])}")
        print(f"   📍 Perfect for: {', '.join(product['occasions'][:2])}")
        print(f"   🎯 Match Score: {product['match_score']:.3f}")
        if product.get('image_url'):
            print(f"   🔗 {product['image_url']}")
    
    print("\n" + "="*80)
    print(f"Total Recommendations: {response.get('total_recommendations', 0)}")
    print("="*80 + "\n")


# ==================== Test Functions ====================

def test_health_check():
    """Test health check endpoint"""
    print("\n" + "="*60)
    print("Testing Health Check")
    print("="*60)
    
    try:
        health = check_health()
        print(f"Status: {health['status']}")
        print(f"Recommender Loaded: {health['recommender_loaded']}")
        print(f"Version: {health['version']}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


def test_recommendations(style: str = "elegant", detailed: bool = False):
    """Test recommendation endpoint"""
    print("\n" + "="*60)
    print(f"Testing Recommendations ({style} style)")
    print("="*60)
    
    try:
        survey = EXAMPLE_SURVEYS.get(style, EXAMPLE_SURVEYS['elegant'])
        response = get_recommendations(
            survey,
            top_n=10,
            include_scores=detailed
        )
        
        print_recommendations(response, detailed=detailed)
        
        # Save response to file
        with open(f'test_response_{style}.json', 'w', encoding='utf-8') as f:
            json.dump(response, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Response saved to test_response_{style}.json")
        
        return True
    except Exception as e:
        print(f"❌ Recommendation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_celebrity_matching(style: str = "modern"):
    """Test celebrity matching endpoint"""
    print("\n" + "="*60)
    print(f"Testing Celebrity Matching ({style} style)")
    print("="*60)
    
    try:
        survey = EXAMPLE_SURVEYS.get(style, EXAMPLE_SURVEYS['elegant'])
        response = match_celebrities(survey, top_k=5)
        
        print(f"\nStatus: {response['status']}")
        print(f"\n🌟 Matched Celebrities ({response['total_matches']}):")
        
        for i, celeb in enumerate(response['matched_celebrities'], 1):
            print(f"\n{i}. {celeb['name']}")
            print(f"   Similarity: {celeb['similarity_score']:.1%}")
            print(f"   Vibes: {', '.join(celeb['primary_vibe_tags'])}")
        
        return True
    except Exception as e:
        print(f"❌ Celebrity matching test failed: {e}")
        return False


# ==================== Example Usage ====================

def example_custom_survey():
    """Example with custom survey data"""
    print("\n" + "="*60)
    print("Custom Survey Example")
    print("="*60)
    
    custom_survey = {
        "style_preference": "Romantic and delicate - Soft, feminine designs",
        "occasions": ["Engagement/Anniversary", "Valentine's Day", "Special Celebrations"],
        "jewelry_type": "Nature-inspired - Floral, organic motifs",
        "sparkle_level": "Subtle sparkle - Just a hint of shine",
        "budget": "₹50,000 - ₹1,50,000 (Premium)",
        "celebrity_inspiration": "Delicate style like Shraddha Kapoor",
        "additional_preferences": "Prefer yellow gold with floral designs"
    }
    
    try:
        response = get_recommendations(custom_survey, top_n=8, include_scores=True)
        print_recommendations(response, detailed=True)
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


# ==================== Main ====================

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print(" " * 25 + "API TEST SUITE")
    print("="*80)
    
    # 1. Health check
    if not test_health_check():
        print("\n❌ Server is not healthy. Make sure to:")
        print("   1. Run: python generate_celebrity_vectors.py")
        print("   2. Run: python generate_product_vectors.py")
        print("   3. Start server: python server.py")
        return
    
    print("\n✓ Server is healthy!\n")
    
    # 2. Test recommendations for different styles
    for style in ["elegant", "modern", "bold"]:
        test_recommendations(style, detailed=True)
        print("\n" + "-"*60 + "\n")
    
    # 3. Test celebrity matching
    test_celebrity_matching("modern")
    
    # 4. Custom survey example
    example_custom_survey()
    
    print("\n" + "="*80)
    print(" " * 30 + "TESTS COMPLETE")
    print("="*80 + "\n")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "health":
            test_health_check()
        elif command == "recommend":
            style = sys.argv[2] if len(sys.argv) > 2 else "elegant"
            test_recommendations(style, detailed=True)
        elif command == "celebrity":
            style = sys.argv[2] if len(sys.argv) > 2 else "modern"
            test_celebrity_matching(style)
        elif command == "custom":
            example_custom_survey()
        else:
            print(f"Unknown command: {command}")
            print("Usage: python api_test.py [health|recommend|celebrity|custom] [style]")
    else:
        main()
