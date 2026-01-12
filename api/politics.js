export default async function handler(req, res) {
  try {
    // Fetch the main news feed
    const response = await fetch(`${process.env.VERCEL_URL ? 'https://' : 'http://'}${process.env.VERCEL_URL || 'localhost:3000'}/api/news`);
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
    
    // Enhance image URLs for filtered news
    const enhancedPoliticalNews = politicalNews.length > 0 ? politicalNews.slice(0, 20) : allNews.slice(0, 10);
    const result = enhancedPoliticalNews.map(item => ({
      ...item,
      image_url: item.image_url || 'https://placehold.co/400x250?text=Politics+News',
      // Ensure summary has content
      summary: item.summary || 'Latest political and government news'
    }));
    
    res.status(200).json(result);
  } catch (err) {
    console.log("Politics API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "National Politics: New Policy Framework Announced",
        summary: "Government officials announce a comprehensive policy framework addressing current national challenges.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Political Herald",
        image_url: "https://placehold.co/600x400?text=Politics+News"
      },
      {
        title: "Elections: Voter Registration Drive Begins",
        summary: "Election commission initiates voter registration drive ahead of upcoming elections.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Election Monitor",
        image_url: "https://placehold.co/600x400?text=Election+News"
      },
      {
        title: "Legislature: Important Bill Passed",
        summary: "Parliament passes significant legislation after extensive debate and discussion.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Legislative Report",
        image_url: "https://placehold.co/600x400?text=Legislature+News"
      },
      {
        title: "International Relations: Diplomatic Meeting Held",
        summary: "Foreign ministers meet to discuss bilateral relations and trade agreements.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Diplomatic Times",
        image_url: "https://placehold.co/600x400?text=Diplomacy+News"
      },
      {
        title: "Government: Cabinet Reshuffle Announced",
        summary: "Prime minister announces cabinet reshuffle to strengthen administrative effectiveness.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Government Watch",
        image_url: "https://placehold.co/600x400?text=Govt+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}