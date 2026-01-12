export default async function handler(req, res) {
  const politicsNews = [
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
  
  res.status(200).json(politicsNews);
}