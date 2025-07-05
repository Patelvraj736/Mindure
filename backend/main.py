from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, analyze, webcam, history, dashboard, calendar, forecast

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(webcam.router)
app.include_router(history.router)
app.include_router(dashboard.router)
app.include_router(calendar.router)
app.include_router(forecast.router)
