export default async function handler(req, res) {
  const sportsNews = [
    {
      title: "Sports: Championship Finals Break Viewership Records",
      summary: "The championship finals break viewership records as teams compete in an exciting match.",
      link: "#",
      pubDate: new Date().toISOString(),
      source: "Sports Network",
      image_url: "https://placehold.co/600x400?text=Sports+News"
    },
    {
      title: "Football: Transfer Window Updates",
      summary: "Major football transfers announced as clubs prepare for the new season.",
      link: "#",
      pubDate: new Date(Date.now() - 86400000).toISOString(),
      source: "Football Weekly",
      image_url: "https://placehold.co/600x400?text=Football+News"
    },
    {
      title: "Cricket: International Series Begins",
      summary: "High-profile cricket series begins with world-class players competing.",
      link: "#",
      pubDate: new Date(Date.now() - 172800000).toISOString(),
      source: "Cricket Chronicle",
      image_url: "https://placehold.co/600x400?text=Cricket+News"
    },
    {
      title: "Tennis: Grand Slam Tournament Results",
      summary: "Grand slam tennis tournament concludes with surprising outcomes.",
      link: "#",
      pubDate: new Date(Date.now() - 259200000).toISOString(),
      source: "Tennis Today",
      image_url: "https://placehold.co/600x400?text=Tennis+News"
    },
    {
      title: "Olympics: Preparation Updates",
      summary: "Olympic committees share progress on preparations for upcoming games.",
      link: "#",
      pubDate: new Date(Date.now() - 345600000).toISOString(),
      source: "Olympic Report",
      image_url: "https://placehold.co/600x400?text=Olympics+News"
    }
  ];
  
  res.status(200).json(sportsNews);
}