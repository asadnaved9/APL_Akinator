import json
import os
from typing import Tuple, List, Dict, Any, Optional

from api.models import SessionState
from engine.probability import ProbabilityEngine
from engine.selector import QuestionSelector
from engine.prompts import QuestionGenerator

class EngineService:
    def __init__(self):
        self.generator = QuestionGenerator()
        self.players = self._load_dataset()
        self.all_attributes = list(self.players[0]["attributes"].keys()) if self.players else []
        self.feedback_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'feedback.json')
        
    def _load_dataset(self) -> List[Dict[str, Any]]:
        data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'players.json')
        try:
            with open(data_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading dataset: {e}")
            return []

    def _get_probability_engine(self, state: SessionState) -> ProbabilityEngine:
        engine = ProbabilityEngine(self.players)
        if state.probabilities:
            engine.probabilities = state.probabilities.copy()
        return engine

    def _get_selector(self, state: SessionState, prob_engine: ProbabilityEngine) -> QuestionSelector:
        selector = QuestionSelector(prob_engine, self.all_attributes)
        selector.asked_attributes = set(state.asked_questions)
        selector.answered_attributes = state.answered_attributes.copy()
        return selector

    def initialize_state(self, state: SessionState) -> Tuple[str, str]:
        """Initializes state and returns the first attribute and banter."""
        engine = self._get_probability_engine(state)
        state.probabilities = engine.probabilities.copy()
        
        selector = self._get_selector(state, engine)
        best_attr = selector.get_best_attribute(use_heuristic=False)
        
        state.last_attribute = best_attr
        question_text = self.generator.generate_question(best_attr)
        banter = self.generator.generate_banter(0.0, len(self.players), 0)
        
        return best_attr, banter

    def process_answer(self, state: SessionState, answer: str) -> None:
        if not state.last_attribute: return
            
        engine = self._get_probability_engine(state)
        # Use hard filtering for first 3 questions to narrow pool fast
        is_hard_mode = state.question_count < 3 or engine.get_active_candidate_count() >= 100
        
        engine.update(state.last_attribute, answer, hard_mode=is_hard_mode)
        
        if answer == "yes":
            state.answered_attributes[state.last_attribute] = True
        elif answer == "no":
            state.answered_attributes[state.last_attribute] = False
            
        state.probabilities = engine.probabilities.copy()
        state.asked_questions.append(state.last_attribute)
        state.question_count += 1
        
    def get_next_action(self, state: SessionState) -> Tuple[str, str, float, int, bool, str]:
        """
        Returns: (type, text, confidence, remaining_candidates, is_disambiguation, banter)
        """
        engine = self._get_probability_engine(state)
        probs = engine.get_probabilities()
        
        if not probs: return ("guess", "Unknown", 0.0, 0, False, "I'm stumped!")
            
        top1 = probs[0]
        top2 = probs[1] if len(probs) > 1 else {"probability": 0}
        
        t1_p = top1['probability']
        t2_p = top2['probability']
        confidence = t1_p / (t1_p + t2_p + 1e-9)
        active_count = engine.get_active_candidate_count()
        
        state.top_two_candidates = [top1['name'], top2['name']] if len(probs) > 1 else [top1['name']]

        # 1. Win Condition
        if confidence >= 0.85 and state.question_count >= 4:
            player_data = next((p for p in self.players if p["name"] == top1['name']), {})
            tribute = self.generator.generate_tribute(top1['name'], player_data)
            return ("guess", top1['name'], confidence, active_count, False, tribute)
            
        # 2. Max Question Limit
        if state.question_count >= 8:
            state.disambiguation_mode = True
            question_text = self.generator.generate_disambiguation(top1['name'])
            banter = self.generator.generate_banter(confidence, active_count, state.question_count)
            return ("question", question_text, confidence, active_count, True, banter)
            
        # 3. Normal Question Selection
        selector = self._get_selector(state, engine)
        best_attr = selector.get_best_attribute()
        
        if not best_attr:
            player_data = next((p for p in self.players if p["name"] == top1['name']), {})
            tribute = self.generator.generate_tribute(top1['name'], player_data)
            return ("guess", top1['name'], confidence, active_count, False, tribute)
            
        state.last_attribute = best_attr
        question_text = self.generator.generate_question(best_attr)
        banter = self.generator.generate_banter(confidence, active_count, state.question_count)
        
        return ("question", question_text, confidence, active_count, False, banter)

    def record_feedback(self, correct_player: str, was_correct: bool, session_id: str):
        """Reinforcement layer: Record feedback to improve future weighting."""
        feedback_entry = {
            "session_id": session_id,
            "correct_player": correct_player,
            "was_correct": was_correct,
            "timestamp": "now" # In a real app, use datetime
        }
        
        try:
            data = []
            if os.path.exists(self.feedback_path):
                with open(self.feedback_path, 'r') as f:
                    data = json.load(f)
            data.append(feedback_entry)
            with open(self.feedback_path, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error recording feedback: {e}")

engine_service = EngineService()
