from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database.connection import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="User")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    history = relationship("ConversionHistory", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    theme = Column(String(20), default="dark")
    language = Column(String(10), default="en")
    notifications = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="settings")

class ConversionHistory(Base):
    __tablename__ = "conversion_history"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    original_name = Column(String(255), nullable=False)
    converted_name = Column(String(255), nullable=False)
    source_format = Column(String(20), nullable=False)
    target_format = Column(String(20), nullable=False)
    status = Column(String(20), default="completed")
    duration_ms = Column(Integer, default=0)
    file_size = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="history")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    converter_id = Column(String(50), nullable=False)
    
    user = relationship("User", back_populates="favorites")

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    level = Column(String(20), default="info")
    message = Column(Text, nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
