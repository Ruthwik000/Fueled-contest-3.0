"""
User Questionnaire System
Collects user preferences and generates standardized text for embedding
"""

import json
from typing import Dict, List


class UserQuestionnaire:
    """
    Interactive questionnaire to understand user jewelry preferences
    """
    
    def __init__(self):
        self.responses = {}
        
    def ask_question(self, question: str, options: List[str] = None, 
                    allow_multiple: bool = False) -> str:
        """
        Ask a question and get user response
        
        Args:
            question: Question text
            options: List of options (if None, free text)
            allow_multiple: Allow multiple selections
        
        Returns:
            User's response(s)
        """
        print(f"\n{question}")
        
        if options:
            for i, option in enumerate(options, 1):
                print(f"  {i}. {option}")
            
            if allow_multiple:
                print("\nEnter numbers separated by commas (e.g., 1,3,4):")
                response = input("> ").strip()
                selected = []
                for num in response.split(','):
                    try:
                        idx = int(num.strip()) - 1
                        if 0 <= idx < len(options):
                            selected.append(options[idx])
                    except:
                        continue
                return selected if selected else [options[0]]
            else:
                print("\nEnter number:")
                response = input("> ").strip()
                try:
                    idx = int(response) - 1
                    if 0 <= idx < len(options):
                        return options[idx]
                except:
                    pass
                return options[0]
        else:
            response = input("> ").strip()
            return response if response else "Not specified"
    
    def run_questionnaire(self) -> Dict:
        """
        Run the complete questionnaire
        
        Returns:
            Dict of user responses
        """
        print("="*60)
        print("JEWELRY STYLE PREFERENCE QUESTIONNAIRE")
        print("="*60)
        print("\nWelcome! Let's find your perfect jewelry match.")
        print("Answer a few quick questions about your style preferences.\n")
        
        # Question 1: Style preference
        self.responses['style_preference'] = self.ask_question(
            "How would you describe your overall style?",
            options=[
                "Classic and timeless - I love pieces that never go out of style",
                "Modern and minimal - Clean lines and understated elegance",
                "Bold and statement-making - I want to stand out",
                "Elegant and sophisticated - Refined with subtle luxury",
                "Playful and eclectic - I like to mix and experiment",
                "Romantic and delicate - Soft, feminine designs"
            ]
        )
        
        # Question 2: Occasions
        self.responses['occasions'] = self.ask_question(
            "What occasions are you shopping for? (You can select multiple)",
            options=[
                "Weddings",
                "Engagement/Anniversary",
                "Formal Events",
                "Daily Wear",
                "Office/Professional",
                "Cocktail Parties",
                "Special Celebrations",
                "Casual Events"
            ],
            allow_multiple=True
        )
        
        # Question 3: Jewelry preference
        self.responses['jewelry_type'] = self.ask_question(
            "What type of jewelry speaks to you most?",
            options=[
                "Solitaire diamonds - Simple and stunning",
                "Multi-stone pieces - Intricate and detailed",
                "Geometric designs - Modern and architectural",
                "Nature-inspired - Floral, organic motifs",
                "Vintage-inspired - Heritage and tradition",
                "Contemporary art pieces - Unique and fashion-forward"
            ]
        )
        
        # Question 4: Level of sparkle
        self.responses['sparkle_level'] = self.ask_question(
            "How much sparkle do you prefer?",
            options=[
                "Subtle sparkle - Just a hint of shine",
                "Moderate sparkle - Noticeable but balanced",
                "Maximum sparkle - I want all the brilliance",
                "It depends on the occasion"
            ]
        )
        
        # Question 5: Budget
        self.responses['budget'] = self.ask_question(
            "What's your budget range?",
            options=[
                "Under ₹50,000 (Accessible luxury)",
                "₹50,000 - ₹1,50,000 (Premium)",
                "₹1,50,000 - ₹3,00,000 (Luxury)",
                "Above ₹3,00,000 (Ultra-luxury)"
            ]
        )
        
        # Question 6: Celebrity inspiration (optional)
        print("\nDo you have any celebrity style inspirations?")
        print("(Press Enter to skip, or describe the style you admire)")
        celebrity_inspo = input("> ").strip()
        self.responses['celebrity_inspiration'] = celebrity_inspo if celebrity_inspo else "Open to suggestions"
        
        # Question 7: Additional preferences
        print("\nAny other preferences? (metal color, specific gemstones, etc.)")
        print("(Press Enter to skip)")
        additional = input("> ").strip()
        self.responses['additional_preferences'] = additional if additional else "None"
        
        print("\n" + "="*60)
        print("Thank you! Analyzing your preferences...")
        print("="*60)
        
        return self.responses
    
    def generate_user_vibe_text(self, responses: Dict = None) -> str:
        """
        Generate standardized vibe text from responses
        
        Args:
            responses: User response dict (uses self.responses if None)
        
        Returns:
            Formatted text for embedding
        """
        if responses is None:
            responses = self.responses
        
        # Map budget to tier
        budget_map = {
            "Under ₹50,000 (Accessible luxury)": "affordable",
            "₹50,000 - ₹1,50,000 (Premium)": "moderate",
            "₹1,50,000 - ₹3,00,000 (Luxury)": "luxury",
            "Above ₹3,00,000 (Ultra-luxury)": "ultra-luxury"
        }
        budget_tier = budget_map.get(responses['budget'], 'moderate')
        
        # Extract occasions
        occasions = responses.get('occasions', [])
        if isinstance(occasions, str):
            occasions = [occasions]
        
        # Build comprehensive text
        vibe_text = f"""
User Style Profile:

Overall Style Preference: {responses['style_preference']}

Jewelry Type Preference: {responses['jewelry_type']}

Sparkle Preference: {responses['sparkle_level']}

Shopping For: {', '.join(occasions)}

Budget Range: {responses['budget']}

Celebrity Style Inspiration: {responses['celebrity_inspiration']}

Additional Preferences: {responses['additional_preferences']}

Style Summary: I prefer {responses['style_preference'].lower()}. 
I'm looking for jewelry that works for {', '.join(occasions[:3])}. 
I love {responses['jewelry_type'].lower()} with {responses['sparkle_level'].lower()}.
{f"I'm inspired by {responses['celebrity_inspiration']}." if responses['celebrity_inspiration'] != "Open to suggestions" else ""}
        """.strip()
        
        return vibe_text, budget_tier, occasions
    
    def save_responses(self, filepath: str = 'user_responses.json'):
        """Save responses to file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.responses, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved responses to {filepath}")


def run_interactive_questionnaire() -> tuple:
    """
    Run interactive questionnaire and return formatted data
    
    Returns:
        tuple: (vibe_text, budget_tier, occasions, responses)
    """
    questionnaire = UserQuestionnaire()
    responses = questionnaire.run_questionnaire()
    vibe_text, budget_tier, occasions = questionnaire.generate_user_vibe_text(responses)
    
    print("\n" + "="*60)
    print("YOUR STYLE PROFILE:")
    print("="*60)
    print(vibe_text)
    print("="*60)
    
    return vibe_text, budget_tier, occasions, responses


# Quick test mode with predefined responses
def quick_test_mode(style: str = 'elegant') -> tuple:
    """
    Generate quick test responses without interactive input
    
    Args:
        style: Style preset ('elegant', 'modern', 'bold', 'minimal')
    
    Returns:
        tuple: (vibe_text, budget_tier, occasions, responses)
    """
    presets = {
        'elegant': {
            'style_preference': 'Elegant and sophisticated - Refined with subtle luxury',
            'occasions': ['Weddings', 'Formal Events', 'Anniversary'],
            'jewelry_type': 'Solitaire diamonds - Simple and stunning',
            'sparkle_level': 'Moderate sparkle - Noticeable but balanced',
            'budget': '₹50,000 - ₹1,50,000 (Premium)',
            'celebrity_inspiration': 'Classic elegance like Deepika Padukone',
            'additional_preferences': 'Prefer white gold or platinum'
        },
        'modern': {
            'style_preference': 'Modern and minimal - Clean lines and understated elegance',
            'occasions': ['Daily Wear', 'Office/Professional', 'Casual Events'],
            'jewelry_type': 'Geometric designs - Modern and architectural',
            'sparkle_level': 'Subtle sparkle - Just a hint of shine',
            'budget': 'Under ₹50,000 (Accessible luxury)',
            'celebrity_inspiration': 'Minimal chic like Alia Bhatt',
            'additional_preferences': 'Rose gold preferred'
        },
        'bold': {
            'style_preference': 'Bold and statement-making - I want to stand out',
            'occasions': ['Cocktail Parties', 'Special Celebrations', 'Weddings'],
            'jewelry_type': 'Multi-stone pieces - Intricate and detailed',
            'sparkle_level': 'Maximum sparkle - I want all the brilliance',
            'budget': '₹1,50,000 - ₹3,00,000 (Luxury)',
            'celebrity_inspiration': 'Glamorous like Sonam Kapoor',
            'additional_preferences': 'Love layered looks'
        },
        'minimal': {
            'style_preference': 'Romantic and delicate - Soft, feminine designs',
            'occasions': ['Daily Wear', 'Engagement/Anniversary', 'Special Celebrations'],
            'jewelry_type': 'Nature-inspired - Floral, organic motifs',
            'sparkle_level': 'Subtle sparkle - Just a hint of shine',
            'budget': '₹50,000 - ₹1,50,000 (Premium)',
            'celebrity_inspiration': 'Delicate style like Shraddha Kapoor',
            'additional_preferences': 'Prefer yellow gold'
        }
    }
    
    responses = presets.get(style, presets['elegant'])
    
    questionnaire = UserQuestionnaire()
    questionnaire.responses = responses
    vibe_text, budget_tier, occasions = questionnaire.generate_user_vibe_text(responses)
    
    print(f"\n[QUICK TEST MODE - {style.upper()} STYLE]")
    print("="*60)
    print(vibe_text)
    print("="*60)
    
    return vibe_text, budget_tier, occasions, responses


if __name__ == "__main__":
    # Run interactive mode
    print("Choose mode:")
    print("1. Interactive Questionnaire")
    print("2. Quick Test Mode")
    
    choice = input("\nEnter 1 or 2: ").strip()
    
    if choice == "2":
        print("\nSelect test style:")
        print("1. Elegant")
        print("2. Modern")
        print("3. Bold")
        print("4. Minimal")
        style_choice = input("\nEnter 1-4: ").strip()
        
        style_map = {'1': 'elegant', '2': 'modern', '3': 'bold', '4': 'minimal'}
        style = style_map.get(style_choice, 'elegant')
        
        vibe_text, budget, occasions, responses = quick_test_mode(style)
    else:
        vibe_text, budget, occasions, responses = run_interactive_questionnaire()
