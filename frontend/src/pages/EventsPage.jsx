import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight, CalendarDays, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { eventsService } from "@/lib/supabase";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Events" },
    { id: "workshop", name: "Workshops" },
    { id: "seminar", name: "Seminars" },
    { id: "exhibition", name: "Exhibitions" },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter(event => event.category === selectedCategory);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

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
              <CalendarDays className="w-4 h-4 mr-2" /> Events & Workshops
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Upcoming Events
              <span className="block text-lime-400">& Training Sessions</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Join our workshops, seminars, and events to learn modern farming techniques and connect with the agricultural community.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12 animate-fade-in-up">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'border-green-200 text-green-700 hover:bg-green-50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`events-filter-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Check back soon for upcoming events</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`event-card-${event.id}`}
                >
                  <div className="relative h-56">
                    <img
                      src={event.image_url || 'https://images.unsplash.com/photo-1746014929708-fcb859fd3185'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-green-600 text-white">{event.category}</Badge>
                      {event.is_featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-sm truncate">{event.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>
                    <Link to="/contact">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                        Register Interest <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Want to Host an Event?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Partner with Bloom Agriculture to organize training sessions, workshops, or agricultural events in your area.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
              Contact Us <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
