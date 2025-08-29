from fastapi import FastAPI , Depends , Response , HTTPException
from .database import Base, engine , SessionLocal
from .schemas import ScheduleSchema, ScheduleCreateSchema , ScheduleUpdateSchema , UserSchema , UserCreateSchema , UserUpdateSchema , LoginSchema
from . import models
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.scheduler import start_scheduler , add_job_to_scheduler
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(engine)

@app.on_event("startup")
def startup_event():
    import threading
    threading.Thread(target=start_scheduler, daemon=True).start()
def get_db():
    db = SessionLocal()
    try:
      yield db
    finally:
       db.close()


@app.get("/", tags = ["Root"])
def read_root():
    return {"message": "Welcome to the Scheduler API"}

@app.post("/schedules/", response_model=ScheduleSchema, tags=["Schedules"])
def create_job(schedule: ScheduleCreateSchema, db: Session = Depends(get_db)):
    new_job = models.Schedule(
        title=schedule.title,
        description=schedule.description,
        schedule_interval=schedule.schedule_interval,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        is_completed=False
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    add_job_to_scheduler(new_job) 
    return new_job

@app.get("/schedules/", response_model = List[ScheduleSchema], tags = ["Schedules"])
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Schedule).all()
    return jobs

@app.get("/schedules/{id}" , response_model = ScheduleSchema, tags = ["Schedules"])
def get_job_by_id(id: int , db: Session = Depends(get_db)):
    job = db.query(models.Schedule).filter(models.Schedule.id == id).first()
    if not job:
        return {"error":f"No Job with these id: {id}"}
    return job

@app.patch("/schedules/{id}", response_model=ScheduleSchema, tags=["Schedules"])
def update_job(id: int, schedule: ScheduleUpdateSchema, db: Session = Depends(get_db)):
    job = db.query(models.Schedule).filter(models.Schedule.id == id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail=f"No Job with id: {id}")

    job.title = schedule.title if schedule.title is not None else job.title
    job.description = schedule.description if schedule.description is not None else job.description
    job.schedule_interval = schedule.schedule_interval if schedule.schedule_interval is not None else job.schedule_interval

    db.commit()
    db.refresh(job)

    return job

@app.delete("/schedules/{id}", response_model=ScheduleSchema, tags=["Schedules"])
def delete_job(id:int , db:Session = Depends(get_db)):
    job = db.query(models.Schedule).filter(models.Schedule.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"No Job with id: {id}")
    db.delete(job)
    db.commit()
    return job
@app.get("/user", response_model = List[UserSchema] , tags=["Users"])
def get_user(db:Session = Depends(get_db)):
    user = db.query(models.User).all()
    return user

@app.post("/user", response_model = UserSchema , tags=["Users"])
def create_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=user.password,  
        phone=user.phone,
        photo=user.photo
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/user/{id}", response_model=UserSchema, tags=["Users"])
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"No User with id: {id}")
    return user

@app.delete("/user/{id}", response_model=UserSchema, tags=["Users"])
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"No User with id: {id}")
    db.delete(user)
    db.commit()
    return user

@app.patch("/user/{id}", response_model=UserSchema, tags=["Users"])
def update_user(id: int, user: UserUpdateSchema, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail=f"No User with id: {id}")

    existing_user.first_name = user.first_name if user.first_name is not None else existing_user.first_name
    existing_user.last_name = user.last_name if user.last_name is not None else existing_user.last_name
    existing_user.email = user.email if user.email is not None else existing_user.email
    existing_user.password = user.password if user.password is not None else existing_user.password
    existing_user.phone = user.phone if user.phone is not None else existing_user.phone
    existing_user.photo = user.photo if user.photo is not None else existing_user.photo

    db.commit()
    db.refresh(existing_user)
    return existing_user

@app.post("/auth/signin")
def signin(credentials: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or user.password != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": "fake-jwt-token", "user": user}