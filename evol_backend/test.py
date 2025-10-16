"""
Main Recommendation System
End-to-end workflow for generating jewelry recommendations
"""

import sys
from pathlib import Path

from user_questionnaire import run_interactive_questionnaire, quick_test_mode
from recommender_engine import CelebrityProductRecommender


def main():
    """
    Main execution flow
    """
    print("\n")
    print("="*80)
    print(" " * 20 + "JEWELRY RECOMMENDATION SYSTEM")
    print("="*80)
    print("\nWelcome to the AI-powered jewelry recommendation system!")
    print("We'll match you with celebrity styles and find your perfect pieces.\n")
    
    # Mode selection
    print("Choose mode:")
    print("  1. Interactive Mode - Answer questions about your style")
    print("  2. Quick Test Mode - Use predefined style profiles")
    print("  3. Exit")
    
    mode = input("\nEnter 1, 2, or 3: ").strip()
    
    if mode == "3":
        print("\nGoodbye!")
        return
    
    # Get user preferences
    if mode == "2":
        print("\nSelect test style:")
        print("  1. Elegant & Sophisticated")
        print("  2. Modern & Minimal")
        print("  3. Bold & Statement")
        print("  4. Romantic & Delicate")
        
        style_choice = input("\nEnter 1-4: ").strip()
        style_map = {'1': 'elegant', '2': 'modern', '3': 'bold', '4': 'minimal'}
        style = style_map.get(style_choice, 'elegant')
        
        vibe_text, budget, occasions, responses = quick_test_mode(style)
    else:
        vibe_text, budget, occasions, responses = run_interactive_questionnaire()
    
    # Initialize recommender
    print("\n\nInitializing recommendation engine...")
    try:
        recommender = CelebrityProductRecommender('.')
    except FileNotFoundError as e:
        print(f"\n❌ Error: Required data files not found!")
        print("Please run the following scripts first:")
        print("  1. python generate_celebrity_vectors.py")
        print("  2. python generate_product_vectors.py")
        return
    
    # Generate recommendations
    print("\nAnalyzing your preferences and matching with celebrity styles...")
    
    recommendations, celebrities = recommender.recommend_products(
        user_vibe_text=vibe_text,
        user_occasions=occasions,
        user_budget=budget,
        top_n=10,
        celebrity_threshold=0.4,
        explain=True
    )
    
    # Format and display results
    output = recommender.format_recommendations(recommendations, celebrities)
    print(output)
    
    # Save results
    save_choice = input("\nWould you like to save these recommendations? (y/n): ").strip().lower()
    if save_choice == 'y':
        output_file = Path('.') / 'latest_recommendations.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"✓ Recommendations saved to {output_file}")
        
        # Save detailed JSON
        import json
        json_output = {
            'user_profile': responses,
            'matched_celebrities': [
                {
                    'name': c['name'],
                    'similarity': c['similarity_score'],
                    'vibes': c['primary_vibe_tags']
                }
                for c in celebrities
            ],
            'recommendations': [
                {
                    'rank': i + 1,
                    'product_id': rec['product']['id'],
                    'name': rec['product']['name'],
                    'price': rec['product']['price'],
                    'category': rec['product']['category'],
                    'style_tags': rec['product']['primary_style_tags'],
                    'occasions': rec['product']['occasions'],
                    'match_score': rec['final_score'],
                    'image_url': rec['product']['image_url']
                }
                for i, rec in enumerate(recommendations)
            ]
        }
        
        json_file = Path('.') / 'latest_recommendations.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_output, f, indent=2, ensure_ascii=False)
        print(f"✓ Detailed results saved to {json_file}")
    
    # Show top 3 products
    print("\n" + "="*80)
    print("TOP 3 RECOMMENDATIONS:")
    print("="*80)
    for i, rec in enumerate(recommendations[:3], 1):
        product = rec['product']
        print(f"\n{i}. {product['name']}")
        print(f"   💰 {product['price']}")
        print(f"   ✨ {', '.join(product['primary_style_tags'])}")
        print(f"   📍 Perfect for: {', '.join(product['occasions'][:2])}")
        print(f"   🔗 {product['image_url']}")
    
    print("\n" + "="*80)
    print("Thank you for using the Jewelry Recommendation System!")
    print("="*80 + "\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        import traceback
        traceback.print_exc()
