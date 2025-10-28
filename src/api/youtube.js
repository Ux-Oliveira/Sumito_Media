export default async function handler(req, res) {
  const channelId = 'UC2gv4MSAlvzjwZ8xXQYtfiQ'; // SumitoMedia's channel ID
  const apiKey = process.env.YOUTUBE_API_KEY; // Your API key from environment variables

  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      const channelData = {
        viewCount: channel.statistics.viewCount,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        channelAnniversary: new Date(channel.snippet.publishedAt).toLocaleDateString(),
      };
      return res.status(200).json(channelData);
    } else {
      return res.status(404).json({ error: 'Channel not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
  }
}
