from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class EmotionEntryOut(BaseModel):
    emotion: str
    sentiment: str
    suggestions: List[str]
    timestamp: datetime

    class Config:
        orm_mode = True
