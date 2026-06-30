from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import models, schemas
from app.api.routers.auth_router import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/profile")
async def get_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "createdAt": current_user.created_at
    }

@router.put("/update")
async def update_settings(
    payload: schemas.SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    settings = db.query(models.UserSettings).filter(models.UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
        
    settings.theme = payload.theme
    settings.language = payload.language
    settings.notifications = payload.notifications
    db.commit()
    return {"message": "Settings updated successfully"}
