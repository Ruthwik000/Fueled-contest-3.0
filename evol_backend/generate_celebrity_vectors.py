"""
Celebrity Vibe Vector Generation Script
Generates semantic embeddings for each celebrity using sentence-transformers
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path
import pickle
from typing import List, Dict

class CelebrityVectorGenerator:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize the vector generator with a sentence transformer model
        
        Args:
            model_name: Hugging Face model name for sentence transformers
                       'all-MiniLM-L6-v2' - Fast, good quality (default)
                       'all-mpnet-base-v2' - Higher quality, slower
        """
        print(f"Loading sentence transformer model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Model loaded successfully!")
        
    def generate_celebrity_vibe_text(self, celeb: Dict) -> str:
        """
        Generate comprehensive text representation of celebrity's vibe
        This combines all relevant fields into a rich text description
        """
        # Extract all vibe components
        name = celeb.get('name', '')
        description = celeb.get('description', '')
        vibe_description = celeb.get('vibe_description', '')
        primary_vibes = ', '.join(celeb.get('primary_vibe_tags', []))
        secondary_vibes = ', '.join(celeb.get('secondary_vibe_tags', []))
        
        # Create comprehensive vibe text
        vibe_text = f"""
Celebrity: {name}

Style Profile: {description}

Primary Style Characteristics: {primary_vibes}
Secondary Style Characteristics: {secondary_vibes}

Detailed Vibe: {vibe_description}

Overall Aesthetic: {primary_vibes} with elements of {secondary_vibes}.
        """.strip()
        
        return vibe_text
    
    def generate_embeddings(self, celebrities: List[Dict]) -> tuple:
        """
        Generate embeddings for all celebrities
        
        Returns:
            tuple: (celebrities_with_vectors, embeddings_array)
        """
        print(f"\nGenerating embeddings for {len(celebrities)} celebrities...")
        
        vibe_texts = []
        for celeb in celebrities:
            vibe_text = self.generate_celebrity_vibe_text(celeb)
            vibe_texts.append(vibe_text)
        
        # Generate embeddings in batch (more efficient)
        print("Computing embeddings...")
        embeddings = self.model.encode(
            vibe_texts, 
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True  # Normalize for cosine similarity
        )
        
        # Add embeddings to celebrity objects
        for i, celeb in enumerate(celebrities):
            celeb['vibe_vector'] = embeddings[i].tolist()
            celeb['vibe_text'] = vibe_texts[i]  # Store for reference
        
        print(f"✓ Generated {len(embeddings)} embeddings of dimension {embeddings.shape[1]}")
        
        return celebrities, embeddings
    
    def save_embeddings(self, celebrities: List[Dict], embeddings: np.ndarray, 
                       output_dir: str = '.'):
        """
        Save celebrities with vectors and embeddings array
        """
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Save updated celebrities JSON with vibe_vectors
        json_path = output_path / 'celebrities_with_vectors.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(celebrities, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved celebrities with vectors to: {json_path}")
        
        # Save embeddings array separately for fast loading
        embeddings_path = output_path / 'celebrity_embeddings.pkl'
        with open(embeddings_path, 'wb') as f:
            pickle.dump(embeddings, f)
        print(f"✓ Saved embeddings array to: {embeddings_path}")
        
        # Save metadata
        metadata = {
            'num_celebrities': len(celebrities),
            'embedding_dimension': embeddings.shape[1],
            'model_name': self.model.get_sentence_embedding_dimension(),
            'celebrity_ids': [c['id'] for c in celebrities]
        }
        metadata_path = output_path / 'celebrity_embeddings_metadata.json'
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        print(f"✓ Saved metadata to: {metadata_path}")
    
    def load_celebrities(self, filepath: str = 'celebrities.json') -> List[Dict]:
        """Load celebrities from JSON file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)


def main():
    """Main execution function"""
    print("=" * 60)
    print("Celebrity Vibe Vector Generation")
    print("=" * 60)
    
    # Initialize generator
    generator = CelebrityVectorGenerator(model_name='all-MiniLM-L6-v2')
    
    # Load celebrities
    print("\nLoading celebrities...")
    celebrities = generator.load_celebrities('celebrities.json')
    print(f"✓ Loaded {len(celebrities)} celebrities")
    
    # Show sample celebrity vibe text
    print("\n" + "=" * 60)
    print("Sample Celebrity Vibe Text:")
    print("=" * 60)
    sample_text = generator.generate_celebrity_vibe_text(celebrities[0])
    print(sample_text)
    print("=" * 60)
    
    # Generate embeddings
    celebrities_with_vectors, embeddings = generator.generate_embeddings(celebrities)
    
    # Save results
    print("\nSaving results...")
    generator.save_embeddings(celebrities_with_vectors, embeddings)
    
    # Display summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Total celebrities processed: {len(celebrities_with_vectors)}")
    print(f"Embedding dimension: {embeddings.shape[1]}")
    print(f"Embedding shape: {embeddings.shape}")
    print(f"\nCelebrity names:")
    for celeb in celebrities_with_vectors:
        print(f"  - {celeb['name']} ({celeb['id']})")
    
    print("\n✓ Celebrity vibe vectors generated successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
