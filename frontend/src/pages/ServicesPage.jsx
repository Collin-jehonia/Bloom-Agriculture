import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, Droplets, FlaskConical, GraduationCap, FolderKanban, Users, Sprout, 
  ArrowRight, CheckCircle2, Phone, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { servicesService } from "@/lib/supabase";

const iconMap = {
  Sprout, FlaskConical, Droplets, GraduationCap, FolderKanban, Users
};

const defaultServices = [
  {
    icon: "Sprout",
    title: "Premium Agricultural Products",
    description: "We offer high-quality vegetable seeds, fertilizers, pesticides, and farming inputs specially selected for Namibia's conditions.",
    features: ["Premium vegetable seeds", "Quality fertilizers", "Effective pesticides", "Essential farming inputs"],
    image_url: "https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg"
  },
  {
    icon: "FlaskConical",
    title: "Soil Analysis & Consultation",
    description: "Our experts provide comprehensive soil sampling and analysis, coupled with tailored recommendations for optimal crop production.",
    features: ["Comprehensive soil testing", "Nutrient analysis", "pH level assessment", "Customized recommendations"],
    image_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae"
  },
  {
    icon: "Droplets",
    title: "Irrigation Solutions",
    description: "Custom irrigation designs, installations, and maintenance to ensure efficient water usage in Namibia's challenging climate.",
    features: ["Custom system design", "Professional installation", "Maintenance services", "Water efficiency optimization"],
    image_url: "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb"
  },
  {
    icon: "GraduationCap",
    title: "Farmer Training Programs",
    description: "Practical training sessions designed to equip Namibian farmers with modern farming techniques and best practices.",
    features: ["Modern farming techniques", "Hands-on workshops", "Best practices training", "Ongoing support"],
    image_url: "https://images.unsplash.com/photo-1746014929708-fcb859fd3185"
  },
  {
    icon: "FolderKanban",
    title: "Project Management",
    description: "End-to-end agricultural project management, from planning and implementation to monitoring and evaluation.",
    features: ["Project planning", "Implementation support", "Progress monitoring", "Performance evaluation"],
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
  },
  {
    icon: "Users",
    title: "Farm Consultancy",
    description: "Expert advice on crop selection, farm layout, production practices, and harvest optimization tailored to your specific needs.",
    features: ["Crop selection guidance", "Farm layout planning", "Production optimization", "Harvest strategies"],
    image_url: "https://images.unsplash.com/photo-1744726010540-bf318d4a691f"
  }
];

const ServicesPage = () => {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesService.getAll();
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lime-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <Badge variant="outline" className="mb-4 text-lime-300 border-lime-400/30 bg-green-500/10">
              <Leaf className="w-4 h-4 mr-2" /> Our Services
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Comprehensive Agricultural
              <span className="block text-lime-400">Solutions</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              At Bloom Agriculture, we provide comprehensive agricultural solutions customized for Namibia's unique farming challenges - from premium inputs to expert consultancy.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Sprout;
              const features = Array.isArray(service.features) ? service.features : [];
              return (
                <div key={service.id || index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} animate-fade-in-up`}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-green-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                      <img src={service.image_url || service.image} alt={service.title} className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      <div className="absolute top-6 left-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                          <IconComponent className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
                    <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50">
                      Service {String(index + 1).padStart(2, '0')}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{service.title}</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    {features.length > 0 && (
                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link to="/contact">
                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                        Get This Service <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Need a Custom Solution?</h2>
          <p className="text-xl text-green-100 mb-8">
            Contact us today to discuss your specific agricultural needs. Our experts are ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <a href="tel:0813228282" className="flex items-center gap-3 text-white hover:text-green-200 transition-colors">
              <Phone className="w-6 h-6" />
              <span className="text-lg font-medium">081 322 8282</span>
            </a>
            <a href="mailto:bloomagricnam@gmail.com" className="flex items-center gap-3 text-white hover:text-green-200 transition-colors">
              <Mail className="w-6 h-6" />
              <span className="text-lg font-medium">bloomagricnam@gmail.com</span>
            </a>
          </div>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 rounded-full px-8">
              Request a Consultation <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
