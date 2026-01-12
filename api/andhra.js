export default async function handler(req, res) {
  const andhraNews = [
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
  
  res.status(200).json(andhraNews);
}