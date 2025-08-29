from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.database import SessionLocal
from app.models import Schedule
from datetime import datetime , timedelta 

scheduler = BackgroundScheduler()


def run_job(job_id):
    db = SessionLocal()
    job = db.query(Schedule).filter(Schedule.id == job_id).first()
    if job:
        print(f"Running job: {job.title}")
        print(f"Job details: {job.description}")
        job.last_run = datetime.utcnow()
        db.commit()
    db.close()

def add_job_to_scheduler(job):
    print("schedule_interval:", job.schedule_interval)
    trigger = CronTrigger.from_crontab(job.schedule_interval)
    scheduler.add_job(run_job, trigger, args=[job.id], id=str(job.id))

def load_jobs_from_db():
    db = SessionLocal()
    jobs = db.query(Schedule).all()
    for job in jobs:
        add_job_to_scheduler(job)
    db.close()

def start_scheduler():
    load_jobs_from_db()
    scheduler.start()