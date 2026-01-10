import { Link } from "react-router-dom";
import { Leaf, Award, CheckCircle2, Users, Heart, Target, ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const features = [
    { icon: Award, title: "Proudly Namibian", description: "100% Namibian owned and operated, deeply rooted in local agriculture." },
    { icon: CheckCircle2, title: "Quality Guaranteed", description: "We source only the highest quality products suited for Namibia's conditions." },
    { icon: Users, title: "Expert Team", description: "Our team brings decades of combined experience in Namibian agriculture." },
    { icon: Heart, title: "Sustainable Approach", description: "Committed to promoting sustainable farming practices for long-term success." },
  ];

  const values = [
    { title: "Innovation", description: "Embracing modern agricultural technologies and methods" },
    { title: "Integrity", description: "Building trust through honest and transparent business practices" },
    { title: "Excellence", description: "Delivering outstanding service and products to every farmer" },
    { title: "Community", description: "Supporting and growing together with Namibian farmers" },
  ];

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
              <Leaf className="w-4 h-4 mr-2" /> About Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Empowering Namibian Farmers
              <span className="block text-lime-400">Since 2018</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Bloom Agriculture Namibia CC is a proudly Namibian agricultural company committed to empowering farmers through high-quality products, expert consultancy, and practical training.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg" alt="Seeds" className="rounded-2xl shadow-lg h-48 w-full object-cover hover:scale-105 transition-transform duration-300" />
                  <img src="https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb" alt="Irrigation" className="rounded-2xl shadow-lg h-64 w-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="https://images.unsplash.com/photo-1744726010540-bf318d4a691f" alt="Consultancy" className="rounded-2xl shadow-lg h-64 w-full object-cover hover:scale-105 transition-transform duration-300" />
                  <img src="https://images.pexels.com/photos/3307282/pexels-photo-3307282.jpeg" alt="Harvest" className="rounded-2xl shadow-lg h-48 w-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white rounded-2xl px-8 py-4 shadow-xl hidden lg:block">
                <div className="text-center">
                  <span className="text-3xl font-bold">10+</span>
                  <p className="text-green-100 text-sm">Years of Excellence</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-right">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50">
                <Target className="w-4 h-4 mr-2" /> Our Story
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Growing Together with Namibia</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2018, Bloom Agriculture Namibia CC emerged from a deep passion for Namibian agriculture and a vision to transform farming across the country.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We specialize in delivering premium vegetable seeds, fertilizers, pesticides, and farming inputs customized for Namibia's unique environment. Our comprehensive services include soil sampling and analysis, farm training, consultancy, project management, and irrigation solutions.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Bloom Agriculture, we focus on <strong>smart farming</strong>, <strong>sustainable production</strong>, and <strong>successful harvesting</strong>, striving for innovation, outstanding service, and strong, lasting relationships with farmers across Namibia.
              </p>
              <Link to="/contact">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
                  Get In Touch <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-white">
              <Award className="w-4 h-4 mr-2" /> Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our commitment to quality and service makes us the trusted partner for Namibian farmers</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <feature.icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-200 bg-green-50">
                <Heart className="w-4 h-4 mr-2" /> Our Values
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">The Principles That Guide Us</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our core values shape everything we do, from the products we select to the relationships we build with farmers across Namibia.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-right">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-green-500 rounded-3xl blur-2xl opacity-20" />
              <img src="https://images.unsplash.com/photo-1741874299706-2b8e16839aaa" alt="Namibian Farm" className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl text-gray-400 mb-8">Let's discuss how we can help your agricultural business grow</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="tel:0813228282" className="flex items-center gap-3 text-lime-400 hover:text-lime-300 transition-colors">
              <Phone className="w-6 h-6" />
              <span className="text-lg font-medium">081 322 8282</span>
            </a>
            <a href="mailto:bloomagricnam@gmail.com" className="flex items-center gap-3 text-lime-400 hover:text-lime-300 transition-colors">
              <Mail className="w-6 h-6" />
              <span className="text-lg font-medium">bloomagricnam@gmail.com</span>
            </a>
          </div>
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
                Contact Us Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
