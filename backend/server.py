from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
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

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Bloom Agriculture API"}

# Status Routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ==================== GALLERY ROUTES ====================

@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery_items(category: Optional[str] = None, active_only: bool = True):
    query = {}
    if category:
        query["category"] = category
    if active_only:
        query["is_active"] = True
    
    items = await db.gallery.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items

@api_router.get("/gallery/{item_id}", response_model=GalleryItem)
async def get_gallery_item(item_id: str):
    item = await db.gallery.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    return item

@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(input: GalleryItemCreate):
    item = GalleryItem(**input.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery.insert_one(doc)
    return item

@api_router.put("/gallery/{item_id}", response_model=GalleryItem)
async def update_gallery_item(item_id: str, input: GalleryItemUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.gallery.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    item = await db.gallery.find_one({"id": item_id}, {"_id": 0})
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    return item

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted successfully"}

# ==================== EVENT ROUTES ====================

@api_router.get("/events", response_model=List[Event])
async def get_events(category: Optional[str] = None, featured_only: bool = False, active_only: bool = True):
    query = {}
    if category:
        query["category"] = category
    if featured_only:
        query["is_featured"] = True
    if active_only:
        query["is_active"] = True
    
    events = await db.events.find(query, {"_id": 0}).sort("date", 1).to_list(1000)
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
    return events

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if isinstance(event.get('created_at'), str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    return event

@api_router.post("/events", response_model=Event)
async def create_event(input: EventCreate):
    event = Event(**input.model_dump())
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.events.insert_one(doc)
    return event

@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, input: EventUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.events.update_one({"id": event_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if isinstance(event.get('created_at'), str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    return event

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

# ==================== CONTACT ROUTES ====================

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    message = ContactMessage(**input.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return message

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    return messages

@api_router.put("/contact/{message_id}/read")
async def mark_message_read(message_id: str):
    result = await db.contact_messages.update_one({"id": message_id}, {"$set": {"is_read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message marked as read"}

@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted successfully"}

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
    gallery_count = await db.gallery.count_documents({"is_active": True})
    events_count = await db.events.count_documents({"is_active": True})
    messages_count = await db.contact_messages.count_documents({})
    unread_messages = await db.contact_messages.count_documents({"is_read": False})
    
    return {
        "gallery_count": gallery_count,
        "events_count": events_count,
        "messages_count": messages_count,
        "unread_messages": unread_messages
    }

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_database():
    """Seed the database with initial gallery and events data"""
    
    # Check if already seeded
    gallery_count = await db.gallery.count_documents({})
    if gallery_count > 0:
        return {"message": "Database already seeded"}
    
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
            "image_url": "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxpcnJpZ2F0aW9uJTIwc3lzdGVtcyUyMGZhcm1pbmd8ZW58MHx8fHwxNzY4MDc5MDQ0fDA&ixlib=rb-4.1.0&q=85",
            "category": "projects",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Farmer Training Workshop",
            "description": "Practical training session with local farmers",
            "image_url": "https://images.unsplash.com/photo-1746014929708-fcb859fd3185?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85",
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
            "image_url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2187&q=80",
            "category": "services",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Farm Consultancy Visit",
            "description": "Expert consultation at a local agricultural project",
            "image_url": "https://images.unsplash.com/photo-1744726010540-bf318d4a691f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxhZ3JpY3VsdHVyYWwlMjBjb25zdWx0YW5jeXxlbnwwfHx8fDE3NjgwNzkwMzl8MA&ixlib=rb-4.1.0&q=85",
            "category": "services",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Green Fields of Namibia",
            "description": "Beautiful farmland showing sustainable agricultural practices",
            "image_url": "https://images.unsplash.com/photo-1741874299706-2b8e16839aaa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85",
            "category": "farms",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Sprinkler Irrigation",
            "description": "Efficient water management with modern sprinkler systems",
            "image_url": "https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxpcnJpZ2F0aW9uJTIwc3lzdGVtcyUyMGZhcm1pbmd8ZW58MHx8fHwxNzY4MDc5MDQ0fDA&ixlib=rb-4.1.0&q=85",
            "category": "projects",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
    ]
    
    await db.gallery.insert_many(gallery_items)
    
    # Seed Events
    events = [
        {
            "id": str(uuid.uuid4()),
            "title": "Farmer Training Workshop 2025",
            "description": "Join us for an intensive 2-day workshop on modern farming techniques, soil management, and sustainable agriculture practices. Perfect for both new and experienced farmers.",
            "date": "2025-09-15",
            "time": "09:00 AM - 4:00 PM",
            "location": "Windhoek Agricultural Center, Namibia",
            "image_url": "https://images.unsplash.com/photo-1746014929708-fcb859fd3185?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85",
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
            "image_url": "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxpcnJpZ2F0aW9uJTIwc3lzdGVtcyUyMGZhcm1pbmd8ZW58MHx8fHwxNzY4MDc5MDQ0fDA&ixlib=rb-4.1.0&q=85",
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
            "image_url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2187&q=80",
            "category": "workshop",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
    ]
    
    await db.events.insert_many(events)
    
    return {"message": "Database seeded successfully", "gallery_items": len(gallery_items), "events": len(events)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
