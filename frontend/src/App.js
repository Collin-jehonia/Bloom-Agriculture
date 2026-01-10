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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  const isHomePage = location.pathname === "/";
  const navBg = isScrolled || !isHomePage ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent";
  const textColor = isScrolled || !isHomePage ? "text-gray-700" : "text-white/90";

  return (
    <nav data-testid="navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={LOGO_URL} 
              alt="Bloom Agriculture Namibia" 
              className={`h-16 md:h-20 w-auto transition-all ${!isScrolled && isHomePage ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium transition-colors hover:text-green-500 ${textColor} ${location.pathname === link.href ? 'text-green-500' : ''}`}
                data-testid={`nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6" data-testid="nav-get-started">
                Get Started
              </Button>
            </Link>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-green-600"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full mt-4 w-full">
                    Get Started
                  </Button>
                </Link>
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
