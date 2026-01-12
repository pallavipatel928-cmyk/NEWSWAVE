import Parser from 'rss-parser';

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  }
});

// Storage for submitted news
let submittedNews = [];

export default async function handler(req, res) {
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
          summary: i.contentSnippet || i.content || i.description || "", 
          link: i.link,
          pubDate: i.pubDate,
          source: feed.title,
          image_url: i.enclosure?.url || extractImageUrl(i.contentSnippet || i.content || i.description || "")
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
            summary: i.contentSnippet || i.content || i.description || "",
            link: i.link,
            pubDate: i.pubDate,
            source: feed.title,
            image_url: i.enclosure?.url || extractImageUrl(i.contentSnippet || i.content || i.description || "")
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
  
    res.status(200).json(unique.slice(0, 200));
  
  } catch (err) {
    console.error("LATEST ERROR:", err);
    
    // Fallback to static data if RSS feeds fail
    const fallbackNews = [
      {
        title: "Breaking: Major Development in Technology Sector",
        summary: "A significant breakthrough has been announced in the technology sector today, with implications for the global market.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Tech Journal",
        image_url: "https://placehold.co/600x400?text=Tech+News"
      },
      {
        title: "Sports Update: Championship Finals Approaching",
        summary: "The championship finals are drawing near with teams preparing for the ultimate showdown.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        source: "Sports Daily",
        image_url: "https://placehold.co/600x400?text=Sports+News"
      },
      {
        title: "Entertainment: New Movie Release Shatters Records",
        summary: "The latest blockbuster movie has broken all previous box office records in its opening weekend.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        source: "Entertainment Weekly",
        image_url: "https://placehold.co/600x400?text=Movie+News"
      },
      {
        title: "Business: Market Trends Show Positive Growth",
        summary: "Financial analysts report positive growth trends across multiple sectors this quarter.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        source: "Business Times",
        image_url: "https://placehold.co/600x400?text=Business+News"
      },
      {
        title: "Politics: New Policy Announced for Development",
        summary: "Government officials announce a new policy framework aimed at accelerating development projects.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        source: "Political Herald",
        image_url: "https://placehold.co/600x400?text=Politics+News"
      },
      {
        title: "Health: Medical Research Breakthrough Reported",
        summary: "Scientists report a significant breakthrough in medical research that could impact treatment options.",
        link: "#",
        pubDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        source: "Health Monitor",
        image_url: "https://placehold.co/600x400?text=Health+News"
      },
      {
        title: "Education: New Initiative Launched for Students",
        summary: "Educational institutions announce a new initiative to support student learning and development.",
        link: "#",
        pubDate: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        source: "Education Today",
        image_url: "https://placehold.co/600x400?text=Education+News"
      },
      {
        title: "Environment: Conservation Efforts Show Progress",
        summary: "Environmental conservation efforts are showing promising results in several regions.",
        link: "#",
        pubDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        source: "Environment Watch",
        image_url: "https://placehold.co/600x400?text=Environment+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}

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
  
  const extractedUrl = urlMatch ? urlMatch[1] : "https://placehold.co/600x400?text=News+Image";
  // Ensure HTTPS for secure content
  return extractedUrl.startsWith('http://') ? extractedUrl.replace(/^http:\/\//, 'https://') : extractedUrl;
}

// Export the parser for other API routes to use
export { parser, submittedNews };