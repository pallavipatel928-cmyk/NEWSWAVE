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
  
  const extractedUrl = urlMatch ? urlMatch[1] : "https://placehold.co/600x400?text=Business+News";
  // Ensure HTTPS for secure content
  return extractedUrl.startsWith('http://') ? extractedUrl.replace(/^http:\/\//, 'https://') : extractedUrl;
}

async function loadCategory(res, feedUrl, limit) {
  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.slice(0, limit).map(i => ({
      title: i.title,
      summary: i.contentSnippet || i.content || i.description || "",
      link: i.link,
      pubDate: i.pubDate,
      source: feed.title,
      image_url: i.enclosure?.url || extractImageUrl(i.contentSnippet || i.content || i.description || "")
    }));
    res.status(200).json(items);
  } catch (err) {
    console.log("RSS Feed error for URL:", feedUrl, err.message);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Business: Market Trends Show Positive Growth",
        summary: "Financial analysts report positive growth trends across multiple sectors this quarter.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Business Times",
        image_url: "https://placehold.co/600x400?text=Business+News"
      },
      {
        title: "Stock Market: Index Reaches New Highs",
        summary: "Major stock indices reach record highs amid positive economic indicators.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Market Watch",
        image_url: "https://placehold.co/600x400?text=Stock+News"
      },
      {
        title: "Corporate: Major Merger Announced",
        summary: "Two industry leaders announce merger deal to strengthen market position.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Corporate Report",
        image_url: "https://placehold.co/600x400?text=Corporate+News"
      },
      {
        title: "Startups: Funding Round Completed",
        summary: "Innovative startup completes significant funding round from top investors.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Startup Times",
        image_url: "https://placehold.co/600x400?text=Startup+News"
      },
      {
        title: "Trade: International Agreement Signed",
        summary: "Countries sign landmark trade agreement to enhance economic cooperation.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Trade Journal",
        image_url: "https://placehold.co/600x400?text=Trade+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}

export default async function handler(req, res) {
  try {
    await loadCategory(res, "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms", 20); // Business Times of India feed
  } catch (err) {
    console.log("Business API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Business: Market Trends Show Positive Growth",
        summary: "Financial analysts report positive growth trends across multiple sectors this quarter.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Business Times",
        image_url: "https://placehold.co/600x400?text=Business+News"
      },
      {
        title: "Stock Market: Index Reaches New Highs",
        summary: "Major stock indices reach record highs amid positive economic indicators.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Market Watch",
        image_url: "https://placehold.co/600x400?text=Stock+News"
      },
      {
        title: "Corporate: Major Merger Announced",
        summary: "Two industry leaders announce merger deal to strengthen market position.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Corporate Report",
        image_url: "https://placehold.co/600x400?text=Corporate+News"
      },
      {
        title: "Startups: Funding Round Completed",
        summary: "Innovative startup completes significant funding round from top investors.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Startup Times",
        image_url: "https://placehold.co/600x400?text=Startup+News"
      },
      {
        title: "Trade: International Agreement Signed",
        summary: "Countries sign landmark trade agreement to enhance economic cooperation.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Trade Journal",
        image_url: "https://placehold.co/600x400?text=Trade+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}