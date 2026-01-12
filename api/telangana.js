export default async function handler(req, res) {
  const telanganaNews = [
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
  
  res.status(200).json(telanganaNews);
}