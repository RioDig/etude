from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta

class User(BaseModel):
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = False


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    scopes: List[str] = None


class Document(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    owner_email: str