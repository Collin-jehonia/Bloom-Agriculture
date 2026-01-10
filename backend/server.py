from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://wwfhaxdvizqzaqrnusiz.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZmhheGR2aXpxemFxcm51c2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTU4NjgsImV4cCI6MjA1OTAzMTg2OH0.q5Q7nPzd-IQfzo30c4MWSoJawF1KB4QBnUsLhNZUDsg')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StatusCheckCreate(BaseModel):
    client_name: str

# Gallery Models
class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = ""
    image_url: str
    category: str = "general"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_active: bool = True

class GalleryItemCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    image_url: str
    category: str = "general"

class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

# Event Models
class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    time: str
    location: str
    image_url: Optional[str] = ""
    category: str = "workshop"
    is_featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_active: bool = True

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    location: str
    image_url: Optional[str] = ""
    category: str = "workshop"
    is_featured: bool = False

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

# Contact Message Model
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_read: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str

# ==================== HELPER FUNCTIONS ====================

async def init_tables():
    """Initialize tables in Supabase if they don't exist"""
    try:
        # Check if gallery table exists by trying to query it
        supabase.table('gallery').select('id').limit(1).execute()
        logger.info("Gallery table exists")
    except Exception as e:
        logger.info(f"Gallery table check: {e}")

    try:
        supabase.table('events').select('id').limit(1).execute()
        logger.info("Events table exists")
    except Exception as e:
        logger.info(f"Events table check: {e}")

    try:
        supabase.table('contact_messages').select('id').limit(1).execute()
        logger.info("Contact messages table exists")
    except Exception as e:
        logger.info(f"Contact messages table check: {e}")

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Bloom Agriculture API - Powered by Supabase"}

# Status Routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(client_name=input.client_name)
    try:
        result = supabase.table('status_checks').insert(status_obj.model_dump()).execute()
        return status_obj
    except Exception as e:
        logger.error(f"Error creating status check: {e}")
        return status_obj

@api_router.get("/status")
async def get_status_checks():
    try:
        result = supabase.table('status_checks').select('*').execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching status checks: {e}")
        return []

# ==================== GALLERY ROUTES ====================

@api_router.get("/gallery")
async def get_gallery_items(category: Optional[str] = None, active_only: bool = True):
    try:
        query = supabase.table('gallery').select('*')
        if category:
            query = query.eq('category', category)
        if active_only:
            query = query.eq('is_active', True)
        result = query.order('created_at', desc=True).execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching gallery: {e}")
        return []

@api_router.get("/gallery/{item_id}")
async def get_gallery_item(item_id: str):
    try:
        result = supabase.table('gallery').select('*').eq('id', item_id).single().execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching gallery item: {e}")
        raise HTTPException(status_code=404, detail="Gallery item not found")

@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(input: GalleryItemCreate):
    item = GalleryItem(**input.model_dump())
    try:
        result = supabase.table('gallery').insert(item.model_dump()).execute()
        return item
    except Exception as e:
        logger.error(f"Error creating gallery item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/gallery/{item_id}")
async def update_gallery_item(item_id: str, input: GalleryItemUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    try:
        result = supabase.table('gallery').update(update_data).eq('id', item_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating gallery item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    try:
        result = supabase.table('gallery').delete().eq('id', item_id).execute()
        return {"message": "Gallery item deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting gallery item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== EVENT ROUTES ====================

@api_router.get("/events")
async def get_events(category: Optional[str] = None, featured_only: bool = False, active_only: bool = True):
    try:
        query = supabase.table('events').select('*')
        if category:
            query = query.eq('category', category)
        if featured_only:
            query = query.eq('is_featured', True)
        if active_only:
            query = query.eq('is_active', True)
        result = query.order('date', desc=False).execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching events: {e}")
        return []

@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    try:
        result = supabase.table('events').select('*').eq('id', event_id).single().execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching event: {e}")
        raise HTTPException(status_code=404, detail="Event not found")

@api_router.post("/events", response_model=Event)
async def create_event(input: EventCreate):
    event = Event(**input.model_dump())
    try:
        result = supabase.table('events').insert(event.model_dump()).execute()
        return event
    except Exception as e:
        logger.error(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, input: EventUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    try:
        result = supabase.table('events').update(update_data).eq('id', event_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Event not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    try:
        result = supabase.table('events').delete().eq('id', event_id).execute()
        return {"message": "Event deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CONTACT ROUTES ====================

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    message = ContactMessage(**input.model_dump())
    try:
        result = supabase.table('contact_messages').insert(message.model_dump()).execute()
        return message
    except Exception as e:
        logger.error(f"Error creating contact message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/contact")
async def get_contact_messages():
    try:
        result = supabase.table('contact_messages').select('*').order('created_at', desc=True).execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching contact messages: {e}")
        return []

@api_router.put("/contact/{message_id}/read")
async def mark_message_read(message_id: str):
    try:
        result = supabase.table('contact_messages').update({"is_read": True}).eq('id', message_id).execute()
        return {"message": "Message marked as read"}
    except Exception as e:
        logger.error(f"Error marking message as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str):
    try:
        result = supabase.table('contact_messages').delete().eq('id', message_id).execute()
        return {"message": "Message deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting contact message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ADMIN AUTH ====================

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = hashlib.sha256("bloom2024".encode()).hexdigest()

@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin):
    password_hash = hashlib.sha256(credentials.password.encode()).hexdigest()
    if credentials.username == ADMIN_USERNAME and password_hash == ADMIN_PASSWORD_HASH:
        token = hashlib.sha256(f"{credentials.username}{datetime.now().isoformat()}".encode()).hexdigest()
        return AdminResponse(success=True, token=token, message="Login successful")
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ==================== STATS ROUTE ====================

@api_router.get("/admin/stats")
async def get_admin_stats():
    try:
        gallery_result = supabase.table('gallery').select('id', count='exact').eq('is_active', True).execute()
        events_result = supabase.table('events').select('id', count='exact').eq('is_active', True).execute()
        messages_result = supabase.table('contact_messages').select('id', count='exact').execute()
        unread_result = supabase.table('contact_messages').select('id', count='exact').eq('is_read', False).execute()
        
        return {
            "gallery_count": gallery_result.count or 0,
            "events_count": events_result.count or 0,
            "messages_count": messages_result.count or 0,
            "unread_messages": unread_result.count or 0
        }
    except Exception as e:
        logger.error(f"Error fetching admin stats: {e}")
        return {
            "gallery_count": 0,
            "events_count": 0,
            "messages_count": 0,
            "unread_messages": 0
        }

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_database():
    """Seed the database with initial gallery and events data"""
    
    try:
        # Check if already seeded
        gallery_check = supabase.table('gallery').select('id').limit(1).execute()
        if gallery_check.data and len(gallery_check.data) > 0:
            return {"message": "Database already seeded"}
    except Exception as e:
        logger.info(f"Table check during seed: {e}")
    
    # Seed Gallery
    gallery_items = [
        {
            "id": str(uuid.uuid4()),
            "title": "Vegetable Seeds Collection",
            "description": "Premium quality vegetable seeds suited for Namibia's climate",
            "image_url": "https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg",
            "category": "products",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Irrigation System Installation",
            "description": "Modern pivot irrigation system installed at a local farm",
            "image_url": "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb",
            "category": "projects",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Farmer Training Workshop",
            "description": "Practical training session with local farmers",
            "image_url": "https://images.unsplash.com/photo-1746014929708-fcb859fd3185",
            "category": "training",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Corn Harvest Success",
            "description": "Successful corn harvest from one of our partner farms",
            "image_url": "https://images.pexels.com/photos/3307282/pexels-photo-3307282.jpeg",
            "category": "success-stories",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Soil Analysis Service",
            "description": "Our team conducting comprehensive soil analysis",
            "image_url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
            "category": "services",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Farm Consultancy Visit",
            "description": "Expert consultation at a local agricultural project",
            "image_url": "https://images.unsplash.com/photo-1744726010540-bf318d4a691f",
            "category": "services",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Green Fields of Namibia",
            "description": "Beautiful farmland showing sustainable agricultural practices",
            "image_url": "https://images.unsplash.com/photo-1741874299706-2b8e16839aaa",
            "category": "farms",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Sprinkler Irrigation",
            "description": "Efficient water management with modern sprinkler systems",
            "image_url": "https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c",
            "category": "projects",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
    ]
    
    # Seed Events
    events = [
        {
            "id": str(uuid.uuid4()),
            "title": "Farmer Training Workshop 2025",
            "description": "Join us for an intensive 2-day workshop on modern farming techniques, soil management, and sustainable agriculture practices. Perfect for both new and experienced farmers.",
            "date": "2025-09-15",
            "time": "09:00 AM - 4:00 PM",
            "location": "Windhoek Agricultural Center, Namibia",
            "image_url": "https://images.unsplash.com/photo-1746014929708-fcb859fd3185",
            "category": "workshop",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Irrigation Solutions Seminar",
            "description": "Learn about the latest irrigation technologies and water conservation methods suitable for Namibia's climate. Includes hands-on demonstrations.",
            "date": "2025-10-05",
            "time": "10:00 AM - 2:00 PM",
            "location": "Bloom Agriculture Office, Windhoek",
            "image_url": "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb",
            "category": "seminar",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Agricultural Products Exhibition",
            "description": "Explore our complete range of seeds, fertilizers, and farming equipment. Meet our experts and get personalized recommendations for your farm.",
            "date": "2025-11-20",
            "time": "08:00 AM - 5:00 PM",
            "location": "Namibia Trade Fair Grounds",
            "image_url": "https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg",
            "category": "exhibition",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Soil Health Assessment Day",
            "description": "Free soil testing and analysis for registered farmers. Learn how to improve your soil quality for better yields.",
            "date": "2025-08-28",
            "time": "07:00 AM - 12:00 PM",
            "location": "Various locations across Namibia",
            "image_url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
            "category": "workshop",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
    ]
    
    try:
        # Insert gallery items
        for item in gallery_items:
            try:
                supabase.table('gallery').insert(item).execute()
            except Exception as e:
                logger.error(f"Error inserting gallery item: {e}")
        
        # Insert events
        for event in events:
            try:
                supabase.table('events').insert(event).execute()
            except Exception as e:
                logger.error(f"Error inserting event: {e}")
        
        return {"message": "Database seeded successfully", "gallery_items": len(gallery_items), "events": len(events)}
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== TABLE CREATION ENDPOINT ====================

@api_router.post("/init-tables")
async def initialize_tables():
    """Initialize required tables in Supabase"""
    sql_statements = """
    -- Note: Run these SQL statements in Supabase SQL Editor
    
    -- Gallery table
    CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        is_active BOOLEAN DEFAULT TRUE
    );

    -- Events table
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        category TEXT DEFAULT 'workshop',
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        is_active BOOLEAN DEFAULT TRUE
    );

    -- Contact messages table
    CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        is_read BOOLEAN DEFAULT FALSE
    );

    -- Status checks table
    CREATE TABLE IF NOT EXISTS status_checks (
        id TEXT PRIMARY KEY,
        client_name TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    """
    
    return {
        "message": "Please run these SQL statements in Supabase SQL Editor",
        "sql": sql_statements
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Bloom Agriculture API with Supabase")
    await init_tables()
