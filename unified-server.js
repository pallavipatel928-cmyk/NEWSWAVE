// ================================
// UNIFIED NEWSWAVE SERVER
// Serves both frontend and backend in one file
// ================================

// Ignore expired SSL certificates (fixes CERT_HAS_EXPIRED)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cors from "cors";
import Parser from "rss-parser";
import path from "path";
import { fileURLToPath } from "url";
import langService from "./lang-service.js";

// Set up server configuration for network compatibility
const NETWORK_CONFIG = {
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:5173', // Vite default
    'http://127.0.0.1:5173',
    'https://*.vercel.app', // Vercel deployments
    'https://newswave-*.vercel.app'
  ],
  MAX_AGE: 86400, // 24 hours
  CREDENTIALS: true
};

// Get current directory for static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage for submitted news
let submittedNews = [];

const app = express();

// Enable CORS and JSON parsing
app.use(express.json());

// Configure CORS with specific origins for network compatibility
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (NETWORK_CONFIG.ALLOWED_ORIGINS.some(allowed => {
      if (allowed.includes('*')) {
        // Handle wildcard domains like 'https://*.vercel.app'
        const parts = allowed.split('*');
        const regex = new RegExp('^' + parts[0].replace(/\./g, '\.') + '.*' + parts[1].replace(/\./g, '\.') + '$');
        return regex.test(origin);
      }
      return origin === allowed;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: NETWORK_CONFIG.CREDENTIALS,
  optionsSuccessStatus: 200,
  maxAge: NETWORK_CONFIG.MAX_AGE,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Additional CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});



const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "application/rss+xml,application/xml"
  }
});

// Endpoint to submit news
app.post("/api/submit-news", express.json(), (req, res) => {
  try {
    const newsItem = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      category: req.body.category,
      author: req.body.author,
      image_url: req.body.imageUrl || null,
      link: `#/article/${encodeURIComponent(req.body.title.substring(0, 50))}`,
      pubDate: new Date().toISOString(),
      source: req.body.author || "Submitted News"
    };
    
    // Add to submitted news array
    submittedNews.unshift(newsItem);
    
    // Keep only the latest 50 submitted news
    if (submittedNews.length > 50) {
      submittedNews = submittedNews.slice(0, 50);
    }
    
    res.json({ success: true, message: "News submitted successfully" });
  } catch (error) {
    console.error("Error submitting news:", error);
    res.status(500).json({ success: false, message: "Failed to submit news" });
  }
});

// Helper function to extract image URL from content
function extractImageUrl(content) {
  if (!content) return null;
  
  // Look for image URLs in the content
  const imgRegex = /<img[^>]+src=["']([^"']*)["']/i;
  const match = content.match(imgRegex);
  
  if (match) {
    const imageUrl = match[1];
    // Ensure HTTPS for secure content
    return imageUrl.startsWith('http://') ? imageUrl.replace(/^http:\/\//, 'https://') : imageUrl;
  }
  
  // Look for common image URLs in text
  const urlRegex = /(https?:\/\/[^\s]*?\.(?:jpg|jpeg|png|gif|webp))(?:[\?\s]|$)/i;
  const urlMatch = content.match(urlRegex);
  
  const extractedUrl = urlMatch ? urlMatch[1] : null;
  // Ensure HTTPS for secure content
  return extractedUrl && extractedUrl.startsWith('http://') ? extractedUrl.replace(/^http:\/\//, 'https://') : extractedUrl;
}

// Helper function to ensure secure URLs
function ensureSecureUrl(url) {
  if (!url) return url;
  
  // Convert HTTP to HTTPS to avoid mixed content issues
  if (typeof url === 'string' && url.startsWith('http://')) {
    return url.replace(/^http:\/\//, 'https://');
  }
  return url;
}

// Helper function to filter news by category
function filterByCategory(articles, category) {
  switch(category.toLowerCase()) {
    case 'telangana state':
      return articles.filter(item => 
        item.category === 'Telangana State' ||
        item.title.toLowerCase().includes('telangana') || 
        item.title.toLowerCase().includes('hyderabad') || 
        item.title.toLowerCase().includes('seunderabad') ||
        item.title.toLowerCase().includes('warangal') ||
        item.summary.toLowerCase().includes('telangana') ||
        item.summary.toLowerCase().includes('hyderabad') ||
        item.summary.toLowerCase().includes('seunderabad') ||
        item.summary.toLowerCase().includes('warangal')
      );
    case 'andhra pradesh':
      return articles.filter(item => 
        item.category === 'Andhra Pradesh' ||
        item.title.toLowerCase().includes('andhra') || 
        item.title.toLowerCase().includes('amaravati') || 
        item.title.toLowerCase().includes('vijayawada') ||
        item.title.toLowerCase().includes('visakhapatnam') ||
        item.summary.toLowerCase().includes('andhra') ||
        item.summary.toLowerCase().includes('amaravati') ||
        item.summary.toLowerCase().includes('vijayawada') ||
        item.summary.toLowerCase().includes('visakhapatnam')
      );
    default:
      return articles.filter(item => item.category === category);
  }
}

// Test route to see if API routes are working
app.get('/test', (req, res) => {
  res.json({message: "Test API is working"});
});

// =======================================
// 1️⃣ LATEST NEWS — 200+ articles
// =======================================
app.get("/api/news", async (req, res) => {
  try {
    const primaryFeeds = [
      "https://www.greatandhra.com/rss.xml",
      "https://www.sakshi.com/rss/latest.xml",
      "https://www.eenadu.net/rss/home",
      "https://www.thehindu.com/feeder/default.rss",
      "https://www.deccanchronicle.com/rss_feed"
    ];

    const fallbackFeeds = [
      "https://news.google.com/rss?hl=te-IN&gl=IN&ceid=IN:te",
      "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
      "https://feeds.bbci.co.uk/news/world/rss.xml"
    ];

    let articles = [];

    // Fetch primary feeds
    for (const url of primaryFeeds) {
      try {
        const feed = await parser.parseURL(url);
        const items = feed.items.slice(0, 80).map(i => ({
          title: i.title,
          summary: i.contentSnippet || "",
          link: i.link,
          pubDate: i.pubDate,
          source: feed.title,
          image_url: ensureSecureUrl(i.enclosure?.url || extractImageUrl(i['content:encoded'] || i.description || i.content || i.contentSnippet || ''))
        }));
        articles = articles.concat(items);
      } catch (e) {
        console.warn("Primary feed failed:", url);
      }
    }

    // If too few articles → fallback feeds
    if (articles.length < 50) {
      for (const url of fallbackFeeds) {
        try {
          const feed = await parser.parseURL(url);
          const items = feed.items.slice(0, 50).map(i => ({
            title: i.title,
            summary: i.contentSnippet || "",
            link: i.link,
            pubDate: i.pubDate,
            source: feed.title,
            image_url: ensureSecureUrl(i.enclosure?.url || extractImageUrl(i['content:encoded'] || i.description || i.content || i.contentSnippet || ''))
          }));
          articles = articles.concat(items);
        } catch (e) {
          console.warn("Fallback failed:", url);
        }
      }
    }
    
    // Add submitted news to the articles array
    articles = articles.concat(submittedNews);
  
    // Remove duplicates
    const seen = new Set();
    const unique = articles.filter(a => !seen.has(a.title) && seen.add(a.title));
  
    // Sort newest first
    unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
    res.json(unique.slice(0, 200));  // Return 200+ items
  
  } catch (err) {
    console.error("LATEST ERROR:", err);
    res.status(500).json({ error: "Failed to load news" });
  }
});

// =======================================
// 2️⃣ ANDHRA / TELANGANA — 50 each
// =======================================
app.get("/api/andhra", async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/news`);
    const allNews = await response.json();
    
    // Filter for Andhra Pradesh news using our helper function
    const andhraNews = filterByCategory(allNews, 'Andhra Pradesh');
    
    // Return filtered Andhra news or first 10 if no specific Andhra news found
    const result = andhraNews.length > 0 ? andhraNews.slice(0, 20) : allNews.slice(0, 10);
    res.json(result);
  } catch (err) {
    console.log("Andhra API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Andhra Pradesh News Update 1", summary: "Latest news from Andhra Pradesh covering politics, development, and regional updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Andhra+News"},
      {title: "Andhra Pradesh News Update 2", summary: "More updates from the state with focus on infrastructure and economic growth", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Andhra+News"},
      {title: "Andhra Pradesh News Update 3", summary: "Regional developments and policy changes affecting the state", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Andhra+News"},
      {title: "Andhra Pradesh News Update 4", summary: "Local government initiatives and public welfare programs", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Andhra+News"},
      {title: "Andhra Pradesh News Update 5", summary: "Education and healthcare improvements in Andhra Pradesh", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Andhra+News"}
    ]);
  }
});

app.get("/api/telangana", async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/news`);
    const allNews = await response.json();
    
    // Filter for Telangana news using our helper function
    const telanganaNews = filterByCategory(allNews, 'Telangana State');
    
    // Return filtered Telangana news or first 10 if no specific Telangana news found
    const result = telanganaNews.length > 0 ? telanganaNews.slice(0, 20) : allNews.slice(0, 10);
    res.json(result);
  } catch (err) {
    console.log("Telangana API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Telangana News Update 1", summary: "Latest news from Telangana covering politics, development, and regional updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Telangana+News"},
      {title: "Telangana News Update 2", summary: "More updates from the state with focus on infrastructure and economic growth", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Telangana+News"},
      {title: "Telangana News Update 3", summary: "Regional developments and policy changes affecting the state", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Telangana+News"},
      {title: "Telangana News Update 4", summary: "Local government initiatives and public welfare programs", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Telangana+News"},
      {title: "Telangana News Update 5", summary: "Education and healthcare improvements in Telangana", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Telangana+News"}
    ]);
  }
});

// =======================================
// 3️⃣ Politics / Movies / Sports — 40 each
// =======================================
app.get("/api/politics", async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/news`);
    const allNews = await response.json();
    
    // Filter for political news
    const politicalNews = allNews.filter(item => 
      item.title.toLowerCase().includes('politic') || 
      item.title.toLowerCase().includes('government') || 
      item.title.toLowerCase().includes('election') || 
      item.title.toLowerCase().includes('minister') ||
      item.summary.toLowerCase().includes('politic') ||
      item.summary.toLowerCase().includes('government') ||
      item.summary.toLowerCase().includes('election') ||
      item.summary.toLowerCase().includes('minister')
    );
    
    // Return filtered political news or first 10 if no specific political news found
    const result = politicalNews.length > 0 ? politicalNews.slice(0, 20) : allNews.slice(0, 10);
    res.json(result);
  } catch (err) {
    console.log("Politics API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Political News Update 1", summary: "Latest political developments and government policy changes", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Politics+News"},
      {title: "Political News Update 2", summary: "Election updates and political party developments", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Politics+News"},
      {title: "Political News Update 3", summary: "Parliament and legislative assembly updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Politics+News"},
      {title: "Political News Update 4", summary: "National and state political developments", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Politics+News"},
      {title: "Political News Update 5", summary: "Political leader activities and public meetings", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Politics+News"}
    ]);
  }
});

app.get("/api/movies", async (req, res) => {
  try {
    await loadCategory(res, "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms", 20); // Movies Times of India feed
  } catch (err) {
    console.log("Movies API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Entertainment News Update 1", summary: "Latest movie industry news and film releases", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Movies+News"},
      {title: "Entertainment News Update 2", summary: "Celebrity updates and entertainment industry developments", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Movies+News"},
      {title: "Entertainment News Update 3", summary: "Bollywood and Tollywood film updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Movies+News"},
      {title: "Entertainment News Update 4", summary: "Box office collections and upcoming movie releases", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Movies+News"},
      {title: "Entertainment News Update 5", summary: "Award shows and entertainment event coverage", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Movies+News"}
    ]);
  }
});

app.get("/api/sports", async (req, res) => {
  try {
    await loadCategory(res, "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms", 20); // Sports Times of India feed
  } catch (err) {
    console.log("Sports API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Sports News Update 1", summary: "Latest sports news and updates from cricket, football, and other games", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Sports+News"},
      {title: "Sports News Update 2", summary: "Match results and player performance updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Sports+News"},
      {title: "Sports News Update 3", summary: "International and domestic tournament updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Sports+News"},
      {title: "Sports News Update 4", summary: "Olympics and major sporting events coverage", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Sports+News"},
      {title: "Sports News Update 5", summary: "Athlete achievements and sports development initiatives", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Sports+News"}
    ]);
  }
});

app.get("/api/business", async (req, res) => {
  try {
    await loadCategory(res, "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms", 20); // Business Times of India feed
  } catch (err) {
    console.log("Business API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Business News Update 1", summary: "Latest business and economy news covering market trends and investments", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Business+News"},
      {title: "Business News Update 2", summary: "Corporate developments and economic policies updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Business+News"},
      {title: "Business News Update 3", summary: "Stock market updates and financial sector news", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Business+News"},
      {title: "Business News Update 4", summary: "Industry growth and business opportunities", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Business+News"},
      {title: "Business News Update 5", summary: "Trade and commerce updates from national and international markets", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Business+News"}
    ]);
  }
});

app.get("/api/tech", async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/news`);
    const allNews = await response.json();
    
    // Filter for tech news
    const techNews = allNews.filter(item => 
      item.title.toLowerCase().includes('tech') || 
      item.title.toLowerCase().includes('technology') || 
      item.title.toLowerCase().includes('digital') || 
      item.title.toLowerCase().includes('software') ||
      item.title.toLowerCase().includes('ai') ||
      item.title.toLowerCase().includes('gadget') ||
      item.title.toLowerCase().includes('internet') ||
      item.summary.toLowerCase().includes('tech') ||
      item.summary.toLowerCase().includes('technology') ||
      item.summary.toLowerCase().includes('digital') ||
      item.summary.toLowerCase().includes('software') ||
      item.summary.toLowerCase().includes('ai') ||
      item.summary.toLowerCase().includes('gadget') ||
      item.summary.toLowerCase().includes('internet')
    );
    
    // Return filtered tech news or first 10 if no specific tech news found
    const result = techNews.length > 0 ? techNews.slice(0, 20) : allNews.slice(0, 10);
    res.json(result);
  } catch (err) {
    console.log("Tech API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "Technology News Update 1", summary: "Latest technology and innovation news covering AI, gadgets, and digital trends", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Tech+News"},
      {title: "Technology News Update 2", summary: "Software updates and tech industry developments", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Tech+News"},
      {title: "Technology News Update 3", summary: "Gadget launches and product reviews", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Tech+News"},
      {title: "Technology News Update 4", summary: "Cybersecurity updates and digital privacy news", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Tech+News"},
      {title: "Technology News Update 5", summary: "Startups and innovation ecosystem developments", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=Tech+News"}
    ]);
  }
});

// API route for Telugu news
app.get("/api/telugu", async (req, res) => {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/news`);
    const allNews = await response.json();
    
    // Filter for Telugu/Andhra related news
    const teluguNews = allNews.filter(item => 
      item.title.toLowerCase().includes('telugu') || 
      item.title.toLowerCase().includes('andhra') || 
      item.title.toLowerCase().includes('hyderabad') || 
      item.title.toLowerCase().includes('amaravati') ||
      item.title.toLowerCase().includes('vijayawada') ||
      item.title.toLowerCase().includes('visakhapatnam') ||
      item.title.toLowerCase().includes('guntur') ||
      item.title.toLowerCase().includes('nellore') ||
      item.title.toLowerCase().includes('telangana') ||
      item.summary.toLowerCase().includes('telugu') ||
      item.summary.toLowerCase().includes('andhra') ||
      item.summary.toLowerCase().includes('hyderabad') ||
      item.summary.toLowerCase().includes('amaravati') ||
      item.summary.toLowerCase().includes('telangana')
    );
    
    // Enhance image URLs for filtered news
    const enhancedTeluguNews = teluguNews.map(item => ({
      ...item,
      image_url: item.image_url || 'https://placehold.co/400x250?text=Regional+News'
    }));
    
    // Return filtered Telugu news or first 10 if no specific Telugu news found
    const result = teluguNews.length > 0 ? teluguNews.slice(0, 20) : allNews.slice(0, 10);
    res.json(result);
  } catch (err) {
    console.log("Telugu API error:", err);
    // Send fallback static data if RSS feed fails
    res.json([
      {title: "తెలుగు వార్తలు 1", summary: "తెలుగు వార్తల నవీకరణలు", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"},
      {title: "తెలుగు వార్తలు 2", summary: "మరిన్ని తెలుగు వార్తలు", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"},
      {title: "తెలుగు వార్తలు 3", summary: "ఆంధ్ర ప్రదేశ్ నుండి తాజా వార్తలు", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"},
      {title: "తెలుగు వార్తలు 4", summary: "తెలుగు జాతీయ వార్తలు", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"},
      {title: "తెలుగు వార్తలు 5", summary: "హైదరాబాద్ నుండి తాజా వార్తలు", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"}
    ]);
  }
});

// Helper
async function loadCategory(res, feedUrl, limit) {
  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.slice(0, limit).map(i => ({
      title: i.title,
      summary: i.contentSnippet || "",
      link: i.link,
      pubDate: i.pubDate,
      source: feed.title,
      image_url: ensureSecureUrl(i.enclosure?.url || extractImageUrl(i['content:encoded'] || i.description || i.content || i.contentSnippet || ''))
    }));
    res.json(items);
  } catch (err) {
    console.log("RSS Feed error for URL:", feedUrl, err.message);
    // Return fallback data when RSS feed fails
    res.json([
      {title: "News Update 1", summary: "Latest news updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=News+Image"},
      {title: "News Update 2", summary: "More news updates", link: "#", pubDate: new Date().toISOString(), source: "News Service", image_url: "https://placehold.co/300x200?text=News+Image"}
    ]);
  }
}

// =======================================
// LANGUAGES API
// =======================================
app.get("/api/languages", (req, res) => {
  res.json(langService.getSupportedLanguages());
});

app.get("/api/translations/:lang", (req, res) => {
  const { lang } = req.params;
  if (langService.isSupportedLanguage(lang)) {
    res.json(langService.getLanguageTranslations(lang));
  } else {
    res.status(404).json({ error: "Language not supported" });
  }
});

app.get("/api/translation/:lang/:key", (req, res) => {
  const { lang, key } = req.params;
  if (langService.isSupportedLanguage(lang)) {
    const translation = langService.getTranslation(lang, key);
    res.json({ translation });
  } else {
    res.status(404).json({ error: "Language not supported" });
  }
});

// =======================================
// 4️⃣ VIDEO SECTION — YouTube embeds
// =======================================
app.get("/api/videos", (req, res) => {
  res.json([
    { title: "TV9 Telugu", url: "https://www.youtube.com/embed/X9RANzv6VnE" },
    { title: "ABN Andhra Jyothi", url: "https://www.youtube.com/embed/4vG2C8YQyX8" },
    { title: "NTV Telugu", url: "https://www.youtube.com/embed/wxgfbo9CG2A" },
    { title: "Sakshi TV", url: "https://www.youtube.com/embed/oIxC4NokhT8" },
    { title: "T News", url: "https://www.youtube.com/embed/JU-0m8b9z3A" }
  ]);
});

// =======================================
// 5️⃣ SECURE PROXY (handles CORS for external requests)
// =======================================
app.get("/proxy/hls", async (req, res) => {
  const target = req.query.url;
  
  // Security validation
  if (!target) return res.status(400).send("Missing URL");
  
  // Only allow trusted domains
  const allowedDomains = ['youtube.com', 'googlevideo.com', 'ytimg.com'];
  const urlObj = new URL(target);
  if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
    return res.status(403).send("Domain not allowed");
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsWave Proxy)',
        'Referer': req.get('Referer') || '',
        'Origin': req.get('Origin') || ''
      }
    });
    
    if (!upstream.ok) {
      return res.status(upstream.status).send("Upstream request failed");
    }
    
    const data = await upstream.arrayBuffer();
    
    // Only forward safe headers
    const safeHeaders = ['content-type', 'content-length', 'last-modified', 'etag'];
    safeHeaders.forEach(header => {
      const value = upstream.headers.get(header);
      if (value) res.setHeader(header, value);
    });
    
    res.send(Buffer.from(data));
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(502).send("Failed to load resource");
  }
});

// Root check - must be after API routes to avoid intercepting them
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve static files from the root directory (after API routes to avoid conflicts)
app.use(express.static(path.join(__dirname))); // Serves all HTML, CSS, JS, images

// Serve other HTML pages if requested - must be after API and static routes
// Only match if the page doesn't contain file extensions (like .css, .js, .png, etc.)
app.get('/:page', (req, res) => {
  const page = req.params.page;
  
  // Don't match if the page contains common static file extensions
  if (page.includes('.') && !page.endsWith('.html')) {
    // If it contains other file extensions, let static middleware handle it
    res.status(404).send('File not found');
    return;
  }
  
  if (page.endsWith('.html')) {
    res.sendFile(path.join(__dirname, page));
  } else {
    // For other pages, try to serve the corresponding HTML file
    res.sendFile(path.join(__dirname, `${page}.html`));
  }
});



// ===============================
const PORT = 3000;
console.log(`🚀 NewsWave unified server starting on http://localhost:${PORT}`);
console.log(`📁 Serving files from: ${__dirname}`);
console.log(`📰 Access the frontend at: http://localhost:${PORT}`);
console.log(`📡 API available at: http://localhost:${PORT}/api/news`);
app.listen(PORT, () => console.log(`✅ NewsWave unified server running on http://localhost:${PORT}`));