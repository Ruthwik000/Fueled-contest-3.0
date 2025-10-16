"""
Celebrity-Based Product Recommendation Engine
Hybrid approach combining vector similarity with style taxonomy matching
"""

import json
import numpy as np
import pickle
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

from style_taxonomy import (
    STYLE_TAXONOMY, 
    OCCASION_COMPATIBILITY,
    PRICE_TIERS,
    get_style_affinity_score,
    get_occasion_compatibility_score,
    get_category_preference_score
)


class CelebrityProductRecommender:
    """
    Advanced recommendation system that matches users to products via celebrity style matching
    """
    
    def __init__(self, data_dir: str = '.'):
        """
        Initialize the recommender with pre-computed embeddings
        
        Args:
            data_dir: Directory containing data files
        """
        self.data_dir = Path(data_dir)
        
        # Recommendation weights (tunable for optimization)
        self.weights = {
            'vibe_similarity': 0.30,      # Celebrity vibe → user match
            'product_similarity': 0.25,   # Product style → user match
            'style_taxonomy': 0.25,       # Taxonomy-based style matching
            'occasion_match': 0.12,       # Occasion compatibility
            'price_compatibility': 0.05,  # Price tier matching
            'diversity_bonus': 0.03       # Encourage variety
        }
        
        # Load data
        print("Initializing Celebrity Product Recommender...")
        self._load_data()
        print("✓ Recommender ready!")
    
    def _load_data(self):
        """Load all necessary data files"""
        # Load celebrities with vectors
        celeb_path = self.data_dir / 'celebrities_with_vectors.json'
        with open(celeb_path, 'r', encoding='utf-8') as f:
            self.celebrities = json.load(f)
        print(f"✓ Loaded {len(self.celebrities)} celebrities")
        
        # Load celebrity embeddings
        celeb_emb_path = self.data_dir / 'celebrity_embeddings.pkl'
        with open(celeb_emb_path, 'rb') as f:
            self.celebrity_embeddings = pickle.load(f)
        
        # Load products with vectors
        prod_path = self.data_dir / 'products_with_vectors.json'
        with open(prod_path, 'r', encoding='utf-8') as f:
            self.products = json.load(f)
        print(f"✓ Loaded {len(self.products)} products")
        
        # Load product embeddings
        prod_emb_path = self.data_dir / 'product_embeddings.pkl'
        with open(prod_emb_path, 'rb') as f:
            self.product_embeddings = pickle.load(f)
        
        # Load sentence transformer for user query encoding
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✓ Loaded sentence transformer model")
    
    def encode_user_preferences(self, user_text: str) -> np.ndarray:
        """
        Encode user preference text into embedding vector
        
        Args:
            user_text: Combined user responses and preferences
        
        Returns:
            np.ndarray: Normalized embedding vector
        """
        embedding = self.model.encode(
            user_text, 
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        return embedding
    
    def find_matching_celebrities(self, 
                                 user_embedding: np.ndarray,
                                 top_k: int = 3,
                                 threshold: float = 0.5) -> List[Dict]:
        """
        Find celebrities that match user's vibe preferences
        
        Args:
            user_embedding: User's preference embedding
            top_k: Number of top celebrities to return
            threshold: Minimum similarity threshold
        
        Returns:
            List of celebrity dicts with similarity scores
        """
        # Calculate similarities
        similarities = cosine_similarity(
            user_embedding.reshape(1, -1),
            self.celebrity_embeddings
        )[0]
        
        # Get top matches above threshold
        top_indices = np.argsort(similarities)[::-1]
        
        matches = []
        for idx in top_indices:
            if similarities[idx] >= threshold and len(matches) < top_k:
                celeb = self.celebrities[idx].copy()
                celeb['similarity_score'] = float(similarities[idx])
                matches.append(celeb)
        
        # If no matches above threshold, get top 3 anyway
        if len(matches) == 0:
            for idx in top_indices[:top_k]:
                celeb = self.celebrities[idx].copy()
                celeb['similarity_score'] = float(similarities[idx])
                matches.append(celeb)
        
        return matches
    
    def calculate_style_taxonomy_score(self, 
                                      celebrity: Dict, 
                                      product: Dict) -> float:
        """
        Calculate style affinity using taxonomy mapping
        
        Args:
            celebrity: Celebrity dict with vibe tags
            product: Product dict with style tags
        
        Returns:
            float: Taxonomy-based affinity score (0.0 to 1.0)
        """
        celeb_tags = celebrity.get('primary_vibe_tags', []) + \
                    celebrity.get('secondary_vibe_tags', [])
        product_tags = product.get('primary_style_tags', []) + \
                      product.get('secondary_style_tags', [])
        
        if not celeb_tags or not product_tags:
            return 0.0
        
        # Calculate affinity scores for all tag pairs
        scores = []
        for celeb_tag in celeb_tags:
            for product_tag in product_tags:
                score = get_style_affinity_score(celeb_tag, product_tag)
                scores.append(score)
        
        if not scores:
            return 0.0
        
        # Use weighted average (emphasize positive scores)
        positive_scores = [s for s in scores if s > 0]
        negative_scores = [s for s in scores if s < 0]
        
        if not positive_scores:
            return max(0.0, np.mean(scores))  # Avoid negative overall
        
        # Positive scores weighted more
        pos_weight = 0.8
        neg_weight = 0.2
        
        positive_avg = np.mean(positive_scores) if positive_scores else 0
        negative_avg = np.mean(negative_scores) if negative_scores else 0
        
        final_score = (pos_weight * positive_avg) + (neg_weight * negative_avg)
        
        return max(0.0, min(1.0, (final_score + 1.0) / 2.0))  # Normalize to 0-1
    
    def calculate_occasion_score(self, 
                                user_occasions: List[str],
                                product: Dict,
                                celebrity: Dict) -> float:
        """
        Calculate how well product matches user's occasions
        
        Args:
            user_occasions: List of occasions user is shopping for
            product: Product dict
            celebrity: Matched celebrity dict
        
        Returns:
            float: Occasion compatibility score
        """
        if not user_occasions:
            return 0.5  # Neutral
        
        product_occasions = set(product.get('occasions', []))
        user_occasion_set = set(user_occasions)
        
        # Direct overlap
        direct_overlap = len(user_occasion_set & product_occasions)
        direct_score = direct_overlap / len(user_occasion_set) if user_occasion_set else 0
        
        # Taxonomy-based occasion matching
        product_tags = product.get('primary_style_tags', []) + \
                      product.get('secondary_style_tags', [])
        celeb_tags = celebrity.get('primary_vibe_tags', []) + \
                    celebrity.get('secondary_vibe_tags', [])
        
        occasion_scores = []
        for occasion in user_occasions:
            occ_score = get_occasion_compatibility_score(occasion, product_tags, celeb_tags)
            occasion_scores.append(occ_score)
        
        taxonomy_score = np.mean(occasion_scores) if occasion_scores else 0.5
        
        # Combine scores
        return (0.6 * direct_score) + (0.4 * taxonomy_score)
    
    def calculate_price_score(self, 
                             user_budget: str, 
                             product: Dict) -> float:
        """
        Calculate price compatibility score
        
        Args:
            user_budget: Budget tier ('affordable', 'moderate', 'luxury', 'ultra-luxury')
            product: Product dict
        
        Returns:
            float: Price compatibility (0.0 to 1.0)
        """
        if user_budget not in PRICE_TIERS:
            return 0.5  # Neutral
        
        # Extract product price
        price_str = product.get('price', '0').replace(',', '').replace('INR', '').strip()
        try:
            price = float(price_str)
        except:
            return 0.5
        
        # Get budget range
        min_price, max_price = PRICE_TIERS[user_budget]['range']
        
        # Perfect match
        if min_price <= price <= max_price:
            return 1.0
        
        # Slight overlap (allow 20% flexibility)
        flexibility = 0.2
        
        if price < min_price:
            flex_min = min_price * (1 - flexibility)
            if price >= flex_min:
                return 0.7
            else:
                # Gradual decrease
                return max(0.3, 0.7 - (min_price - price) / min_price)
        else:  # price > max_price
            if max_price == float('inf'):
                return 1.0
            flex_max = max_price * (1 + flexibility)
            if price <= flex_max:
                return 0.7
            else:
                return max(0.3, 0.7 - (price - max_price) / max_price)
    
    def calculate_diversity_score(self, 
                                  recommended_products: List[Dict],
                                  candidate: Dict) -> float:
        """
        Encourage diversity in recommendations
        
        Args:
            recommended_products: Already recommended products
            candidate: Candidate product to score
        
        Returns:
            float: Diversity bonus multiplier (0.8 to 1.3)
        """
        if not recommended_products:
            return 1.0
        
        # Category diversity
        existing_categories = [p['category'] for p in recommended_products]
        if candidate['category'] not in existing_categories:
            diversity_score = 1.2
        else:
            # Penalize if category over-represented
            category_count = existing_categories.count(candidate['category'])
            diversity_score = max(0.8, 1.0 - (category_count * 0.1))
        
        # Style diversity
        existing_styles = set()
        for p in recommended_products:
            existing_styles.update(p.get('primary_style_tags', []))
        
        candidate_styles = set(candidate.get('primary_style_tags', []))
        unique_styles = candidate_styles - existing_styles
        
        # Bonus for introducing new styles
        style_bonus = len(unique_styles) * 0.05
        
        return min(1.3, diversity_score + style_bonus)
    
    def recommend_products(self,
                          user_vibe_text: str,
                          user_occasions: List[str] = None,
                          user_budget: str = 'moderate',
                          top_n: int = 10,
                          celebrity_threshold: float = 0.5,
                          explain: bool = False) -> List[Dict]:
        """
        Main recommendation function
        
        Args:
            user_vibe_text: User's combined preference text
            user_occasions: List of occasions
            user_budget: Budget tier
            top_n: Number of recommendations
            celebrity_threshold: Minimum celebrity similarity
            explain: Include explanation scores
        
        Returns:
            List of recommended products with scores
        """
        print("\n" + "="*60)
        print("Generating Recommendations")
        print("="*60)
        
        # Step 1: Encode user preferences
        print("Encoding user preferences...")
        user_embedding = self.encode_user_preferences(user_vibe_text)
        
        # Step 2: Find matching celebrities
        print("Finding matching celebrities...")
        matched_celebrities = self.find_matching_celebrities(
            user_embedding, 
            top_k=3, 
            threshold=celebrity_threshold
        )
        
        print(f"\nMatched Celebrities:")
        for celeb in matched_celebrities:
            print(f"  - {celeb['name']} (similarity: {celeb['similarity_score']:.3f})")
        
        # Step 3: Score all products
        print(f"\nScoring {len(self.products)} products...")
        product_scores = []
        
        for prod_idx, product in enumerate(self.products):
            scores_dict = {}
            
            # 1. Product-to-user vibe similarity
            product_user_sim = cosine_similarity(
                user_embedding.reshape(1, -1),
                self.product_embeddings[prod_idx].reshape(1, -1)
            )[0][0]
            scores_dict['product_similarity'] = float(product_user_sim)
            
            # 2. Celebrity vibe matching
            celeb_vibe_scores = []
            for celeb in matched_celebrities:
                celeb_score = celeb['similarity_score']
                celeb_vibe_scores.append(celeb_score)
            scores_dict['vibe_similarity'] = float(np.max(celeb_vibe_scores))
            
            # 3. Style taxonomy matching (best celebrity match)
            taxonomy_scores = []
            for celeb in matched_celebrities:
                tax_score = self.calculate_style_taxonomy_score(celeb, product)
                weighted_tax = tax_score * celeb['similarity_score']
                taxonomy_scores.append(weighted_tax)
            scores_dict['style_taxonomy'] = float(np.max(taxonomy_scores))
            
            # 4. Occasion compatibility
            best_celeb = matched_celebrities[0]
            scores_dict['occasion_match'] = self.calculate_occasion_score(
                user_occasions or [], product, best_celeb
            )
            
            # 5. Price compatibility
            scores_dict['price_compatibility'] = self.calculate_price_score(
                user_budget, product
            )
            
            # Calculate weighted final score
            final_score = sum(
                scores_dict[key] * self.weights[key]
                for key in scores_dict.keys()
            )
            
            product_scores.append({
                'product': product,
                'score': final_score,
                'scores_breakdown': scores_dict if explain else None
            })
        
        # Step 4: Sort and apply diversity
        print("Applying diversity bonus...")
        product_scores.sort(key=lambda x: x['score'], reverse=True)
        
        # Select diverse recommendations
        recommendations = []
        for candidate in product_scores:
            diversity_bonus = self.calculate_diversity_score(
                [r['product'] for r in recommendations],
                candidate['product']
            )
            
            candidate['diversity_bonus'] = diversity_bonus
            candidate['final_score'] = candidate['score'] * diversity_bonus
            recommendations.append(candidate)
            
            if len(recommendations) >= top_n * 2:  # Get extra for final sorting
                break
        
        # Final sort and trim
        recommendations.sort(key=lambda x: x['final_score'], reverse=True)
        final_recommendations = recommendations[:top_n]
        
        print(f"\n✓ Generated {len(final_recommendations)} recommendations")
        print("="*60)
        
        return final_recommendations, matched_celebrities
    
    def format_recommendations(self, 
                             recommendations: List[Dict],
                             matched_celebrities: List[Dict]) -> str:
        """
        Format recommendations as readable text
        
        Args:
            recommendations: List of recommendation dicts
            matched_celebrities: List of matched celebrity dicts
        
        Returns:
            str: Formatted recommendation text
        """
        output = []
        output.append("\n" + "="*80)
        output.append("YOUR PERSONALIZED JEWELRY RECOMMENDATIONS")
        output.append("="*80)
        
        # Celebrity matches
        output.append("\n🌟 YOUR STYLE MATCHES:")
        for i, celeb in enumerate(matched_celebrities, 1):
            output.append(f"\n{i}. {celeb['name']} ({celeb['similarity_score']:.1%} match)")
            output.append(f"   Vibe: {', '.join(celeb['primary_vibe_tags'])}")
            output.append(f"   {celeb['vibe_description'][:150]}...")
        
        # Products
        output.append("\n\n💎 RECOMMENDED PRODUCTS:")
        output.append("="*80)
        
        for i, rec in enumerate(recommendations, 1):
            product = rec['product']
            output.append(f"\n{i}. {product['name']}")
            output.append(f"   Price: {product['price']}")
            output.append(f"   Category: {product['category']}")
            output.append(f"   Style: {', '.join(product['primary_style_tags'])}")
            output.append(f"   Perfect for: {', '.join(product['occasions'][:3])}")
            output.append(f"   Match Score: {rec['final_score']:.3f}")
            
            if rec.get('scores_breakdown'):
                output.append(f"   Score Breakdown:")
                for key, value in rec['scores_breakdown'].items():
                    output.append(f"      - {key}: {value:.3f}")
            
            output.append(f"   {product['vibe_description'][:200]}...")
            output.append("")
        
        output.append("="*80)
        
        return "\n".join(output)


# Utility function for testing
def test_recommender():
    """Test the recommender with sample input"""
    recommender = CelebrityProductRecommender('.')
    
    # Sample user input
    user_text = """
    I love elegant and minimal jewelry that makes a statement without being too bold.
    I prefer modern designs with clean lines and timeless appeal.
    I'm looking for pieces that work for both formal events and can be dressed down.
    I appreciate craftsmanship and quality over flashiness.
    """
    
    recommendations, celebrities = recommender.recommend_products(
        user_vibe_text=user_text,
        user_occasions=['Weddings', 'Formal Events', 'Anniversary'],
        user_budget='moderate',
        top_n=10,
        explain=True
    )
    
    output = recommender.format_recommendations(recommendations, celebrities)
    print(output)
    
    return recommendations, celebrities


if __name__ == "__main__":
    test_recommender()
