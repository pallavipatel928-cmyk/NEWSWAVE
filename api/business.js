export default async function handler(req, res) {
  const businessNews = [
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
  
  res.status(200).json(businessNews);
}