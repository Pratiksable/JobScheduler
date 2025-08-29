from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ScheduleCreateSchema(BaseModel):
    title: str
    description: str
    schedule_interval: str   

class ScheduleUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    schedule_interval: Optional[str] = None


class ScheduleSchema(ScheduleCreateSchema):
    id: int
    is_completed: bool
    last_run: datetime | None = None
    next_run: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserCreateSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str   # plain here, will hash before saving
    phone: str
    photo: Optional[str] = None   # optional


class UserUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None


class UserSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    photo: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class LoginSchema(BaseModel):
    email: str
    password: str