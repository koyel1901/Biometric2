from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from contextlib import asynccontextmanager
from app.api.routes import attendance, admin, users
from app.mqtt.client import mqtt_manager
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting GridSphere IoT Core...")
    mqtt_manager.start() # [cite: 74, 84]
    yield
    logger.info("Shutting down...")
    mqtt_manager.stop()

app = FastAPI(title="GridSphere Multi-Tenant API", lifespan=lifespan)

from fastapi.responses import JSONResponse, FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import os

# --- UI ROUTE (Placed at the top for priority) ---
# Mount the entire frontend directory to serve all the html/css files statically.
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frontend_dir = os.path.join(base_dir, "frontend")

if os.path.exists(frontend_dir):
    app.mount("/ui", StaticFiles(directory=frontend_dir, html=True), name="frontend")
else:
    logger.warning("Frontend directory not found.")

@app.get("/", tags=["UI"])
async def serve_dashboard():
    # Redirect root to the mounted UI
    return RedirectResponse(url="/ui/")

# --- REGISTER ROUTERS ---
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"]) # [cite: 74, 79]
app.include_router(admin.router, prefix="/api/admin", tags=["Admin/Commands"]) # [cite: 78]

# --- GLOBAL ERROR HANDLING ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"System Error: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})