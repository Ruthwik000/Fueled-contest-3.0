"""
Style Taxonomy Configuration
Maps celebrity vibe tags to product style tags with semantic relationships
"""

# Primary style taxonomy: Celebrity vibe → Product style mappings
STYLE_TAXONOMY = {
    # Elegant vibes
    'Elegant': {
        'primary_match': ['Classic', 'Timeless', 'Elegant', 'Refined'],
        'secondary_match': ['Sophisticated', 'Delicate', 'Vintage-inspired'],
        'avoid': ['Bold', 'Eclectic', 'Playful'],
        'weight': 1.0
    },
    
    # Modern/Contemporary vibes
    'Modern': {
        'primary_match': ['Modern', 'Contemporary', 'Minimalist', 'Sleek'],
        'secondary_match': ['Geometric', 'Chic', 'Refined'],
        'avoid': ['Vintage-inspired', 'Ornate', 'Traditional'],
        'weight': 1.0
    },
    'Contemporary': {
        'primary_match': ['Modern', 'Contemporary', 'Chic'],
        'secondary_match': ['Minimalist', 'Geometric', 'Sleek'],
        'avoid': ['Vintage-inspired', 'Heritage'],
        'weight': 1.0
    },
    
    # Minimal vibes
    'Minimal': {
        'primary_match': ['Minimalist', 'Delicate', 'Refined', 'Sleek'],
        'secondary_match': ['Modern', 'Elegant', 'Subtle'],
        'avoid': ['Ornate', 'Layered', 'Bold', 'Statement'],
        'weight': 1.0
    },
    'Understated': {
        'primary_match': ['Minimalist', 'Delicate', 'Refined'],
        'secondary_match': ['Elegant', 'Subtle', 'Classic'],
        'avoid': ['Bold', 'Statement', 'Glamorous'],
        'weight': 0.9
    },
    
    # Statement/Bold vibes
    'Statement': {
        'primary_match': ['Statement', 'Bold', 'Luxury'],
        'secondary_match': ['Glamorous', 'Ornate', 'Layered'],
        'avoid': ['Minimal', 'Delicate', 'Understated'],
        'weight': 1.0
    },
    'Bold': {
        'primary_match': ['Bold', 'Statement', 'Glamorous'],
        'secondary_match': ['Luxury', 'Ornate', 'Modern'],
        'avoid': ['Delicate', 'Minimal', 'Subtle'],
        'weight': 1.0
    },
    
    # Classic/Timeless vibes
    'Classic': {
        'primary_match': ['Classic', 'Timeless', 'Elegant'],
        'secondary_match': ['Vintage-inspired', 'Sophisticated', 'Refined'],
        'avoid': ['Avant-garde', 'Eclectic', 'Trendy'],
        'weight': 1.0
    },
    'Timeless': {
        'primary_match': ['Timeless', 'Classic', 'Elegant'],
        'secondary_match': ['Refined', 'Sophisticated', 'Traditional'],
        'avoid': ['Trendy', 'Fashion-forward', 'Eclectic'],
        'weight': 1.0
    },
    
    # Glamorous vibes
    'Glamorous': {
        'primary_match': ['Glamorous', 'Luxury', 'Statement'],
        'secondary_match': ['Bold', 'Ornate', 'Elegant'],
        'avoid': ['Minimal', 'Understated', 'Delicate'],
        'weight': 1.0
    },
    
    # Luxury vibes
    'Luxury': {
        'primary_match': ['Luxury', 'Statement', 'Ornate'],
        'secondary_match': ['Glamorous', 'Elegant', 'Timeless'],
        'avoid': ['Minimal', 'Casual'],
        'weight': 1.0
    },
    
    # Delicate vibes
    'Delicate': {
        'primary_match': ['Delicate', 'Minimalist', 'Refined'],
        'secondary_match': ['Elegant', 'Subtle', 'Nature-inspired'],
        'avoid': ['Bold', 'Statement', 'Ornate'],
        'weight': 1.0
    },
    
    # Chic vibes
    'Chic': {
        'primary_match': ['Chic', 'Modern', 'Contemporary'],
        'secondary_match': ['Elegant', 'Minimalist', 'Sophisticated'],
        'avoid': ['Traditional', 'Vintage-inspired'],
        'weight': 0.9
    },
    
    # Trendy/Fashion-forward vibes
    'Trendy': {
        'primary_match': ['Modern', 'Contemporary', 'Chic'],
        'secondary_match': ['Bold', 'Statement', 'Geometric'],
        'avoid': ['Classic', 'Timeless', 'Vintage-inspired'],
        'weight': 0.9
    },
    'Fashion-forward': {
        'primary_match': ['Modern', 'Contemporary', 'Statement'],
        'secondary_match': ['Bold', 'Geometric', 'Avant-garde'],
        'avoid': ['Classic', 'Traditional', 'Timeless'],
        'weight': 0.9
    },
    
    # Eclectic/Playful vibes
    'Eclectic': {
        'primary_match': ['Bold', 'Statement', 'Modern'],
        'secondary_match': ['Geometric', 'Layered', 'Multi-stone'],
        'avoid': ['Classic', 'Minimal', 'Timeless'],
        'weight': 0.8
    },
    'Playful': {
        'primary_match': ['Modern', 'Contemporary', 'Chic'],
        'secondary_match': ['Bold', 'Geometric', 'Nature-inspired'],
        'avoid': ['Formal', 'Classic', 'Timeless'],
        'weight': 0.8
    },
    
    # Regal/Heritage vibes
    'Regal': {
        'primary_match': ['Luxury', 'Ornate', 'Statement'],
        'secondary_match': ['Classic', 'Timeless', 'Elegant'],
        'avoid': ['Minimal', 'Modern', 'Casual'],
        'weight': 1.0
    },
    'Heritage': {
        'primary_match': ['Classic', 'Timeless', 'Vintage-inspired'],
        'secondary_match': ['Ornate', 'Traditional', 'Elegant'],
        'avoid': ['Modern', 'Contemporary', 'Minimal'],
        'weight': 0.9
    },
    
    # Avant-garde
    'Avant-garde': {
        'primary_match': ['Statement', 'Bold', 'Modern'],
        'secondary_match': ['Geometric', 'Contemporary', 'Ornate'],
        'avoid': ['Classic', 'Traditional', 'Minimal'],
        'weight': 0.9
    },
    
    # Versatile
    'Versatile': {
        'primary_match': ['Classic', 'Elegant', 'Timeless'],
        'secondary_match': ['Modern', 'Chic', 'Refined'],
        'avoid': [],  # Versatile works with most
        'weight': 0.8
    },
    
    # Refined
    'Refined': {
        'primary_match': ['Refined', 'Elegant', 'Classic'],
        'secondary_match': ['Sophisticated', 'Timeless', 'Delicate'],
        'avoid': ['Bold', 'Eclectic', 'Playful'],
        'weight': 0.9
    },
    
    # Sophisticated
    'Sophisticated': {
        'primary_match': ['Elegant', 'Refined', 'Classic'],
        'secondary_match': ['Luxury', 'Timeless', 'Modern'],
        'avoid': ['Playful', 'Casual', 'Eclectic'],
        'weight': 0.9
    }
}

# Occasion compatibility matrix
OCCASION_COMPATIBILITY = {
    'Weddings': {
        'compatible_styles': ['Luxury', 'Statement', 'Ornate', 'Elegant', 'Classic'],
        'compatible_vibes': ['Regal', 'Elegant', 'Timeless', 'Glamorous', 'Statement'],
        'weight': 1.0
    },
    'Formal Events': {
        'compatible_styles': ['Elegant', 'Classic', 'Luxury', 'Statement', 'Timeless'],
        'compatible_vibes': ['Elegant', 'Sophisticated', 'Classic', 'Glamorous'],
        'weight': 1.0
    },
    'Engagement': {
        'compatible_styles': ['Classic', 'Timeless', 'Romantic', 'Elegant'],
        'compatible_vibes': ['Romantic', 'Elegant', 'Classic', 'Timeless'],
        'weight': 1.0
    },
    'Anniversary': {
        'compatible_styles': ['Romantic', 'Timeless', 'Classic', 'Elegant'],
        'compatible_vibes': ['Romantic', 'Elegant', 'Timeless', 'Classic'],
        'weight': 1.0
    },
    "Valentine's Day": {
        'compatible_styles': ['Romantic', 'Delicate', 'Elegant'],
        'compatible_vibes': ['Romantic', 'Delicate', 'Elegant'],
        'weight': 0.9
    },
    'Daily Wear': {
        'compatible_styles': ['Minimalist', 'Delicate', 'Modern', 'Classic'],
        'compatible_vibes': ['Minimal', 'Understated', 'Modern', 'Chic'],
        'weight': 0.8
    },
    'Office Wear': {
        'compatible_styles': ['Minimalist', 'Delicate', 'Classic', 'Refined'],
        'compatible_vibes': ['Minimal', 'Refined', 'Elegant', 'Sophisticated'],
        'weight': 0.8
    },
    'Cocktail Parties': {
        'compatible_styles': ['Statement', 'Bold', 'Glamorous', 'Modern'],
        'compatible_vibes': ['Bold', 'Glamorous', 'Statement', 'Fashion-forward'],
        'weight': 0.9
    },
    'Red Carpet': {
        'compatible_styles': ['Luxury', 'Statement', 'Bold', 'Glamorous'],
        'compatible_vibes': ['Glamorous', 'Statement', 'Bold', 'Luxury'],
        'weight': 1.0
    },
    'Special Celebrations': {
        'compatible_styles': ['Elegant', 'Statement', 'Classic', 'Luxury'],
        'compatible_vibes': ['Elegant', 'Glamorous', 'Classic', 'Sophisticated'],
        'weight': 0.9
    },
    'Casual Events': {
        'compatible_styles': ['Modern', 'Chic', 'Minimalist', 'Delicate'],
        'compatible_vibes': ['Chic', 'Modern', 'Minimal', 'Playful'],
        'weight': 0.7
    }
}

# Price tier compatibility (for budget matching)
PRICE_TIERS = {
    'affordable': {
        'range': (0, 50000),
        'description': 'Accessible luxury pieces for everyday elegance'
    },
    'moderate': {
        'range': (40000, 150000),
        'description': 'Premium quality for special occasions'
    },
    'luxury': {
        'range': (120000, 300000),
        'description': 'High-end statement pieces for milestone moments'
    },
    'ultra-luxury': {
        'range': (250000, float('inf')),
        'description': 'Exceptional masterpieces for once-in-a-lifetime events'
    }
}

# Category preferences based on celebrity vibes
CATEGORY_PREFERENCES = {
    'Statement': ['necklaces', 'earrings-catalog', 'bracelets-catalog'],
    'Minimal': ['rings-catalog', 'pendants-catalog', 'earrings-catalog'],
    'Elegant': ['necklaces', 'earrings-catalog', 'pendants-catalog'],
    'Bold': ['necklaces', 'earrings-catalog', 'bracelets-catalog'],
    'Delicate': ['rings-catalog', 'pendants-catalog', 'earrings-catalog'],
    'Modern': ['rings-catalog', 'earrings-catalog', 'pendants-catalog'],
    'Classic': ['rings-catalog', 'necklaces', 'earrings-catalog'],
}

def get_style_affinity_score(celeb_tag: str, product_tag: str) -> float:
    """
    Calculate affinity score between a celebrity vibe tag and product style tag
    
    Args:
        celeb_tag: Celebrity vibe tag
        product_tag: Product style tag
    
    Returns:
        float: Affinity score (0.0 to 1.0, negative for avoid matches)
    """
    if celeb_tag not in STYLE_TAXONOMY:
        return 0.0
    
    taxonomy = STYLE_TAXONOMY[celeb_tag]
    weight = taxonomy.get('weight', 1.0)
    
    if product_tag in taxonomy['primary_match']:
        return 1.0 * weight
    elif product_tag in taxonomy['secondary_match']:
        return 0.6 * weight
    elif product_tag in taxonomy['avoid']:
        return -0.5 * weight
    
    return 0.0


def get_occasion_compatibility_score(occasion: str, product_tags: list, celeb_tags: list) -> float:
    """
    Calculate how well a product matches an occasion based on tags
    
    Args:
        occasion: Occasion name
        product_tags: List of product style tags
        celeb_tags: List of celebrity vibe tags
    
    Returns:
        float: Compatibility score (0.0 to 1.0)
    """
    if occasion not in OCCASION_COMPATIBILITY:
        return 0.5  # Neutral if occasion not found
    
    occ_data = OCCASION_COMPATIBILITY[occasion]
    compatible_styles = set(occ_data['compatible_styles'])
    compatible_vibes = set(occ_data['compatible_vibes'])
    weight = occ_data['weight']
    
    # Calculate matches
    style_matches = len(set(product_tags) & compatible_styles)
    vibe_matches = len(set(celeb_tags) & compatible_vibes)
    
    # Normalize
    style_score = style_matches / len(compatible_styles) if compatible_styles else 0
    vibe_score = vibe_matches / len(compatible_vibes) if compatible_vibes else 0
    
    return ((style_score + vibe_score) / 2) * weight


def get_category_preference_score(celeb_tags: list, product_category: str) -> float:
    """
    Calculate preference score for a product category based on celebrity vibes
    
    Args:
        celeb_tags: List of celebrity vibe tags
        product_category: Product category
    
    Returns:
        float: Preference score (0.5 to 1.0)
    """
    score = 0.5  # Base score
    
    for tag in celeb_tags:
        if tag in CATEGORY_PREFERENCES:
            preferred_cats = CATEGORY_PREFERENCES[tag]
            if product_category in preferred_cats:
                score += 0.1
    
    return min(1.0, score)
