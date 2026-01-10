import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf, LogOut, Plus, Trash2, Edit, Eye, MessageSquare, LayoutDashboard,
  Images, CalendarDays, Settings, X, Save, CheckCircle2, AlertCircle, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import { API } from "@/App";

// Logo URL
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bloom-redesign-1/artifacts/q2u8vu9s_image.png";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [stats, setStats] = useState({ gallery_count: 0, events_count: 0, messages_count: 0, unread_messages: 0 });
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [galleryForm, setGalleryForm] = useState({ title: "", description: "", image_url: "", category: "general" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", time: "", location: "", image_url: "", category: "workshop", is_featured: false });

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    try {
      const [statsRes, galleryRes, eventsRes, messagesRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/gallery?active_only=false`),
        axios.get(`${API}/events?active_only=false`),
        axios.get(`${API}/contact`)
      ]);
      setStats(statsRes.data);
      setGallery(galleryRes.data);
      setEvents(eventsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const response = await axios.post(`${API}/admin/login`, loginForm);
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        setToken(response.data.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setLoginError("Invalid username or password");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Gallery CRUD
  const handleSaveGallery = async () => {
    setIsSaving(true);
    try {
      if (editingItem) {
        await axios.put(`${API}/gallery/${editingItem.id}`, galleryForm);
        showNotification("Gallery item updated successfully");
      } else {
        await axios.post(`${API}/gallery`, galleryForm);
        showNotification("Gallery item added successfully");
      }
      setShowGalleryModal(false);
      setEditingItem(null);
      setGalleryForm({ title: "", description: "", image_url: "", category: "general" });
      fetchAllData();
    } catch (error) {
      showNotification("Failed to save gallery item", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API}/gallery/${id}`);
      showNotification("Gallery item deleted");
      fetchAllData();
    } catch (error) {
      showNotification("Failed to delete item", "error");
    }
  };

  const editGalleryItem = (item) => {
    setEditingItem(item);
    setGalleryForm({ title: item.title, description: item.description, image_url: item.image_url, category: item.category });
    setShowGalleryModal(true);
  };

  // Event CRUD
  const handleSaveEvent = async () => {
    setIsSaving(true);
    try {
      if (editingItem) {
        await axios.put(`${API}/events/${editingItem.id}`, eventForm);
        showNotification("Event updated successfully");
      } else {
        await axios.post(`${API}/events`, eventForm);
        showNotification("Event added successfully");
      }
      setShowEventModal(false);
      setEditingItem(null);
      setEventForm({ title: "", description: "", date: "", time: "", location: "", image_url: "", category: "workshop", is_featured: false });
      fetchAllData();
    } catch (error) {
      showNotification("Failed to save event", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API}/events/${id}`);
      showNotification("Event deleted");
      fetchAllData();
    } catch (error) {
      showNotification("Failed to delete event", "error");
    }
  };

  const editEventItem = (item) => {
    setEditingItem(item);
    setEventForm({ title: item.title, description: item.description, date: item.date, time: item.time, location: item.location, image_url: item.image_url || "", category: item.category, is_featured: item.is_featured });
    setShowEventModal(true);
  };

  // Messages
  const handleMarkRead = async (id) => {
    try {
      await axios.put(`${API}/contact/${id}/read`);
      fetchAllData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${API}/contact/${id}`);
      showNotification("Message deleted");
      fetchAllData();
    } catch (error) {
      showNotification("Failed to delete message", "error");
    }
  };

  // Seed Data
  const handleSeedData = async () => {
    try {
      await axios.post(`${API}/seed`);
      showNotification("Sample data added successfully");
      fetchAllData();
    } catch (error) {
      showNotification("Failed to seed data", "error");
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-400 rounded-full blur-3xl" />
        </div>
        
        <Card className="w-full max-w-md relative z-10 animate-fade-in-up">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={LOGO_URL} alt="Bloom Agriculture Namibia" className="h-24 w-auto" />
            </div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                  placeholder="Enter username"
                  required
                  data-testid="admin-username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                  placeholder="Enter password"
                  required
                  data-testid="admin-password"
                />
              </div>
              <Button type="submit" disabled={isLoggingIn} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-6" data-testid="admin-login-btn">
                {isLoggingIn ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/" className="text-green-600 hover:text-green-700 text-sm">
                ← Back to Website
              </Link>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 text-center">
              Default: admin / bloom2024
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Bloom Agriculture" className="h-10 w-auto" />
              <div>
                <span className="font-bold text-gray-900">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-green-600 text-sm hidden sm:block">
                View Website
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="dashboard" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Images className="w-4 h-4 mr-2" /> Gallery
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <CalendarDays className="w-4 h-4 mr-2" /> Events
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
              {stats.unread_messages > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{stats.unread_messages}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Gallery Items</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.gallery_count}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Images className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Events</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.events_count}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <CalendarDays className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Messages</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.messages_count}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Unread Messages</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.unread_messages}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => { setEditingItem(null); setGalleryForm({ title: "", description: "", image_url: "", category: "general" }); setShowGalleryModal(true); }} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Gallery Item
                </Button>
                <Button onClick={() => { setEditingItem(null); setEventForm({ title: "", description: "", date: "", time: "", location: "", image_url: "", category: "workshop", is_featured: false }); setShowEventModal(true); }} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Event
                </Button>
                <Button onClick={handleSeedData} variant="outline">
                  <Settings className="w-4 h-4 mr-2" /> Load Sample Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
              <Button onClick={() => { setEditingItem(null); setGalleryForm({ title: "", description: "", image_url: "", category: "general" }); setShowGalleryModal(true); }} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-green-600">{item.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => editGalleryItem(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteGallery(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
              <Button onClick={() => { setEditingItem(null); setEventForm({ title: "", description: "", date: "", time: "", location: "", image_url: "", category: "workshop", is_featured: false }); setShowEventModal(true); }} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <img src={event.image_url || 'https://images.unsplash.com/photo-1746014929708-fcb859fd3185'} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className="bg-green-600">{event.category}</Badge>
                      {event.is_featured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.date} | {event.time}</p>
                    <p className="text-sm text-gray-500 truncate">{event.location}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => editEventItem(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-gray-500">No messages yet</CardContent></Card>
              ) : (
                messages.map((msg) => (
                  <Card key={msg.id} className={`hover:shadow-lg transition-shadow ${!msg.is_read ? 'border-l-4 border-l-green-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                            {!msg.is_read && <Badge className="bg-green-500">New</Badge>}
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{msg.email} {msg.phone && `| ${msg.phone}`}</p>
                          <p className="text-gray-700 mt-2">{msg.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {!msg.is_read && (
                            <Button size="sm" variant="outline" onClick={() => handleMarkRead(msg.id)}>
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteMessage(msg.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Gallery Modal */}
      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input type="text" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" placeholder="Enter title" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input type="url" value={galleryForm.image_url} onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" placeholder="https://example.com/image.jpg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none">
                <option value="general">General</option>
                <option value="products">Products</option>
                <option value="projects">Projects</option>
                <option value="training">Training</option>
                <option value="services">Services</option>
                <option value="farms">Farms</option>
                <option value="success-stories">Success Stories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows={3} value={galleryForm.description} onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none resize-none" placeholder="Brief description" />
            </div>
            {galleryForm.image_url && (
              <div className="rounded-xl overflow-hidden border">
                <img src={galleryForm.image_url} alt="Preview" className="w-full h-40 object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowGalleryModal(false)}>Cancel</Button>
            <Button onClick={handleSaveGallery} disabled={isSaving || !galleryForm.title || !galleryForm.image_url} className="bg-green-600 hover:bg-green-700">
              {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" placeholder="Event title" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input type="text" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" placeholder="9:00 AM - 4:00 PM" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" placeholder="Event location" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input type="url" value={eventForm.image_url} onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none" placeholder="https://example.com/image.jpg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none">
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="exhibition">Exhibition</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={eventForm.is_featured} onChange={(e) => setEventForm({ ...eventForm, is_featured: e.target.checked })} className="w-5 h-5 text-green-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Featured Event</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea rows={4} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none resize-none" placeholder="Event description" required />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowEventModal(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent} disabled={isSaving || !eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location || !eventForm.description} className="bg-green-600 hover:bg-green-700">
              {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
