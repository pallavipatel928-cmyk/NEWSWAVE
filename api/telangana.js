import { parser } from './news.js';

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

export default async function handler(req, res) {
  try {
    // Fetch the main news feed
    const response = await fetch(`${process.env.VERCEL_URL ? 'https://' : 'http://'}${process.env.VERCEL_URL || 'localhost:3000'}/api/news`);
    const allNews = await response.json();
    
    // Filter for Telangana news using our helper function
    const telanganaNews = filterByCategory(allNews, 'Telangana State');
    
    // Return filtered Telangana news or first 10 if no specific Telangana news found
    const result = telanganaNews.length > 0 ? telanganaNews.slice(0, 20) : allNews.slice(0, 10);
    res.status(200).json(result);
  } catch (err) {
    console.log("Telangana API error:", err);
    
    // Fallback to static data if RSS feed fails
    const fallbackNews = [
      {
        title: "Telangana: IT Hub Expansion Plans Unveiled",
        summary: "Government announces plans to expand the IT hub infrastructure in Hyderabad.",
        link: "#",
        pubDate: new Date().toISOString(),
        source: "Hyderabad Herald",
        image_url: "https://placehold.co/600x400?text=TS+News"
      },
      {
        title: "Hyderabad: Cultural Festival Attracts Visitors",
        summary: "Annual cultural festival in Hyderabad draws record number of visitors from across the country.",
        link: "#",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        source: "Cultural Times",
        image_url: "https://placehold.co/600x400?text=Hyderabad+News"
      },
      {
        title: "Secunderabad: Heritage Conservation Project",
        summary: "New project launched to preserve historical sites in Secunderabad area.",
        link: "#",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        source: "Heritage Watch",
        image_url: "https://placehold.co/600x400?text=Secunderabad+News"
      },
      {
        title: "Warangal: Educational Institution Rankings Improve",
        summary: "Local educational institutions show improvement in national rankings this year.",
        link: "#",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        source: "Education Report",
        image_url: "https://placehold.co/600x400?text=Warangal+News"
      },
      {
        title: "Tourism: Record Number of Visitors",
        summary: "Telangana tourism department reports record visitor numbers this quarter.",
        link: "#",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        source: "Tourism Today",
        image_url: "https://placehold.co/600x400?text=Tourism+News"
      }
    ];
    
    res.status(200).json(fallbackNews);
  }
}