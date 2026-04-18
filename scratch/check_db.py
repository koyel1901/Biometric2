
import sys
import os
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from sqlalchemy.future import select
from sqlalchemy import text

# Add the project root to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from app.db.session import engine, AsyncSessionLocal
from app.models.domain import Tenant, AttendanceLog

async def check_db():
    print("Connecting to database...")
    try:
        async with engine.connect() as conn:
            # Check if tables exist
            result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = [row[0] for row in result]
            print(f"Found tables: {tables}")
            
            # Check alembic_version
            if 'alembic_version' in tables:
                result = await conn.execute(text("SELECT version_num FROM alembic_version"))
                version = result.scalar()
                print(f"Alembic Version: {version}")
            else:
                print("Alembic table not found.")

        async with AsyncSessionLocal() as db:
            # Check for tenants
            if 'tenants' in tables:
                result = await db.execute(select(Tenant))
                tenants = result.scalars().all()
                print(f"Tenants found: {len(tenants)}")
                for t in tenants:
                    print(f" - Tenant: {t.name}, API Key: {t.api_key}")
            
            # Check for logs
            if 'attendance_logs' in tables:
                result = await db.execute(select(AttendanceLog).limit(5))
                logs = result.scalars().all()
                print(f"Logs found: {len(logs)}")
    
    except Exception as e:
        print(f"Error connecting to DB: {e}")

if __name__ == "__main__":
    asyncio.run(check_db())
