from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    org_email: str
    name: str
    surname: str
    patronymic: Optional[str] = None
    position: str


class UserCreate(UserBase):
    password: str
    department_id: Optional[int] = None
    EtudeID: Optional[int] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    position: Optional[str] = None
    department_id: Optional[int] = None
    EtudeID: Optional[int] = None


class UserInDB(UserBase):
    id: int
    EtudeID: Optional[int] = None
    department_id: Optional[int] = None

    class Config:
        orm_mode = True


class UserResponse(UserInDB):
    department_name: Optional[str] = None


class CompanyBase(BaseModel):
    name: str


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None


class CompanyInDB(CompanyBase):
    id: int

    class Config:
        orm_mode = True


class CompanyWithDepartments(CompanyInDB):
    departments: List["DepartmentInDB"] = []


class DepartmentBase(BaseModel):
    name: str
    company_id: int

class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    company_id: Optional[int] = None


class DepartmentInDB(DepartmentBase):
    id: int

    class Config:
        orm_mode = True


class DepartmentWithEmployees(DepartmentInDB):
    employees: List[UserInDB] = []
    company: CompanyInDB

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

class EmailLoginRequest(BaseModel):
    email: str
    password: str

class TokenRequest(BaseModel):
    grant_type: str
    client_id: str
    client_secret: str
    code: Optional[str] = None
    redirect_uri: Optional[str] = None
    refresh_token: Optional[str] = None


class DocumentBase(BaseModel):
    EtudeDocID: str
    coordinating: dict  # Словарь с ID пользователей для согласования {EtudeAuthID: EtudeBackendID}
    DocInfo: dict  # Вся информация о документе в JSON формате


class DocumentCreate(DocumentBase):
    owner_id: int


class DocumentUpdate(BaseModel):
    coordinating: Optional[dict] = None
    DocInfo: Optional[dict] = None
    isApproval: Optional[bool] = None


class DocumentInDB(DocumentBase):
    id: int
    isApproval: bool
    created_at: datetime
    owner_id: int

    class Config:
        orm_mode = True


class DocumentResponse(DocumentInDB):
    owner: UserInDB

class AuthToken(BaseModel):
    code: str
    email: str
    client_id: str
    scopes: List[str]
    redirect_uri: str
    expires_at: int

class EmployeeInfo(BaseModel):
    name: str
    position: str
    email: str
    is_leader: bool
    department_name: str  # Добавляем название отдела

class DepartmentStructure(BaseModel):
    name: str
    manager: EmployeeInfo
    employees: List[EmployeeInfo] = []

class CompanyStructure(BaseModel):
    name: str
    departments: List[DepartmentStructure] = []

class OrganizationStructure(BaseModel):
    company: CompanyStructure
