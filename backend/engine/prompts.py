import os
from typing import Optional, Dict
from google import genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env'))

# Dictionary fallback for all schema.json attributes
FALLBACK_QUESTIONS = {
    "is_overseas": "Is your player an overseas (non-Indian) player?",
    "is_batsman": "Is your player primarily known as a batsman?",
    "is_bowler": "Is your player primarily known as a bowler?",
    "is_all_rounder": "Is your player considered an all-rounder?",
    "is_wicket_keeper": "Does your player keep wickets?",
    "is_right_handed_batsman": "Is your player a right-handed batsman?",
    "is_left_handed_batsman": "Is your player a left-handed batsman?",
    "is_fast_bowler": "Is your player a fast/pace bowler?",
    "is_spin_bowler": "Is your player a spin bowler?",
    "has_won_orange_cap": "Has your player ever won the Orange Cap (most runs in a season)?",
    "has_won_purple_cap": "Has your player ever won the Purple Cap (most wickets in a season)?",
    "has_won_ipl_title": "Has your player ever won an IPL title?",
    "has_scored_century": "Has your player scored a century in the IPL?",
    "has_taken_5_wicket_haul": "Has your player ever taken a 5-wicket haul in the IPL?",
    "has_taken_hat_trick": "Has your player ever taken a hat-trick in the IPL?",
    "has_captained": "Has your player ever captained an IPL franchise?",
    "has_played_internationally": "Has your player played international cricket for their country?",
    "played_for_csk": "Has your player ever played for the Chennai Super Kings (CSK)?",
    "played_for_mi": "Has your player ever played for the Mumbai Indians (MI)?",
    "played_for_rcb": "Has your player ever played for the Royal Challengers Bangalore (RCB)?",
    "played_for_kkr": "Has your player ever played for the Kolkata Knight Riders (KKR)?",
    "played_for_srh": "Has your player ever played for the Sunrisers Hyderabad (SRH) or Deccan Chargers?",
    "played_for_rr": "Has your player ever played for the Rajasthan Royals (RR)?",
    "played_for_dc": "Has your player ever played for the Delhi Capitals (DC) or Daredevils?",
    "played_for_pbks": "Has your player ever played for the Punjab Kings (PBKS) or Kings XI Punjab?",
    "played_for_gt": "Has your player ever played for the Gujarat Titans (GT)?",
    "played_for_lsg": "Has your player ever played for the Lucknow Super Giants (LSG)?",
    "is_australian": "Is your player from Australia?",
    "is_english": "Is your player from England?",
    "is_south_african": "Is your player from South Africa?",
    "is_west_indian": "Is your player from the West Indies?",
    "is_currently_active": "Is your player currently active in the IPL?",
    "is_uncapped": "Is your player an uncapped player (never played international cricket)?"
}

class QuestionGenerator:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self._cache: Dict[str, str] = {}
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            # Use gemini-1.5-flash for speed/cost efficiency in the game loop
            self.model_name = 'gemini-1.5-flash'
        else:
            self.client = None
            print("WARNING: GEMINI_API_KEY not found in .env. Falling back to dictionary mode.")

    def generate_question(self, attribute: str) -> str:
        if attribute in self._cache:
            return self._cache[attribute]
            
        fallback_q = FALLBACK_QUESTIONS.get(attribute, f"Does your player have the attribute: {attribute}?")
        if not self.client: return fallback_q
            
        try:
            prompt = f"Convert this IPL player attribute into a natural, engaging yes/no question for a game: '{attribute}'. Return ONLY the question."
            response = self.client.models.generate_content(model=self.model_name, contents=prompt)
            if response and response.text:
                q = response.text.strip().strip('"')
                self._cache[attribute] = q
                return q
            return fallback_q
        except Exception as e:
            print(f"Gemini API error: {e}")
            return fallback_q

    def generate_banter(self, confidence: float, remaining: int, question_count: int) -> str:
        if not self.client: return "The chase is on!"
        
        try:
            prompt = f"You are a witty IPL commentator. Confidence: {confidence*100}%, Candidates left: {remaining}, Round: {question_count}. Give a 1-sentence witty remark."
            response = self.client.models.generate_content(model=self.model_name, contents=prompt)
            return response.text.strip().strip('"') if response.text else "The chase is on!"
        except:
            return "The bowler is running in!"

    def generate_tribute(self, player_name: str, player_data: Dict) -> str:
        if not self.client: return f"{player_name} is an IPL legend."
        
        try:
            prompt = f"Create a 1-sentence epic tribute for IPL player {player_name}. Focus on their impact and legacy. Keep it punchy."
            response = self.client.models.generate_content(model=self.model_name, contents=prompt)
            return response.text.strip().strip('"') if response.text else f"A true icon of the game."
        except:
            return f"An indispensable part of IPL history."

    def generate_disambiguation(self, top_candidate_name: str) -> str:
        return f"Is your player {top_candidate_name}?"
