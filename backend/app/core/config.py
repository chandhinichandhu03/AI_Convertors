import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OmniConvert AI"
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-omniconvert")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    DATABASE_URL: str = "sqlite:///./database.db"
    
    # Uploads and outputs storage paths relative to backend root
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    OUTPUT_DIR: str = os.path.join(BASE_DIR, "outputs")
    LOGS_DIR: str = os.path.join(BASE_DIR, "logs")

    class Config:
        env_file = ".env"

settings = Settings()

# Ensure folders exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.LOGS_DIR, exist_ok=True)
