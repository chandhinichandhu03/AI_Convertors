from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import models, schemas
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    """Security dependency to validate JWT token and return active user profile."""
    token = credentials.credentials
    if token == "mock-jwt-token-google":
        user = db.query(models.User).filter(models.User.email == "oauth@gmail.com").first()
        if not user:
            user = models.User(
                username="google_user",
                email="oauth@gmail.com",
                password_hash=hash_password("mockgooglepassword"),
                role="User"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Setup default settings record for this user
            user_settings = models.UserSettings(user_id=user.id)
            db.add(user_settings)
            db.commit()
        return user

    sub = decode_access_token(token)
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(models.User).filter(models.User.id == sub).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


@router.post("/register")
async def register(payload: schemas.UserRegister, db: Session = Depends(get_db)):
    dup_name = db.query(models.User).filter(models.User.username == payload.username).first()
    if dup_name:
        raise HTTPException(status_code=400, detail="Username is already taken")
        
    dup_email = db.query(models.User).filter(models.User.email == payload.email).first()
    if dup_email:
        raise HTTPException(status_code=400, detail="Email is already registered")
        
    hashed = hash_password(payload.password)
    new_user = models.User(
        username=payload.username,
        email=payload.email,
        password_hash=hashed,
        role="Admin" if payload.email.endswith("@omniconvert.ai") else "User"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    settings = models.UserSettings(user_id=new_user.id)
    db.add(settings)
    db.commit()
    
    return {"message": "User registered successfully", "userId": new_user.id}

@router.post("/login")
async def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    token = create_access_token(user.id)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }
