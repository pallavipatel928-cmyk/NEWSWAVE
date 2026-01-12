import Parser from 'rss-parser';

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
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

// Storage for submitted news
let submittedNews = [];

export default async function handler(req, res) {
  try {
    const primaryFeeds = [
      "https://www.greatandhra.com/rss.xml",
      "https://www.sakshi.com/rss/latest.xml",
      "https://www.eenadu.net/rss/home",
      "https://telugu.oneindia.com/feed/latest.xml",
      "https://telugu.vaartha.com/feed.xml",
      "https://www.telugu360.com/feed/"
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
        const items = feed.items.slice(0, 80).map(i => {
          // Try multiple methods to get image URL
          let imageUrl = i.enclosure?.url || extractImageUrl(i['content:encoded'] || i.content || i.description || i.contentSnippet || '');
          
          // If no image found, try parsing content:encoded for media content
          if (!imageUrl && i['content:encoded']) {
            const mediaRegex = /<media:thumbnail url=["']([^"']*)["']|<img[^>]+src=["']([^"']*)["']/i;
            const mediaMatch = i['content:encoded'].match(mediaRegex);
            if (mediaMatch) {
              imageUrl = mediaMatch[1] || mediaMatch[2];
            }
          }
          
          // If still no image, try parsing description
          if (!imageUrl && i.description) {
            const descImgRegex = /<img[^>]+src=["']([^"']*)["']/i;
            const descMatch = i.description.match(descImgRegex);
            if (descMatch) {
              imageUrl = descMatch[1];
            }
          }
          
          // If no image found, try to generate from title or use category-specific placeholder
          if (!imageUrl) {
            if (i.title.toLowerCase().includes('politics')) imageUrl = 'https://placehold.co/400x250?text=Politics+News';
            else if (i.title.toLowerCase().includes('sports')) imageUrl = 'https://placehold.co/400x250?text=Sports+News';
            else if (i.title.toLowerCase().includes('business')) imageUrl = 'https://placehold.co/400x250?text=Business+News';
            else if (i.title.toLowerCase().includes('technology')) imageUrl = 'https://placehold.co/400x250?text=Tech+News';
            else if (i.title.toLowerCase().includes('entertainment')) imageUrl = 'https://placehold.co/400x250?text=Entertainment+News';
            else if (i.title.toLowerCase().includes('telugu') || i.title.toLowerCase().includes('hyderabad')) imageUrl = 'https://placehold.co/400x250?text=Telugu+News';
            else if (i.title.toLowerCase().includes('andhra') || i.title.toLowerCase().includes('amaravati')) imageUrl = 'https://placehold.co/400x250?text=Andhra+News';
            else imageUrl = 'https://placehold.co/400x250?text=Regional+News';
          }
          
          return {
            title: i.title,
            summary: i.contentSnippet || i['content:encoded'] || i.content || i.description || '', 
            link: i.link || i.guid,
            pubDate: i.pubDate || i.isoDate,
            source: feed.title || 'Unknown Source',
            image_url: ensureSecureUrl(imageUrl)
          };
        });
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
          const items = feed.items.slice(0, 50).map(i => {
            // Try multiple methods to get image URL
            let imageUrl = i.enclosure?.url || extractImageUrl(i['content:encoded'] || i.content || i.description || i.contentSnippet || '');
            
            // If no image found, try parsing content:encoded for media content
            if (!imageUrl && i['content:encoded']) {
              const mediaRegex = /<media:thumbnail url=["']([^"']*)["']|<img[^>]+src=["']([^"']*)["']/i;
              const mediaMatch = i['content:encoded'].match(mediaRegex);
              if (mediaMatch) {
                imageUrl = mediaMatch[1] || mediaMatch[2];
              }
            }
            
            // If still no image, try parsing description
            if (!imageUrl && i.description) {
              const descImgRegex = /<img[^>]+src=["']([^"']*)["']/i;
              const descMatch = i.description.match(descImgRegex);
              if (descMatch) {
                imageUrl = descMatch[1];
              }
            }
            
            return {
              title: i.title,
              summary: i.contentSnippet || i['content:encoded'] || i.content || i.description || '',
              link: i.link || i.guid,
              pubDate: i.pubDate || i.isoDate,
              source: feed.title || 'Unknown Source',
              image_url: ensureSecureUrl(imageUrl || 'https://placehold.co/400x250?text=Telugu+News+Image')
            };
          });
          articles = articles.concat(items);
        } catch (e) {
          console.warn("Fallback failed:", url);
        }
      }
    }

    // Filter for Telugu/Andhra related content
    const teluguArticles = articles.filter(article => 
      article.title.toLowerCase().includes('telugu') || 
      article.title.toLowerCase().includes('andhra') || 
      article.title.toLowerCase().includes('hyderabad') || 
      article.title.toLowerCase().includes('amaravati') ||
      article.title.toLowerCase().includes('vijayawada') ||
      article.title.toLowerCase().includes('visakhapatnam') ||
      article.title.toLowerCase().includes('guntur') ||
      article.title.toLowerCase().includes('nellore') ||
      article.summary.toLowerCase().includes('telugu') ||
      article.summary.toLowerCase().includes('andhra') ||
      article.summary.toLowerCase().includes('hyderabad') ||
      article.summary.toLowerCase().includes('amaravati')
    );

    // Combine submitted news with RSS news
    const allNews = [...submittedNews, ...teluguArticles].sort((a, b) => 
      new Date(b.pubDate || b.createdAt) - new Date(a.pubDate || a.createdAt)
    );

    // Limit to 50 most recent articles
    const recentNews = allNews.slice(0, 50);

    res.json(recentNews);
  } catch (error) {
    console.error("Error in Telugu API:", error);
    res.status(500).json({ 
      error: "Failed to fetch Telugu news",
      fallback: [
        {title: "తాజా వార్తలు 1", summary: "తెలుగు వార్తల నవీకరణలు", link: "#", pubDate: new Date().toISOString(), source: "తెలుగు వార్తా సేవ", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"},
        {title: "తాజా వార్తలు 2", summary: "మరిన్ని తెలుగు వార్తలు", link: "#", pubDate: new Date().toISOString(), source: "తెలుగు వార్తా సేవ", image_url: "https://placehold.co/300x200?text=తెలుగు+వార్త"}
      ]
    });
  }
}

// API endpoint for submitting news
export async function submitNews(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, category, author, summary, content, imageUrl } = req.body;

  if (!title || !category || !author || !summary || !content) {
    return res.status(400).json({ 
      message: 'Missing required fields: title, category, author, summary, content' 
    });
  }

  const newNews = {
    id: Date.now().toString(),
    title,
    category,
    author,
    summary,
    content,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString()
  };

  submittedNews.push(newNews);

  res.status(201).json({ 
    message: 'News submitted successfully', 
    news: newNews 
  });
}