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
  
  // Look for media:thumbnail in content (common in RSS feeds)
  const mediaRegex = /<media:thumbnail url=["']([^"']*)["']|<img[^>]+src=["']([^"']*)["']/i;
  const mediaMatch = content.match(mediaRegex);
  if (mediaMatch) {
    const imageUrl = mediaMatch[1] || mediaMatch[2];
    if (imageUrl) {
      // Ensure HTTPS for secure content
      return imageUrl.startsWith('http://') ? imageUrl.replace(/^http:\/\//, 'https://') : imageUrl;
    }
  }
  
  // Look for common image URLs in text
  const urlRegex = /(https?:\/\/[^\s]*?\.(?:jpg|jpeg|png|gif|webp))(?:[\?\s]|$)/i;
  const urlMatch = content.match(urlRegex);
  
  const extractedUrl = urlMatch ? urlMatch[1] : null;
  // Ensure HTTPS for secure content
  return extractedUrl && extractedUrl.startsWith('http://') ? extractedUrl.replace(/^http:\/\//, 'https://') : extractedUrl;
}

async function loadCategory(res, feedUrl, limit) {
  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.slice(0, limit).map(i => {
      // Extract image with multiple fallback methods
      let image_url = i.enclosure?.url || extractImageUrl(i.contentSnippet || i.content || i.description || '');
      
      // If no image found, try to generate from title or use category-specific placeholder
      if (!image_url) {
        if (i.title.toLowerCase().includes('cricket') || i.title.toLowerCase().includes('odi')) image_url = 'https://placehold.co/400x250?text=Cricket+News';
        else if (i.title.toLowerCase().includes('football') || i.title.toLowerCase().includes('soccer')) image_url = 'https://placehold.co/400x250?text=Football+News';
        else if (i.title.toLowerCase().includes('tennis') || i.title.toLowerCase().includes('grand slam')) image_url = 'https://placehold.co/400x250?text=Tennis+News';
        else if (i.title.toLowerCase().includes('championship') || i.title.toLowerCase().includes('finals')) image_url = 'https://placehold.co/400x250?text=Championship+News';
        else if (i.title.toLowerCase().includes('olympics') || i.title.toLowerCase().includes('olympic')) image_url = 'https://placehold.co/400x250?text=Olympics+News';
        else image_url = 'https://placehold.co/400x250?text=Sports+News';
      }
      
      return {
        title: i.title,
        summary: i.contentSnippet || i.content || i.description || '',
        link: i.link,
        pubDate: i.pubDate,
        source: feed.title,
        image_url: image_url
      };
    });
    res.status(200).json(items);
  } catch (err) {
    console.log("RSS Feed error for URL:", feedUrl, err.message);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Sports: Championship Finals Break Viewership Records",
        summary: "The championship finals break viewership records as teams compete in an exciting match.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Sports Network",
        image_url: "https://placehold.co/600x400?text=Sports+News"
      },
      {
        title: "Football: Transfer Window Updates",
        summary: "Major football transfers announced as clubs prepare for the new season.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Football Weekly",
        image_url: "https://placehold.co/600x400?text=Football+News"
      },
      {
        title: "Cricket: International Series Begins",
        summary: "High-profile cricket series begins with world-class players competing.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Cricket Chronicle",
        image_url: "https://placehold.co/600x400?text=Cricket+News"
      },
      {
        title: "Tennis: Grand Slam Tournament Results",
        summary: "Grand slam tennis tournament concludes with surprising outcomes.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Tennis Today",
        image_url: "https://placehold.co/600x400?text=Tennis+News"
      },
      {
        title: "Olympics: Preparation Updates",
        summary: "Olympic committees share progress on preparations for upcoming games.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Olympic Report",
        image_url: "https://placehold.co/600x400?text=Olympics+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}

export default async function handler(req, res) {
  try {
    await loadCategory(res, "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms", 20); // Sports Times of India feed
  } catch (err) {
    console.log("Sports API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Sports: Championship Finals Break Viewership Records",
        summary: "The championship finals break viewership records as teams compete in an exciting match.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Sports Network",
        image_url: "https://placehold.co/600x400?text=Sports+News"
      },
      {
        title: "Football: Transfer Window Updates",
        summary: "Major football transfers announced as clubs prepare for the new season.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Football Weekly",
        image_url: "https://placehold.co/600x400?text=Football+News"
      },
      {
        title: "Cricket: International Series Begins",
        summary: "High-profile cricket series begins with world-class players competing.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Cricket Chronicle",
        image_url: "https://placehold.co/600x400?text=Cricket+News"
      },
      {
        title: "Tennis: Grand Slam Tournament Results",
        summary: "Grand slam tennis tournament concludes with surprising outcomes.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Tennis Today",
        image_url: "https://placehold.co/600x400?text=Tennis+News"
      },
      {
        title: "Olympics: Preparation Updates",
        summary: "Olympic committees share progress on preparations for upcoming games.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Olympic Report",
        image_url: "https://placehold.co/600x400?text=Olympics+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}