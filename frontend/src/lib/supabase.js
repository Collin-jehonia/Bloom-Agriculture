import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwfhaxdvizqzaqrnusiz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZmhheGR2aXpxemFxcm51c2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTU4NjgsImV4cCI6MjA1OTAzMTg2OH0.q5Q7nPzd-IQfzo30c4MWSoJawF1KB4QBnUsLhNZUDsg';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Gallery functions
export const galleryService = {
  async getAll(category = null, activeOnly = true) {
    let query = supabase.from('gallery').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
    return data || [];
  },

  async create(item) {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    const { data, error } = await supabase.from('gallery').insert(newItem).select();
    if (error) throw error;
    return data[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('gallery').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Events functions
export const eventsService = {
  async getAll(category = null, featuredOnly = false, activeOnly = true) {
    let query = supabase.from('events').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query.order('date', { ascending: true });
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return data || [];
  },

  async create(event) {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    const { data, error } = await supabase.from('events').insert(newEvent).select();
    if (error) throw error;
    return data[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Contact messages functions
export const contactService = {
  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  },

  async create(message) {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      is_read: false
    };
    const { data, error } = await supabase.from('contact_messages').insert(newMessage).select();
    if (error) throw error;
    return data[0];
  },

  async markAsRead(id) {
    const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    if (error) throw error;
    return true;
  },

  async delete(id) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Admin stats
export const adminService = {
  async getStats() {
    try {
      const [gallery, events, messages, unread] = await Promise.all([
        supabase.from('gallery').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('events').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('contact_messages').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('is_read', false)
      ]);
      
      return {
        gallery_count: gallery.count || 0,
        events_count: events.count || 0,
        messages_count: messages.count || 0,
        unread_messages: unread.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { gallery_count: 0, events_count: 0, messages_count: 0, unread_messages: 0 };
    }
  }
};

// Seed data function
export const seedDatabase = async () => {
  // Check if already seeded
  const { data: existing } = await supabase.from('gallery').select('id').limit(1);
  if (existing && existing.length > 0) {
    return { message: 'Database already seeded' };
  }

  const galleryItems = [
    {
      id: crypto.randomUUID(),
      title: "Vegetable Seeds Collection",
      description: "Premium quality vegetable seeds suited for Namibia's climate",
      image_url: "https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg",
      category: "products",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Irrigation System Installation",
      description: "Modern pivot irrigation system installed at a local farm",
      image_url: "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb",
      category: "projects",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Farmer Training Workshop",
      description: "Practical training session with local farmers",
      image_url: "https://images.unsplash.com/photo-1746014929708-fcb859fd3185",
      category: "training",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Corn Harvest Success",
      description: "Successful corn harvest from one of our partner farms",
      image_url: "https://images.pexels.com/photos/3307282/pexels-photo-3307282.jpeg",
      category: "success-stories",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Soil Analysis Service",
      description: "Our team conducting comprehensive soil analysis",
      image_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
      category: "services",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Farm Consultancy Visit",
      description: "Expert consultation at a local agricultural project",
      image_url: "https://images.unsplash.com/photo-1744726010540-bf318d4a691f",
      category: "services",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Green Fields of Namibia",
      description: "Beautiful farmland showing sustainable agricultural practices",
      image_url: "https://images.unsplash.com/photo-1741874299706-2b8e16839aaa",
      category: "farms",
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Sprinkler Irrigation",
      description: "Efficient water management with modern sprinkler systems",
      image_url: "https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c",
      category: "projects",
      created_at: new Date().toISOString(),
      is_active: true
    }
  ];

  const events = [
    {
      id: crypto.randomUUID(),
      title: "Farmer Training Workshop 2025",
      description: "Join us for an intensive 2-day workshop on modern farming techniques, soil management, and sustainable agriculture practices.",
      date: "2025-09-15",
      time: "09:00 AM - 4:00 PM",
      location: "Windhoek Agricultural Center, Namibia",
      image_url: "https://images.unsplash.com/photo-1746014929708-fcb859fd3185",
      category: "workshop",
      is_featured: true,
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Irrigation Solutions Seminar",
      description: "Learn about the latest irrigation technologies and water conservation methods suitable for Namibia's climate.",
      date: "2025-10-05",
      time: "10:00 AM - 2:00 PM",
      location: "Bloom Agriculture Office, Windhoek",
      image_url: "https://images.unsplash.com/photo-1689349483530-bb7a0734d9fb",
      category: "seminar",
      is_featured: true,
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Agricultural Products Exhibition",
      description: "Explore our complete range of seeds, fertilizers, and farming equipment.",
      date: "2025-11-20",
      time: "08:00 AM - 5:00 PM",
      location: "Namibia Trade Fair Grounds",
      image_url: "https://images.pexels.com/photos/3401479/pexels-photo-3401479.jpeg",
      category: "exhibition",
      is_featured: false,
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: "Soil Health Assessment Day",
      description: "Free soil testing and analysis for registered farmers.",
      date: "2025-08-28",
      time: "07:00 AM - 12:00 PM",
      location: "Various locations across Namibia",
      image_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
      category: "workshop",
      is_featured: false,
      created_at: new Date().toISOString(),
      is_active: true
    }
  ];

  await supabase.from('gallery').insert(galleryItems);
  await supabase.from('events').insert(events);

  return { message: 'Database seeded successfully', gallery_items: galleryItems.length, events: events.length };
};
