from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base, SessionLocal
from app.database.models import models
from app.core.security import hash_password
from app.api.routers import auth_router, conversion_router, ai_router, settings_router

# Initialize SQLite database models on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="OmniConvert AI Backend", version="1.0.0")

# CORS middleware for local Vite client (runs on 5173 / 3000 / 3001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all local network interfaces
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router.router)
app.include_router(conversion_router.router)
app.include_router(ai_router.router)
app.include_router(settings_router.router)

@app.on_event("startup")
async def seed_data():
    """Seeds a default workspace user if database is empty and bootstraps RAG KB."""
    import os
    from app.services.ai.rag_service import bootstrap_knowledge_base
    from app.core.config import settings
    
    # Initialize global RAG index
    kb_path = os.path.join(os.path.dirname(settings.BASE_DIR), "knowledge_base")
    bootstrap_knowledge_base(kb_path)
    
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            default_user = models.User(
                username="developer",
                email="dev@omniconvert.ai",
                password_hash=hash_password("dev123"),
                role="Admin"
            )
            db.add(default_user)
            db.commit()
            
            # Setup default settings record
            db.add(models.UserSettings(user_id=default_user.id))
            db.commit()
            print("✓ Default user seeded successfully (dev@omniconvert.ai / dev123).")
    finally:
        db.close()

@app.get("/")
async def root():
    return {"status": "online", "platform": "OmniConvert AI", "offlineReady": True}
