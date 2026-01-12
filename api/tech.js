export default async function handler(req, res) {
  try {
    // Fetch the main news feed
    const response = await fetch(`${process.env.VERCEL_URL ? 'https://' : 'http://'}${process.env.VERCEL_URL || 'localhost:3000'}/api/news`);
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
    res.status(200).json(result);
  } catch (err) {
    console.log("Tech API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Technology: AI Innovation Breakthrough",
        summary: "Major technology company announces breakthrough in artificial intelligence research.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Tech Review",
        image_url: "https://placehold.co/600x400?text=Tech+News"
      },
      {
        title: "Gadgets: New Smartphone Launch",
        summary: "Leading manufacturer unveils new smartphone with advanced features.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Gadget Watch",
        image_url: "https://placehold.co/600x400?text=Gadget+News"
      },
      {
        title: "Software: Major Update Released",
        summary: "Popular software platform releases major update with enhanced functionality.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Software Times",
        image_url: "https://placehold.co/600x400?text=Software+News"
      },
      {
        title: "Cybersecurity: Threat Analysis",
        summary: "Security experts analyze new cyber threats and protection measures.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Security Watch",
        image_url: "https://placehold.co/600x400?text=Security+News"
      },
      {
        title: "Startups: Tech Innovation Spotlight",
        summary: "Emerging tech startups showcase innovative solutions for modern challenges.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Innovation Report",
        image_url: "https://placehold.co/600x400?text=Innovation+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}