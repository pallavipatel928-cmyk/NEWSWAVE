export default async function handler(req, res) {
  // For Vercel deployment, using fallback data since RSS parsing needs to be server-side
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