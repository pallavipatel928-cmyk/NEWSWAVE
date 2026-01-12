// ================================
// GLOBAL FIXES (MUST BE AT TOP)
// ================================

// Ignore expired SSL certificates (fixes CERT_HAS_EXPIRED)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Node.js 18+ already has global fetch, no need to import again

import express from "express";
import cors from "cors";
import Parser from "rss-parser";

const app = express();
app.use(cors());
app.use(express.json());

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "application/rss+xml,application/xml"
  }
});

// Root check
app.get("/", (req, res) => {
  res.send("✅ NewsWave Live Telugu News API — GreatAndhra-style feed expansion");
});

// =======================================
// 1️⃣ LATEST NEWS — 200+ articles
// =======================================
app.get("/api/news", async (req, res) => {
  try {
    const primaryFeeds = [
      "https://www.greatandhra.com/rss.xml",
      "https://www.sakshi.com/rss/latest.xml",
      "https://www.eenadu.net/rss/home",
      "https://www.thehindu.com/feeder/default.rss",
      "https://www.deccanchronicle.com/rss_feed"
    ];

    const fallbackFeeds = [
      "https://news.google.com/rss?hl=te-IN&gl=IN&ceid=IN:te",
      "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
      "https://feeds.bbci.co.uk/news/world/rss.xml"
    ];

    let articles = [];

    // Fetch primary feeds
    for (const url of primaryFeeds) {
      try {
        const feed = await parser.parseURL(url);
        const items = feed.items.slice(0, 80).map(i => ({
          title: i.title,
          summary: i.contentSnippet || "",
          link: i.link,
          pubDate: i.pubDate,
          source: feed.title,
          image_url: i.enclosure?.url || null
        }));
        articles = articles.concat(items);
      } catch (e) {
        console.warn("Primary feed failed:", url);
      }
    }

    // If too few articles → fallback feeds
    if (articles.length < 50) {
      for (const url of fallbackFeeds) {
        try {
          const feed = await parser.parseURL(url);
          const items = feed.items.slice(0, 50).map(i => ({
            title: i.title,
            summary: i.contentSnippet || "",
            link: i.link,
            pubDate: i.pubDate,
            source: feed.title,
            image_url: i.enclosure?.url || null
          }));
          articles = articles.concat(items);
        } catch (e) {
          console.warn("Fallback failed:", url);
        }
      }
    }

    // Remove duplicates
    const seen = new Set();
    const unique = articles.filter(a => !seen.has(a.title) && seen.add(a.title));

    // Sort newest first
    unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.json(unique.slice(0, 200));  // Return 200+ items

  } catch (err) {
    console.error("LATEST ERROR:", err);
    res.status(500).json({ error: "Failed to load news" });
  }
});

// =======================================
// 2️⃣ ANDHRA / TELANGANA — 50 each
// =======================================
app.get("/api/andhra", async (req, res) => {
  await loadCategory(res, "https://www.greatandhra.com/rss/andhra", 50);
});

app.get("/api/telangana", async (req, res) => {
  await loadCategory(res, "https://www.greatandhra.com/rss/telangana", 50);
});

// =======================================
// 3️⃣ Politics / Movies / Sports — 40 each
// =======================================
app.get("/api/politics", async (req, res) => {
  await loadCategory(res, "https://www.greatandhra.com/rss/politics", 40);
});

app.get("/api/movies", async (req, res) => {
  await loadCategory(res, "https://www.greatandhra.com/rss/movies", 40);
});

app.get("/api/sports", async (req, res) => {
  await loadCategory(res, "https://www.greatandhra.com/rss/sports", 40);
});

// Helper
async function loadCategory(res, feedUrl, limit) {
  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.slice(0, limit).map(i => ({
      title: i.title,
      summary: i.contentSnippet || "",
      link: i.link,
      pubDate: i.pubDate,
      source: feed.title,
      image_url: i.enclosure?.url || null
    }));
    res.json(items);
  } catch (err) {
    console.log("Category error:", err);
    res.status(500).json({ error: "Category fetch failed" });
  }
}

// =======================================
// 4️⃣ VIDEO SECTION — YouTube embeds
// =======================================
app.get("/api/videos", (req, res) => {
  res.json([
    { title: "TV9 Telugu", url: "https://www.youtube.com/embed/X9RANzv6VnE" },
    { title: "ABN Andhra Jyothi", url: "https://www.youtube.com/embed/4vG2C8YQyX8" },
    { title: "NTV Telugu", url: "https://www.youtube.com/embed/wxgfbo9CG2A" },
    { title: "Sakshi TV", url: "https://www.youtube.com/embed/oIxC4NokhT8" },
    { title: "T News", url: "https://www.youtube.com/embed/JU-0m8b9z3A" }
  ]);
});

// =======================================
// 5️⃣ HLS PROXY (fixes CORS + SSL)
// =======================================
app.get("/proxy/hls", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing URL");

  try {
    const upstream = await fetch(target);
    const data = await upstream.arrayBuffer();

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/vnd.apple.mpegurl");
    res.send(Buffer.from(data));
  } catch (err) {
    console.error("HLS Error:", err);
    res.status(502).send("Failed to load HLS stream");
  }
});

// ===============================
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 NewsWave backend running on http://localhost:${PORT}`));
