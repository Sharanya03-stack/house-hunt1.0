import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const properties = [
  {
    id: 1,
    title: 'Luxurious 3BHK Villa with Pool',
    description: 'Premium villa with private pool, landscaped garden, and smart home features.',
    price: 85000,
    price_period: 'month',
    city: 'Bangalore',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    property_type: 'villa',
    listing_type: 'rent',
    avg_rating: 4.8,
    review_count: 24,
    is_featured: true,
    property_images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', is_primary: true }],
    users: { name: 'Rajesh Kumar', avatar_url: null },
  },
  {
    id: 2,
    title: 'Modern 2BHK in Tech Hub',
    description: 'Bright apartment close to IT parks, metro, and cafes.',
    price: 32000,
    price_period: 'month',
    city: 'Hyderabad',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    property_type: 'apartment',
    listing_type: 'rent',
    avg_rating: 4.6,
    review_count: 18,
    is_featured: true,
    property_images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', is_primary: true }],
    users: { name: 'Priya Singh', avatar_url: null },
  },
  {
    id: 3,
    title: 'Premium Studio, Bandra West',
    description: 'Stylish studio with premium interiors and excellent connectivity.',
    price: 22000,
    price_period: 'month',
    city: 'Mumbai',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    property_type: 'studio',
    listing_type: 'rent',
    avg_rating: 4.9,
    review_count: 31,
    is_featured: true,
    property_images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600', is_primary: true }],
    users: { name: 'Amit Patel', avatar_url: null },
  },
  {
    id: 4,
    title: 'Spacious 4BHK Independent House',
    description: 'Luxury independent home with large living areas and terrace.',
    price: 12000000,
    price_period: 'total',
    city: 'Pune',
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    property_type: 'house',
    listing_type: 'buy',
    avg_rating: 4.7,
    review_count: 12,
    is_featured: true,
    property_images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', is_primary: true }],
    users: { name: 'Meera Joshi', avatar_url: null },
  },
  {
    id: 5,
    title: 'Bright 2BHK in Koramangala',
    description: 'Sunny apartment with modern kitchen and balcony in a prime neighborhood.',
    price: 48000,
    price_period: 'month',
    city: 'Bangalore',
    bedrooms: 2,
    bathrooms: 2,
    area: 1150,
    property_type: 'apartment',
    listing_type: 'rent',
    avg_rating: 4.5,
    review_count: 16,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600', is_primary: true }],
    users: { name: 'Suresh Menon', avatar_url: null },
  },
  {
    id: 6,
    title: 'Beachfront Villa on ECR',
    description: 'Spacious villa with sea views and landscaped terrace for relaxing evenings.',
    price: 76000,
    price_period: 'month',
    city: 'Chennai',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    property_type: 'villa',
    listing_type: 'rent',
    avg_rating: 4.9,
    review_count: 8,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', is_primary: true }],
    users: { name: 'Deepa Nair', avatar_url: null },
  },
  {
    id: 7,
    title: 'Furnished 1BHK Near Metro',
    description: 'Compact and stylish home with premium finish and easy commute.',
    price: 18000,
    price_period: 'month',
    city: 'Delhi',
    bedrooms: 1,
    bathrooms: 1,
    area: 700,
    property_type: 'apartment',
    listing_type: 'rent',
    avg_rating: 4.3,
    review_count: 9,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600', is_primary: true }],
    users: { name: 'Ankit Sharma', avatar_url: null },
  },
  {
    id: 8,
    title: 'Premium Office Space in MG Road',
    description: 'Flexible commercial property in a thriving business zone.',
    price: 95000,
    price_period: 'month',
    city: 'Bangalore',
    bedrooms: 0,
    bathrooms: 2,
    area: 3000,
    property_type: 'commercial',
    listing_type: 'rent',
    avg_rating: 4.4,
    review_count: 5,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', is_primary: true }],
    users: { name: 'Vikram Reddy', avatar_url: null },
  },
  {
    id: 9,
    title: 'Gated 3BHK in Gachibowli',
    description: 'Well-appointed apartment with clubhouse access and parking.',
    price: 55000,
    price_period: 'month',
    city: 'Hyderabad',
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    property_type: 'apartment',
    listing_type: 'rent',
    avg_rating: 4.7,
    review_count: 15,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600', is_primary: true }],
    users: { name: 'Kavitha Rao', avatar_url: null },
  },
  {
    id: 10,
    title: 'Budget Studio in Hinjewadi',
    description: 'Affordable studio for young professionals near the IT park.',
    price: 12000,
    price_period: 'month',
    city: 'Pune',
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    property_type: 'studio',
    listing_type: 'rent',
    avg_rating: 4.1,
    review_count: 20,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600', is_primary: true }],
    users: { name: 'Rohit Gupta', avatar_url: null },
  },
  {
    id: 11,
    title: 'Luxury Penthouse with Terrace',
    description: 'High-end penthouse with skyline views and modern interiors.',
    price: 150000,
    price_period: 'month',
    city: 'Mumbai',
    bedrooms: 4,
    bathrooms: 4,
    area: 4500,
    property_type: 'apartment',
    listing_type: 'rent',
    avg_rating: 5.0,
    review_count: 6,
    is_featured: true,
    property_images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', is_primary: true }],
    users: { name: 'Nisha Kapoor', avatar_url: null },
  },
  {
    id: 12,
    title: 'Plot in Growing Township',
    description: 'Investment-friendly plot in a rapidly developing neighborhood.',
    price: 4500000,
    price_period: 'total',
    city: 'Bangalore',
    bedrooms: 0,
    bathrooms: 0,
    area: 1200,
    property_type: 'plot',
    listing_type: 'buy',
    avg_rating: 4.2,
    review_count: 3,
    is_featured: false,
    property_images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', is_primary: true }],
    users: { name: 'Sanjay Nair', avatar_url: null },
  },
];

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'HouseHunt backend is running' });
});

app.get('/api/properties/featured', (_req, res) => {
  res.json({
    success: true,
    data: {
      properties: properties.slice(0, 3),
    },
  });
});

app.get('/api/properties', (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    success: true,
    data: {
      properties: properties.slice(start, end),
      pagination: {
        total: properties.length,
        page,
        limit,
        totalPages: Math.ceil(properties.length / limit),
      },
    },
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find((item) => item.id === Number(req.params.id));
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  return res.json({ success: true, data: { property } });
});

app.get('/api/auth/me', (_req, res) => {
  res.status(401).json({ success: false, message: 'Not authenticated' });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};
  res.json({
    success: true,
    data: {
      user: { id: 1, name: 'Demo User', email: email || 'demo@example.com', role: 'seeker' },
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email } = req.body || {};
  res.json({
    success: true,
    data: {
      user: { id: 1, name: 'Demo User', email: email || 'demo@example.com', role: 'seeker' },
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    },
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HouseHunt backend listening on http://localhost:${PORT}`);
});
