from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime, date
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    entries = relationship("EmotionEntry", back_populates="user")

class EmotionEntry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True, index=True)
    emotion = Column(String)
    sentiment = Column(String)
    suggestions = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="entries")

class EmotionLog(Base):
    __tablename__ = "emotion_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    emotion = Column(String)
    suggestions = Column(JSON)
    date = Column(Date, default=date.today)

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    date = Column(Date)
