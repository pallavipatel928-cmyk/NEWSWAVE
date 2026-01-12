import { parser } from './news.js';

// Helper function to filter news by category (same as in telangana.js)
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

export default async function handler(req, res) {
  try {
    // Fetch the main news feed
    const response = await fetch(`${process.env.VERCEL_URL ? 'https://' : 'http://'}${process.env.VERCEL_URL || 'localhost:3000'}/api/news`);
    const allNews = await response.json();
    
    // Filter for Andhra Pradesh news using our helper function
    const andhraNews = filterByCategory(allNews, 'Andhra Pradesh');
    
    // Return filtered Andhra news or first 10 if no specific Andhra news found
    const result = andhraNews.length > 0 ? andhraNews.slice(0, 20) : allNews.slice(0, 10);
    res.status(200).json(result);
  } catch (err) {
    console.log("Andhra API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Andhra Pradesh: New Infrastructure Project Approved",
        summary: "The state government has approved a major infrastructure development project that will boost the local economy.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Andhra Times",
        image_url: "https://placehold.co/600x400?text=AP+News"
      },
      {
        title: "Amaravati: Capital Development Progress Update",
        summary: "Progress reports indicate significant advancement in the development of the new capital city.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Capital Chronicle",
        image_url: "https://placehold.co/600x400?text=Amaravati+News"
      },
      {
        title: "Vijayawada: Festival Celebrations Begin",
        summary: "Annual cultural festival begins in Vijayawada with thousands of participants.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Cultural News",
        image_url: "https://placehold.co/600x400?text=Vijayawada+News"
      },
      {
        title: "Visakhapatnam: Industrial Growth Continues",
        summary: "Industrial sector in Visakhapatnam shows continued growth with new investment commitments.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Industrial Monitor",
        image_url: "https://placehold.co/600x400?text=Vizag+News"
      },
      {
        title: "Agriculture: Crop Production Up This Season",
        summary: "Farmers in Andhra Pradesh report increased crop yields for the current season.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Agricultural News",
        image_url: "https://placehold.co/600x400?text=Agriculture+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}