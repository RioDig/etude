from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = False

class UserInDB(User):
    hashed_password: str

class OAuthClientInfo(BaseModel):
    client_id: str
    client_secret: str
    name: str
    redirect_uris: List[str]
    allowed_scopes: List[str]

class AuthorizationInfo(BaseModel):
    client_id: str
    redirect_uri: str
    scope: str
    state: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None
    scope: str

class TokenRequest(BaseModel):
    grant_type: str
    client_id: str
    client_secret: str
    code: Optional[str] = None
    redirect_uri: Optional[str] = None
    refresh_token: Optional[str] = None

class Document(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    created_at: datetime
    type: str