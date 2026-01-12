export default async function handler(req, res) {
  const techNews = [
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
  
  res.status(200).json(techNews);
}