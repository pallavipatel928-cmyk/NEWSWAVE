export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, summary, content, category, author, imageUrl } = req.body;
    
    // In a real implementation, you would store this in a database
    // For now, we'll just return success
    const newsItem = {
      title,
      summary,
      content,
      category,
      author,
      image_url: imageUrl || null,
      link: `#/article/${encodeURIComponent(title.substring(0, 50))}`,
      pubDate: new Date().toISOString(),
      source: author || "Submitted News"
    };

    // In a real implementation, save to your database here
    // For now, just return success
    res.status(200).json({ success: true, message: "News submitted successfully", newsItem });
  } catch (error) {
    console.error('Error submitting news:', error);
    res.status(500).json({ success: false, message: "Failed to submit news" });
  }
}