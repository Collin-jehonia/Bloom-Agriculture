import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, ChevronRight, Droplets, FlaskConical, GraduationCap, FolderKanban, 
  Users, Sprout, Award, Heart, CheckCircle2, ArrowRight, Calendar, Clock, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { API } from "@/App";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, galleryRes] = await Promise.all([
          axios.get(`${API}/events?featured_only=true`),
          axios.get(`${API}/gallery`)
        ]);
        setEvents(eventsRes.data.slice(0, 2));
        setGallery(galleryRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Happy Farmers" },
    { value: "95%", label: "Success Rate" },
  ];

  const services = [
    { icon: Sprout, title: "Premium Agricultural Products", description: "High-quality seeds, fertilizers, and farming inputs" },
    { icon: FlaskConical, title: "Soil Analysis", description: "Comprehensive soil testing and recommendations" },
    { icon: Droplets, title: "Irrigation Solutions", description: "Custom irrigation designs and installations" },
    { icon: GraduationCap, title: "Farmer Training", description: "Modern farming techniques and best practices" },
    { icon: FolderKanban, title: "Project Management", description: "End-to-end agricultural project support" },
    { icon: Users, title: "Farm Consultancy", description: "Expert advice tailored to your needs" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section data-testid="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1741874299706-2b8e16839aaa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85"
            alt="Sustainable Agriculture"
            className="w-full h-full object-cover animate-scale-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 mb-6 animate-fade-in-down">
                <Sprout className="w-4 h-4 text-lime-400 animate-bounce-slow" />
                <span className="text-lime-300 text-sm font-medium">Proudly Namibian Since 2018</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
                Grow with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300 animate-pulse-slow">
                  Sustainable Solutions
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                Empowering Namibian farmers with premium agricultural products, expert consultancy, and practical training to boost productivity and sustainability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-in-up animation-delay-300">
                <Link to="/services">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 text-lg group w-full sm:w-auto hover-glow transition-all duration-300" data-testid="hero-explore-btn">
                    Explore Services
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-lg backdrop-blur-sm w-full sm:w-auto hover:scale-105 transition-all duration-300" data-testid="hero-contact-btn">
                    Contact Us
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 animate-fade-in-up animation-delay-400">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left group" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <div className="text-3xl sm:text-4xl font-bold text-lime-400 group-hover:scale-110 transition-transform">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block animate-fade-in-right animation-delay-300">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-lime-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse-slow" />
                <img
                  src="https://images.unsplash.com/photo-1746014929708-fcb859fd3185?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85"
                  alt="African Farmer"
                  className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4 animate-bounce-slow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-heartbeat">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Quality Guaranteed</p>
                    <p className="text-sm text-gray-500">Premium Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50 animate-bounce-slow">
              <Leaf className="w-4 h-4 mr-2" /> Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Agricultural
              <span className="block text-green-600">Solutions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-fade-in-up border-0 shadow-lg" style={{ animationDelay: `${index * 0.1}s` }} data-testid={`service-card-${index}`}>
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up animation-delay-500">
            <Link to="/services">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 hover:scale-105 transition-all duration-300">
                View All Services <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50 animate-bounce-slow">
                <Calendar className="w-4 h-4 mr-2" /> Upcoming Events
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Join Our Events</h2>
              <p className="text-lg text-gray-600">Stay connected with the latest workshops and training sessions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {events.map((event, index) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up group" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white animate-pulse">{event.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 rounded-full px-8">
                  View All Events <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sprout className="w-4 h-4 text-green-200" />
            <span className="text-green-100 text-sm font-medium">Join Our Community</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Grow with Bloom Agriculture?
          </h2>

          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join successful Namibian farmers who trust our products and expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 rounded-full px-8 text-lg font-semibold shadow-xl w-full sm:w-auto" data-testid="cta-contact-btn">
                Contact Us Today <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/gallery">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-lg backdrop-blur-sm w-full sm:w-auto" data-testid="cta-gallery-btn">
                View Our Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
