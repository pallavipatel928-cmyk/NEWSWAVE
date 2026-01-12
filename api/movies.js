export default async function handler(req, res) {
  const moviesNews = [
    {
      title: "Entertainment: Blockbuster Movie Reaches Milestone",
      summary: "The latest release achieves record-breaking box office numbers in its opening week.",
      link: "#",
      pubDate: new Date().toISOString(),
      source: "Entertainment Today",
      image_url: "https://placehold.co/600x400?text=Movies+News"
    },
    {
      title: "Film Awards: Nominations Announced",
      summary: "Prestigious film awards announce nominees for this year's ceremony.",
      link: "#",
      pubDate: new Date(Date.now() - 86400000).toISOString(),
      source: "Awards Watch",
      image_url: "https://placehold.co/600x400?text=Awards+News"
    },
    {
      title: "Hollywood: New Production Announced",
      summary: "Major studio announces production of highly anticipated sequel series.",
      link: "#",
      pubDate: new Date(Date.now() - 172800000).toISOString(),
      source: "Production Report",
      image_url: "https://placehold.co/600x400?text=Production+News"
    },
    {
      title: "Actors: Award Winner Joins New Project",
      summary: "Acclaimed actor signs on for upcoming director's ambitious project.",
      link: "#",
      pubDate: new Date(Date.now() - 259200000).toISOString(),
      source: "Actor Watch",
      image_url: "https://placehold.co/600x400?text=Actor+News"
    },
    {
      title: "Streaming: Platform Adds New Content",
      summary: "Popular streaming service announces addition of exclusive content library.",
      link: "#",
      pubDate: new Date(Date.now() - 345600000).toISOString(),
      source: "Streaming Times",
      image_url: "https://placehold.co/600x400?text=Streaming+News"
    }
  ];
  
  res.status(200).json(moviesNews);
}