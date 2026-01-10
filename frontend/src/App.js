import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Leaf, Phone, Mail, MapPin, Menu, X, ChevronRight, Droplets, FlaskConical, 
  GraduationCap, FolderKanban, Users, Sprout, Award, Heart, Target, CheckCircle2, 
  ArrowRight, Calendar, Clock, Image, Settings, LogOut, Plus, Trash2, Edit, Eye,
  MessageSquare, LayoutDashboard, Images, CalendarDays, Facebook, Twitter, Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) setIsAdmin(true);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Logo URL
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bloom-redesign-1/artifacts/q2u8vu9s_image.png";

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "About", href: "/about", icon: "ℹ️" },
    { name: "Services", href: "/services", icon: "⚙️" },
    { name: "Gallery", href: "/gallery", icon: "🖼️" },
    { name: "Events", href: "/events", icon: "📅" },
    { name: "Contact", href: "/contact", icon: "📞" },
  ];

  const isHomePage = location.pathname === "/";
  const isTransparent = !isScrolled && isHomePage;

  return (
    <nav 
      data-testid="navigation" 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent 
          ? "bg-transparent" 
          : "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`relative transition-all duration-300 ${isTransparent ? '' : 'hover:scale-105'}`}>
              <img 
                src={LOGO_URL} 
                alt="Bloom Agriculture Namibia" 
                className={`h-14 md:h-16 lg:h-20 w-auto transition-all duration-300 ${
                  isTransparent ? 'brightness-0 invert drop-shadow-lg' : ''
                }`}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className={`flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${
              isTransparent 
                ? "bg-white/10 backdrop-blur-md border border-white/20" 
                : "bg-gray-100/80"
            }`}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onMouseEnter={() => setActiveHover(link.name)}
                    onMouseLeave={() => setActiveHover(null)}
                    className={`relative px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                      isActive 
                        ? isTransparent 
                          ? "bg-white text-green-700 shadow-lg" 
                          : "bg-green-600 text-white shadow-lg shadow-green-600/30"
                        : isTransparent 
                          ? "text-white/90 hover:bg-white/20" 
                          : "text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                    }`}
                    data-testid={`nav-${link.name.toLowerCase()}`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {activeHover === link.name && !isActive && (
                      <span className={`absolute inset-0 rounded-full animate-pulse ${
                        isTransparent ? "bg-white/10" : "bg-green-100/50"
                      }`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <Link to="/contact" className="ml-4">
              <Button 
                className={`relative overflow-hidden rounded-full px-6 py-2.5 font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isTransparent 
                    ? "bg-white text-green-700 hover:bg-green-50 shadow-lg shadow-white/25" 
                    : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-600/30"
                }`}
                data-testid="nav-get-started"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
                  isTransparent 
                    ? "text-white hover:bg-white/20" 
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-gray-100">
                  <img src={LOGO_URL} alt="Bloom Agriculture" className="h-12 w-auto" />
                </div>
                
                {/* Mobile Nav Links */}
                <div className="flex-1 py-6 px-4 space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-medium transition-all duration-300 animate-fade-in-left ${
                          isActive 
                            ? "bg-green-600 text-white shadow-lg shadow-green-600/30" 
                            : "text-gray-700 hover:bg-gray-100 hover:translate-x-2"
                        }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.name}</span>
                        {isActive && <ChevronRight className="w-5 h-5 ml-auto" />}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Footer */}
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <Link to="/contact" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl py-6 font-semibold shadow-lg shadow-green-600/30 hover:shadow-xl transition-all">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <a href="tel:0813228282" className="hover:text-green-600">081 322 8282</a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-testid="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={LOGO_URL} 
                alt="Bloom Agriculture Namibia" 
                className="h-20 md:h-24 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering Namibian farmers with premium agricultural products, expert consultancy, and practical training since 2018.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Gallery", "Events", "Contact"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`} className="text-gray-400 hover:text-lime-400 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500" />
                <a href="tel:0813228282" className="hover:text-lime-400">081 322 8282</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500" />
                <a href="mailto:bloomagricnam@gmail.com" className="hover:text-lime-400">bloomagricnam@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span>Windhoek, Namibia</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-2">Department Emails:</p>
              <p className="text-sm text-gray-400">sales@bloomagriculture.com.na</p>
              <p className="text-sm text-gray-400">info@bloomagriculture.com.na</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {currentYear} Bloom Agriculture Namibia CC. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Smart Farming • Sustainable Production • Successful Harvesting</p>
          <p className="text-gray-400 text-sm">Developed by <span className="text-green-500 font-semibold">NamStack</span></p>
        </div>
      </div>
    </footer>
  );
};

// Import Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import GalleryPage from "@/pages/GalleryPage";
import EventsPage from "@/pages/EventsPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";

// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
            <Route path="/events" element={<Layout><EventsPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Layout><HomePage /></Layout>} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
export { API };
