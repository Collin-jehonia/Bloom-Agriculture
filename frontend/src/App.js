import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Leaf, Phone, Mail, MapPin, Menu, X, ChevronRight, Droplets, FlaskConical, GraduationCap, FolderKanban, Users, Sprout, Award, Heart, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      data-testid="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isScrolled ? 'bg-emerald-600' : 'bg-white/20 backdrop-blur-sm'}`}>
              <Leaf className={`w-8 h-8 ${isScrolled ? 'text-white' : 'text-emerald-400'}`} />
            </div>
            <div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Bloom Agriculture
              </span>
              <p className={`text-xs ${isScrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>Namibia CC</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`font-medium transition-colors hover:text-emerald-500 ${
                  isScrolled ? "text-gray-700" : "text-white/90"
                }`}
                data-testid={`nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("#contact")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
              data-testid="nav-get-started"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={isScrolled ? 'text-gray-900' : 'text-white'}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="text-lg font-medium text-gray-700 hover:text-emerald-600 text-left"
                  >
                    {link.name}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection("#contact")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full mt-4"
                >
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Happy Farmers" },
    { value: "95%", label: "Success Rate" },
  ];

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1741874299706-2b8e16839aaa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85"
          alt="Sustainable Agriculture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Proudly Namibian Since 2018</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Grow with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                Sustainable Solutions
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Empowering Namibian farmers with premium agricultural products, expert consultancy, and practical training to boost productivity and sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 text-lg group"
                onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="hero-explore-btn"
              >
                Explore Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-lg backdrop-blur-sm"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="hero-contact-btn"
              >
                Contact Us
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur-2xl opacity-30" />
              <img
                src="https://images.unsplash.com/photo-1746014929708-fcb859fd3185?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85"
                alt="African Farmer"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Proudly Namibian",
      description: "100% Namibian owned and operated, deeply rooted in local agriculture.",
    },
    {
      icon: CheckCircle2,
      title: "Quality Guaranteed",
      description: "We source only the highest quality products suited for Namibia's conditions.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Our team brings decades of combined experience in Namibian agriculture.",
    },
    {
      icon: Heart,
      title: "Sustainable Approach",
      description: "Committed to promoting sustainable farming practices for long-term success.",
    },
  ];

  return (
    <section id="about" data-testid="about-section" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">About Bloom Agriculture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Empowering Namibian Farmers
            <span className="block text-emerald-600">Since 2018</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg"
                  alt="Hands with seeds"
                  className="rounded-2xl shadow-lg h-48 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxpcnJpZ2F0aW9uJTIwc3lzdGVtcyUyMGZhcm1pbmd8ZW58MHx8fHwxNzY4MDc5MDQ0fDA&ixlib=rb-4.1.0&q=85"
                  alt="Irrigation System"
                  className="rounded-2xl shadow-lg h-64 w-full object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1744726010540-bf318d4a691f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxhZ3JpY3VsdHVyYWwlMjBjb25zdWx0YW5jeXxlbnwwfHx8fDE3NjgwNzkwMzl8MA&ixlib=rb-4.1.0&q=85"
                  alt="Farm Consultancy"
                  className="rounded-2xl shadow-lg h-64 w-full object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/3307282/pexels-photo-3307282.jpeg"
                  alt="Corn Harvest"
                  className="rounded-2xl shadow-lg h-48 w-full object-cover"
                />
              </div>
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white rounded-2xl px-8 py-4 shadow-xl">
              <div className="text-center">
                <span className="text-3xl font-bold">10+</span>
                <p className="text-emerald-100 text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Bloom Agriculture Namibia CC is a proudly Namibian agricultural company committed to empowering farmers through high-quality products, expert consultancy, and practical training.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We specialize in delivering premium vegetable seeds, fertilizers, pesticides, and farming inputs customized for Namibia's unique environment. Our services include soil sampling and analysis, farm training, consultancy, project management, and irrigation solutions — supporting farmers from planting to harvest.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-600 transition-colors">
                    <feature.icon className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  const services = [
    {
      icon: Sprout,
      title: "Premium Agricultural Products",
      description: "High-quality vegetable seeds, fertilizers, pesticides, and farming inputs specially selected for Namibia's conditions.",
      image: "https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg",
    },
    {
      icon: FlaskConical,
      title: "Soil Analysis & Consultation",
      description: "Comprehensive soil sampling and analysis, coupled with tailored recommendations for optimal crop production.",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2187&q=80",
    },
    {
      icon: Droplets,
      title: "Irrigation Solutions",
      description: "Custom irrigation designs, installations, and maintenance to ensure efficient water usage in Namibia's challenging climate.",
      image: "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxpcnJpZ2F0aW9uJTIwc3lzdGVtcyUyMGZhcm1pbmd8ZW58MHx8fHwxNzY4MDc5MDQ0fDA&ixlib=rb-4.1.0&q=85",
    },
    {
      icon: GraduationCap,
      title: "Farmer Training Programs",
      description: "Practical training sessions designed to equip Namibian farmers with modern farming techniques and best practices.",
      image: "https://images.unsplash.com/photo-1746014929708-fcb859fd3185?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmFybWluZyUyMEFmcmljYXxlbnwwfHx8fDE3NjgwNzkwMzR8MA&ixlib=rb-4.1.0&q=85",
    },
    {
      icon: FolderKanban,
      title: "Project Management",
      description: "End-to-end agricultural project management, from planning and implementation to monitoring and evaluation.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      icon: Users,
      title: "Farm Consultancy",
      description: "Expert advice on crop selection, farm layout, production practices, and harvest optimization tailored to your specific needs.",
      image: "https://images.unsplash.com/photo-1744726010540-bf318d4a691f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxhZ3JpY3VsdHVyYWwlMjBjb25zdWx0YW5jeXxlbnwwfHx8fDE3NjgwNzkwMzl8MA&ixlib=rb-4.1.0&q=85",
    },
  ];

  return (
    <section id="services" data-testid="services-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Agricultural
            <span className="block text-emerald-600">Solutions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Bloom Agriculture, we provide comprehensive agricultural solutions customized for Namibia's unique farming challenges.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              data-testid={`service-card-${index}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <service.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="inline-flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <Sprout className="w-4 h-4 text-emerald-200" />
          <span className="text-emerald-100 text-sm font-medium">Join Our Community</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Grow with
          <span className="block">Bloom Agriculture?</span>
        </h2>

        <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
          Join the community of successful Namibian farmers who trust our products and expertise. Let's work together to enhance your agricultural productivity and sustainability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-8 text-lg font-semibold shadow-xl"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="cta-contact-btn"
          >
            Contact Us Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-lg backdrop-blur-sm"
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="cta-services-btn"
          >
            Explore Products
          </Button>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-medium">Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Let's Start Growing
              <span className="block text-emerald-600">Together</span>
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Have questions about our products or services? We'd love to hear from you. Reach out and let's discuss how we can help your farm thrive.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Visit Us</h4>
                  <p className="text-gray-600">Windhoek, Namibia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                  <p className="text-gray-600">+264 XX XXX XXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                  <p className="text-gray-600">info@bloomagriculture.com.na</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">We've received your message and will get back to you soon.</p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="Your name"
                    data-testid="contact-name-input"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="your@email.com"
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="+264 XX XXX XXXX"
                      data-testid="contact-phone-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                    data-testid="contact-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-6 text-lg font-semibold"
                  data-testid="contact-submit-btn"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-testid="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-600 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Bloom Agriculture</span>
                <p className="text-xs text-emerald-400">Namibia CC</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering Namibian farmers with premium agricultural products, expert consultancy, and practical training since 2018.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Smart Farming • Sustainable Production • Successful Harvesting</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Contact"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => document.querySelector(`#${link.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Agricultural Products</li>
              <li>Soil Analysis</li>
              <li>Irrigation Solutions</li>
              <li>Farm Training</li>
              <li>Consultancy</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Bloom Agriculture Namibia CC. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Proudly serving Namibian farmers
          </p>
        </div>
      </div>
    </footer>
  );
};

// Home Page Component
const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
