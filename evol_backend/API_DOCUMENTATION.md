# Jewelry Recommendation API Documentation

## 🚀 Quick Start

### 1. Start the Server
```bash
python server.py
```

The server will start on `http://localhost:8000`

### 2. Access Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Test the API
```bash
python api_test.py
```

---

## 📍 API Endpoints

### Health Check

**GET** `/health`

Check if the API is running and recommendation engine is loaded.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "recommender_loaded": true,
  "timestamp": "2025-10-14T10:30:00.000Z"
}
```

---

### Get Recommendations

**POST** `/api/v1/recommendations`

Submit user survey and get personalized jewelry recommendations.

**Request Body:**
```json
{
  "survey": {
    "style_preference": "Elegant and sophisticated - Refined with subtle luxury",
    "occasions": ["Weddings", "Formal Events", "Anniversary"],
    "jewelry_type": "Solitaire diamonds - Simple and stunning",
    "sparkle_level": "Moderate sparkle - Noticeable but balanced",
    "budget": "₹50,000 - ₹1,50,000 (Premium)",
    "celebrity_inspiration": "Classic elegance like Deepika Padukone",
    "additional_preferences": "Prefer white gold or platinum"
  },
  "top_n": 10,
  "celebrity_threshold": 0.4,
  "include_scores": false
}
```

**Parameters:**
- `survey` (required): User survey responses
  - `style_preference` (string, required): Overall style preference
  - `occasions` (array, required): List of occasions
  - `jewelry_type` (string, required): Preferred jewelry type
  - `sparkle_level` (string, required): Sparkle preference
  - `budget` (string, required): Budget range
  - `celebrity_inspiration` (string, optional): Celebrity inspiration
  - `additional_preferences` (string, optional): Additional preferences

- `top_n` (integer, optional): Number of recommendations (default: 10, max: 50)
- `celebrity_threshold` (float, optional): Min celebrity similarity (default: 0.4, range: 0.0-1.0)
- `include_scores` (boolean, optional): Include detailed scoring (default: false)

**Response:**
```json
{
  "status": "success",
  "timestamp": "2025-10-14T10:30:00.000Z",
  "matched_celebrities": [
    {
      "id": "celeb_001",
      "name": "Deepika Padukone",
      "similarity_score": 0.85,
      "primary_vibe_tags": ["Elegant", "Timeless", "Statement"],
      "secondary_vibe_tags": ["Heritage", "Red carpet luxe"],
      "vibe_description": "Always poised, she gravitates toward pieces...",
      "image_url": null
    }
  ],
  "celebrity_product_groups": [
    {
      "celebrity": {
        "id": "celeb_001",
        "name": "Deepika Padukone",
        "similarity_score": 0.85,
        "primary_vibe_tags": ["Elegant", "Timeless", "Statement"],
        "secondary_vibe_tags": ["Heritage", "Red carpet luxe"],
        "vibe_description": "Always poised, she gravitates toward pieces...",
        "image_url": null
      },
      "products": [
        {
          "id": 1,
          "name": "Celestial Cascade Diamond Necklace",
          "price": "801,094 INR",
          "category": "necklaces",
          "primary_style_tags": ["Luxury"],
          "secondary_style_tags": ["Multi-stone", "Layered"],
          "occasions": ["Weddings", "Formal Events"],
          "vibe_description": "An extraordinary masterpiece...",
          "image_url": "http://...",
          "match_score": 0.892,
          "scores_breakdown": null
        }
      ],
      "total_products": 3
    }
  ],
  "all_recommendations": [
    {
      "id": 1,
      "name": "Celestial Cascade Diamond Necklace",
      "price": "801,094 INR",
      "category": "necklaces",
      "primary_style_tags": ["Luxury"],
      "secondary_style_tags": ["Multi-stone", "Layered"],
      "occasions": ["Weddings", "Formal Events"],
      "vibe_description": "An extraordinary masterpiece...",
      "image_url": "http://...",
      "match_score": 0.892,
      "scores_breakdown": null
    }
  ],
  "total_recommendations": 10,
  "request_params": {
    "top_n": 10,
    "celebrity_threshold": 0.4,
    "budget_tier": "moderate",
    "occasions": ["Weddings", "Formal Events", "Anniversary"]
  }
}
```

---

### Match Celebrities

**POST** `/api/v1/celebrities/match`

Match user with celebrities based on style preferences (without product recommendations).

**Request Body:**
```json
{
  "style_preference": "Modern and minimal - Clean lines and understated elegance",
  "occasions": ["Daily Wear", "Office/Professional"],
  "jewelry_type": "Geometric designs - Modern and architectural",
  "sparkle_level": "Subtle sparkle - Just a hint of shine",
  "budget": "Under ₹50,000 (Accessible luxury)",
  "celebrity_inspiration": "Minimal chic like Alia Bhatt",
  "additional_preferences": "Rose gold preferred"
}
```

**Query Parameters:**
- `top_k` (integer, optional): Number of celebrity matches (default: 3)

**Response:**
```json
{
  "status": "success",
  "timestamp": "2025-10-14T10:30:00.000Z",
  "matched_celebrities": [
    {
      "id": "celeb_001",
      "name": "Alia Bhatt",
      "similarity_score": 0.92,
      "primary_vibe_tags": ["Modern", "Elegant", "Minimal"],
      "secondary_vibe_tags": ["Diamond-focused", "Contemporary"],
      "vibe_description": "Refined minimalism with high-impact brilliance...",
      "image_url": "https://..."
    }
  ],
  "total_matches": 3
}
```

---

## 🎨 Survey Options Reference

### Style Preferences
- "Classic and timeless - I love pieces that never go out of style"
- "Modern and minimal - Clean lines and understated elegance"
- "Bold and statement-making - I want to stand out"
- "Elegant and sophisticated - Refined with subtle luxury"
- "Playful and eclectic - I like to mix and experiment"
- "Romantic and delicate - Soft, feminine designs"

### Occasions
- "Weddings"
- "Engagement/Anniversary"
- "Formal Events"
- "Daily Wear"
- "Office/Professional"
- "Cocktail Parties"
- "Special Celebrations"
- "Casual Events"

### Jewelry Types
- "Solitaire diamonds - Simple and stunning"
- "Multi-stone pieces - Intricate and detailed"
- "Geometric designs - Modern and architectural"
- "Nature-inspired - Floral, organic motifs"
- "Vintage-inspired - Heritage and tradition"
- "Contemporary art pieces - Unique and fashion-forward"

### Sparkle Levels
- "Subtle sparkle - Just a hint of shine"
- "Moderate sparkle - Noticeable but balanced"
- "Maximum sparkle - I want all the brilliance"
- "It depends on the occasion"

### Budget Ranges
- "Under ₹50,000 (Accessible luxury)" → maps to `affordable`
- "₹50,000 - ₹1,50,000 (Premium)" → maps to `moderate`
- "₹1,50,000 - ₹3,00,000 (Luxury)" → maps to `luxury`
- "Above ₹3,00,000 (Ultra-luxury)" → maps to `ultra-luxury`

---

## 💻 Code Examples

### Python (requests)
```python
import requests

url = "http://localhost:8000/api/v1/recommendations"

survey_data = {
    "survey": {
        "style_preference": "Elegant and sophisticated - Refined with subtle luxury",
        "occasions": ["Weddings", "Formal Events"],
        "jewelry_type": "Solitaire diamonds - Simple and stunning",
        "sparkle_level": "Moderate sparkle - Noticeable but balanced",
        "budget": "₹50,000 - ₹1,50,000 (Premium)"
    },
    "top_n": 10,
    "include_scores": True
}

response = requests.post(url, json=survey_data)
recommendations = response.json()

print(f"Found {recommendations['total_recommendations']} recommendations")
for celeb in recommendations['matched_celebrities']:
    print(f"Matched with {celeb['name']} ({celeb['similarity_score']:.1%})")
```

### JavaScript (fetch)
```javascript
const url = 'http://localhost:8000/api/v1/recommendations';

const surveyData = {
  survey: {
    style_preference: 'Modern and minimal - Clean lines and understated elegance',
    occasions: ['Daily Wear', 'Office/Professional'],
    jewelry_type: 'Geometric designs - Modern and architectural',
    sparkle_level: 'Subtle sparkle - Just a hint of shine',
    budget: 'Under ₹50,000 (Accessible luxury)'
  },
  top_n: 10,
  include_scores: false
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(surveyData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Celebrity Matches:', data.matched_celebrities);
    console.log('Product Groups:', data.celebrity_product_groups);
  });
```

### cURL
```bash
curl -X POST "http://localhost:8000/api/v1/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
    "survey": {
      "style_preference": "Bold and statement-making - I want to stand out",
      "occasions": ["Cocktail Parties", "Special Celebrations"],
      "jewelry_type": "Multi-stone pieces - Intricate and detailed",
      "sparkle_level": "Maximum sparkle - I want all the brilliance",
      "budget": "₹1,50,000 - ₹3,00,000 (Luxury)"
    },
    "top_n": 5
  }'
```

---

## 🔧 Configuration

### Server Configuration

Edit `server.py` to change server settings:

```python
if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",      # Bind to all interfaces
        port=8000,           # Port number
        reload=True,         # Auto-reload on code changes
        log_level="info"     # Logging level
    )
```

### CORS Settings

By default, CORS is enabled for all origins. For production, restrict to specific domains:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Recommendation Weights

Tune recommendation weights in `recommender_engine.py`:

```python
self.weights = {
    'vibe_similarity': 0.30,      # Celebrity vibe match
    'product_similarity': 0.25,   # Product-user match
    'style_taxonomy': 0.25,       # Taxonomy matching
    'occasion_match': 0.12,       # Occasion fit
    'price_compatibility': 0.05,  # Budget alignment
    'diversity_bonus': 0.03       # Variety
}
```

---

## 🐛 Error Handling

### Common Error Responses

**503 Service Unavailable** - Recommendation engine not loaded
```json
{
  "detail": "Recommendation engine not loaded. Please ensure embeddings are generated."
}
```

**422 Unprocessable Entity** - Validation error
```json
{
  "detail": [
    {
      "loc": ["body", "survey", "occasions"],
      "msg": "At least one occasion must be selected",
      "type": "value_error"
    }
  ]
}
```

**500 Internal Server Error** - Processing error
```json
{
  "detail": "Error generating recommendations: ..."
}
```

---

## 📊 Response Structure Explained

### Celebrity Product Groups

Products are distributed across matched celebrities to show which celebrity's style influenced each recommendation. The distribution is based on:

1. Celebrity similarity scores
2. Style taxonomy matches
3. Even distribution for better UX

Each celebrity gets roughly `total_products / num_celebrities` products.

### Match Scores

The `match_score` indicates how well a product matches the user's preferences:
- **0.8 - 1.0**: Excellent match
- **0.6 - 0.8**: Good match
- **0.4 - 0.6**: Moderate match
- **< 0.4**: Lower match (rarely shown)

### Scores Breakdown (when `include_scores: true`)

```json
"scores_breakdown": {
  "vibe_similarity": 0.85,        // User-celebrity vibe match
  "product_similarity": 0.78,     // Product-user direct match
  "style_taxonomy": 0.92,         // Taxonomy-based style affinity
  "occasion_match": 0.88,         // Occasion compatibility
  "price_compatibility": 1.0      // Budget alignment
}
```

---

## 🚀 Deployment

### Production Recommendations

1. **Use Gunicorn with Uvicorn workers**:
```bash
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

2. **Set up reverse proxy** (nginx):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Add environment variables**:
```bash
export API_ENV=production
export API_LOG_LEVEL=warning
```

4. **Enable HTTPS** with Let's Encrypt

---

## 📝 Testing

Run the test suite:
```bash
# All tests
python api_test.py

# Specific tests
python api_test.py health
python api_test.py recommend elegant
python api_test.py celebrity modern
python api_test.py custom
```

---

## 🤝 Support

For issues or questions:
1. Check logs: Server outputs detailed error messages
2. Verify embeddings are generated
3. Test health endpoint
4. Review API documentation at `/docs`

---

**Version**: 1.0.0  
**Last Updated**: October 2025
