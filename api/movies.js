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
        if (i.title.toLowerCase().includes('film') || i.title.toLowerCase().includes('movie')) image_url = 'https://placehold.co/400x250?text=Movie+News';
        else if (i.title.toLowerCase().includes('award') || i.title.toLowerCase().includes('oscar')) image_url = 'https://placehold.co/400x250?text=Award+News';
        else if (i.title.toLowerCase().includes('actor') || i.title.toLowerCase().includes('actress')) image_url = 'https://placehold.co/400x250?text=Actor+News';
        else if (i.title.toLowerCase().includes('hollywood') || i.title.toLowerCase().includes('bollywood')) image_url = 'https://placehold.co/400x250?text=Film+Industry+News';
        else if (i.title.toLowerCase().includes('box office') || i.title.toLowerCase().includes('release')) image_url = 'https://placehold.co/400x250?text=Box+Office+News';
        else image_url = 'https://placehold.co/400x250?text=Entertainment+News';
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
        title: "Entertainment: Blockbuster Movie Reaches Milestone",
        summary: "The latest release achieves record-breaking box office numbers in its opening week.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Entertainment Today",
        image_url: "https://placehold.co/600x400?text=Movies+News"
      },
      {
        title: "Film Awards: Nominations Announced",
        summary: "Prestigious film awards announce nominees for this year's ceremony.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Awards Watch",
        image_url: "https://placehold.co/600x400?text=Awards+News"
      },
      {
        title: "Hollywood: New Production Announced",
        summary: "Major studio announces production of highly anticipated sequel series.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Production Report",
        image_url: "https://placehold.co/600x400?text=Production+News"
      },
      {
        title: "Actors: Award Winner Joins New Project",
        summary: "Acclaimed actor signs on for upcoming director's ambitious project.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Actor Watch",
        image_url: "https://placehold.co/600x400?text=Actor+News"
      },
      {
        title: "Streaming: Platform Adds New Content",
        summary: "Popular streaming service announces addition of exclusive content library.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Streaming Times",
        image_url: "https://placehold.co/600x400?text=Streaming+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}

export default async function handler(req, res) {
  try {
    await loadCategory(res, "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms", 20); // Movies Times of India feed
  } catch (err) {
    console.log("Movies API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Entertainment: Blockbuster Movie Reaches Milestone",
        summary: "The latest release achieves record-breaking box office numbers in its opening week.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Entertainment Today",
        image_url: "https://placehold.co/600x400?text=Movies+News"
      },
      {
        title: "Film Awards: Nominations Announced",
        summary: "Prestigious film awards announce nominees for this year's ceremony.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Awards Watch",
        image_url: "https://placehold.co/600x400?text=Awards+News"
      },
      {
        title: "Hollywood: New Production Announced",
        summary: "Major studio announces production of highly anticipated sequel series.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Production Report",
        image_url: "https://placehold.co/600x400?text=Production+News"
      },
      {
        title: "Actors: Award Winner Joins New Project",
        summary: "Acclaimed actor signs on for upcoming director's ambitious project.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Actor Watch",
        image_url: "https://placehold.co/600x400?text=Actor+News"
      },
      {
        title: "Streaming: Platform Adds New Content",
        summary: "Popular streaming service announces addition of exclusive content library.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Streaming Times",
        image_url: "https://placehold.co/600x400?text=Streaming+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}