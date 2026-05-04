from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Union

from api.models import StartResponse, AnswerRequest, NextQuestionResponse, GuessResponse, StateResponse, FeedbackRequest
from services.session_service import session_service
from services.engine_service import engine_service
from services.telemetry import telemetry_service

router = APIRouter()

@router.post("/start", response_model=StartResponse)
async def start_game():
    session = session_service.create_session()
    first_attr, banter = engine_service.initialize_state(session)
    question_text = engine_service.generator.generate_question(first_attr)
    session_service.save_session(session)
    
    return StartResponse(
        session_id=session.session_id,
        question=question_text,
        attribute=first_attr,
        confidence=0.0,
        remaining_candidates=len(engine_service.players),
        banter=banter
    )

@router.post("/answer", response_model=Union[NextQuestionResponse, GuessResponse])
async def answer_question(request: AnswerRequest):
    session = session_service.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    answer = request.answer.lower().strip()
    
    if session.disambiguation_mode:
        guess = session.top_two_candidates[0] if answer == "yes" else (session.top_two_candidates[1] if len(session.top_two_candidates) > 1 else session.top_two_candidates[0])
        session_service.delete_session(session.session_id)
        player_data = next((p for p in engine_service.players if p["name"] == guess), {})
        tribute = engine_service.generator.generate_tribute(guess, player_data)
        return GuessResponse(guess=guess, confidence=1.0, banter=tribute)

    engine_service.process_answer(session, answer)
    action_type, text, confidence, remaining, is_disambiguation, banter = engine_service.get_next_action(session)
    
    if action_type == "guess":
        session_service.delete_session(session.session_id)
        return GuessResponse(guess=text, confidence=confidence, banter=banter)
        
    session_service.save_session(session)
    return NextQuestionResponse(
        question=text,
        attribute=session.last_attribute or "",
        confidence=confidence,
        remaining_candidates=remaining,
        is_disambiguation=is_disambiguation,
        banter=banter
    )

@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    engine_service.record_feedback(request.correct_player, request.was_correct, request.session_id)
    return {"status": "success"}

@router.get("/state/{session_id}", response_model=StateResponse)
async def get_state(session_id: str):
    session = session_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    sorted_probs = sorted(session.probabilities.items(), key=lambda x: x[1], reverse=True)[:5]
    return StateResponse(
        top_candidates=[{"name": k, "probability": v} for k, v in sorted_probs],
        question_count=session.question_count,
        asked_questions=session.asked_questions,
        disambiguation_mode=session.disambiguation_mode
    )
