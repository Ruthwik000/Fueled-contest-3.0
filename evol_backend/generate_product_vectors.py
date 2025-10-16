"""
Product Vector Generation Script
Generates semantic embeddings for each product using sentence-transformers
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path
import pickle
from typing import List, Dict

class ProductVectorGenerator:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize the vector generator with a sentence transformer model
        Same model as celebrity vectors for comparable embeddings
        """
        print(f"Loading sentence transformer model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Model loaded successfully!")
        
    def generate_product_style_text(self, product: Dict) -> str:
        """
        Generate comprehensive text representation of product's style
        """
        # Extract all style components
        name = product.get('name', '')
        description = product.get('description', '')
        vibe_description = product.get('vibe_description', '')
        category = product.get('category', '')
        primary_styles = ', '.join(product.get('primary_style_tags', []))
        secondary_styles = ', '.join(product.get('secondary_style_tags', []))
        occasions = ', '.join(product.get('occasions', []))
        material = product.get('material', 'Diamond and Gold')
        
        # Extract price tier
        price_str = product.get('price', '0')
        price = float(price_str.replace(',', '').replace('INR', '').strip())
        
        if price > 300000:
            price_tier = "ultra-luxury"
        elif price > 150000:
            price_tier = "luxury"
        elif price > 50000:
            price_tier = "premium"
        else:
            price_tier = "accessible luxury"
        
        # Create comprehensive product text
        product_text = f"""
Product: {name}

Category: {category}
Price Tier: {price_tier}

Primary Style: {primary_styles}
Secondary Style: {secondary_styles}

Perfect For: {occasions}

Description: {description}

Style Essence: {vibe_description}

Materials: {material if material else 'Fine diamonds and gold'}

Overall Aesthetic: {primary_styles} design with {secondary_styles} elements, ideal for {occasions}.
        """.strip()
        
        return product_text
    
    def generate_embeddings(self, products: List[Dict]) -> tuple:
        """
        Generate embeddings for all products
        
        Returns:
            tuple: (products_with_vectors, embeddings_array)
        """
        print(f"\nGenerating embeddings for {len(products)} products...")
        
        product_texts = []
        for product in products:
            product_text = self.generate_product_style_text(product)
            product_texts.append(product_text)
        
        # Generate embeddings in batch
        print("Computing embeddings...")
        embeddings = self.model.encode(
            product_texts, 
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True  # Normalize for cosine similarity
        )
        
        # Add embeddings to product objects
        for i, product in enumerate(products):
            product['style_vector'] = embeddings[i].tolist()
            product['style_text'] = product_texts[i]  # Store for reference
        
        print(f"✓ Generated {len(embeddings)} embeddings of dimension {embeddings.shape[1]}")
        
        return products, embeddings
    
    def save_embeddings(self, products: List[Dict], embeddings: np.ndarray, 
                       output_dir: str = '.'):
        """
        Save products with vectors and embeddings array
        """
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Save updated products JSON with style_vectors
        json_path = output_path / 'products_with_vectors.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved products with vectors to: {json_path}")
        
        # Save embeddings array separately for fast loading
        embeddings_path = output_path / 'product_embeddings.pkl'
        with open(embeddings_path, 'wb') as f:
            pickle.dump(embeddings, f)
        print(f"✓ Saved embeddings array to: {embeddings_path}")
        
        # Save metadata
        metadata = {
            'num_products': len(products),
            'embedding_dimension': embeddings.shape[1],
            'model_name': self.model.get_sentence_embedding_dimension(),
            'categories': list(set(p['category'] for p in products)),
            'product_ids': [p['id'] for p in products]
        }
        metadata_path = output_path / 'product_embeddings_metadata.json'
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        print(f"✓ Saved metadata to: {metadata_path}")
    
    def load_products(self, filepath: str = 'products.json') -> List[Dict]:
        """Load products from JSON file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)


def main():
    """Main execution function"""
    print("=" * 60)
    print("Product Style Vector Generation")
    print("=" * 60)
    
    # Initialize generator
    generator = ProductVectorGenerator(model_name='all-MiniLM-L6-v2')
    
    # Load products
    print("\nLoading products...")
    products = generator.load_products('products.json')
    print(f"✓ Loaded {len(products)} products")
    
    # Show sample product style text
    print("\n" + "=" * 60)
    print("Sample Product Style Text:")
    print("=" * 60)
    sample_text = generator.generate_product_style_text(products[0])
    print(sample_text)
    print("=" * 60)
    
    # Generate embeddings
    products_with_vectors, embeddings = generator.generate_embeddings(products)
    
    # Save results
    print("\nSaving results...")
    generator.save_embeddings(products_with_vectors, embeddings)
    
    # Display summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Total products processed: {len(products_with_vectors)}")
    print(f"Embedding dimension: {embeddings.shape[1]}")
    print(f"Embedding shape: {embeddings.shape}")
    
    # Category breakdown
    categories = {}
    for p in products_with_vectors:
        cat = p['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"\nProducts by category:")
    for cat, count in sorted(categories.items()):
        print(f"  - {cat}: {count} products")
    
    print("\n✓ Product style vectors generated successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
