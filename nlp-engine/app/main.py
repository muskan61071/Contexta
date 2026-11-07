"""Contexta API and deterministic NLP fallback. This intentionally does not claim LLM-level understanding."""
from __future__ import annotations
import sys
from pathlib import Path

# Enable running this file directly (e.g. `python app/main.py` or clicking Run in VS Code)
if __name__ == "__main__" and (__package__ is None or __package__ == ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    __package__ = "app"

import json, re, uuid
from datetime import datetime, timezone
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas.message import AnalyzeRequest, ContextMessage
from .database.connection import connect as db
from .rules.pronoun_rules import PRONOUNS, REFERENCE_PATTERN
from .rules.semantic_rules import ACTION_WORDS, EVENT_TERMS
from .pipeline.linguistic_analysis import words, extract_entities
from .pipeline.semantic_analysis import relationship_extract, build_semantic_graph
from .pipeline.interpretation_ranking import rank_candidates, decisive_candidate
from .pipeline.confidence_estimation import confidence_level
from .pipeline.miscommunication_risk import risk_level
from .pipeline.intent_reconstruction import replace_reference
from .pipeline.clarification_generation import question_for
from .pipeline.preprocessing import normalize
from .pipeline.entity_recognition import recognize_entities
from .pipeline.reference_detection import detect_references
from .pipeline.context_retrieval import overlap_score
from .pipeline.dependency_analysis import shallow_roles
from .pipeline.interpretation_generation import alternatives_for_attachment
from .pipeline.ambiguity_classification import classify_reference
from .pipeline.clear_message_generation import clear_message
from .pipeline.analyzer import analyze

app = FastAPI(title="Contexta communication analysis API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Contexta Communication Analysis NLP Engine",
        "engine": "Context-Aware Rule-Based & Semantic Role NLP Pipeline",
        "database": "sqlite"
    }

from .api.analysis import router as analysis_router
from .api.context import router as context_router
from .api.ambiguity import router as ambiguity_router
from .api.interpretation import router as interpretation_router
from .api.semantics import router as semantic_router
from .api.clarification import router as clarification_router
from .api.rewrite import router as rewrite_router
from .api.history import router as history_router

for route in (analysis_router, context_router, ambiguity_router, interpretation_router, semantic_router, clarification_router, rewrite_router, history_router):
    app.include_router(route)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
