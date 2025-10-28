import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CountUp from "react-countup";

export default function Countdown() {
  const [channelData, setChannelData] = useState(null);
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const channelId = "UC2gv4MSAlvzjwZ8xXQYtfiQ";

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const channel = data.items[0];
          setChannelData({
            viewCount: channel.statistics.viewCount,
            subscriberCount: channel.statistics.subscriberCount,
            videoCount: channel.statistics.videoCount,
            channelAnniversary: new Date(channel.snippet.publishedAt).toLocaleDateString(),
          });
        } else {
          console.error("Channel not found", data);
        }
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
      }
    };
    fetchChannelData();
  }, [apiKey]);

  if (!channelData)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: "url('/social_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      {/*Dark overlay*/}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl text-center shadow-lg border border-white/20">
          <a href="https://www.youtube.com/@SumitoMedia" target="_blank" ><img
            src="/Sumito_icon.jpg"
            alt="SumitoMedia"
            className="w-32 h-32 mx-auto rounded-full border-4 border-white mb-6 shadow-md"
          /></a>
          <h1 id="count" className="text-3xl font-bold mb-6">
            SumitoMedia Channel Stats
          </h1>

          <div className="space-y-6">
            {/*Views*/}
            <div className="flex justify-center items-center space-x-3 animate-pulse">
              <a href="https://www.youtube.com/watch?v=OcgB807NYe8&list=PLjTTMZhfLmtJ5hvLvjr0257Lyjg_uvxeb&index=1" target="_blank" ><i className="fas fa-eye text-2xl text-blue-400"></i></a>
              <span id="count" className="text-4xl font-bold text-white">
                <CountUp end={Number(channelData.viewCount)} separator="," duration={2} />
              </span>
            </div>

            {/*Subscribers*/}
            <div className="flex justify-center items-center space-x-3 animate-pulse">
              <a href="https://www.youtube.com/watch?v=j6N6x8QmQsg&list=PLjTTMZhfLmtI_m6a_xM6I_qMDwGUk8Bzm&index=3" target="_blank" ><i className="fas fa-users text-2xl text-green-400"></i></a>
              <span id="count" className="text-4xl font-bold text-white">
                <CountUp end={Number(channelData.subscriberCount)} separator="," duration={2} />
              </span>
            </div>

            {/* Videos */}
            <div className="flex justify-center items-center space-x-3 animate-pulse">
               <a href="https://www.youtube.com/watch?v=OItZv30E5DA&list=PLjTTMZhfLmtKIV1Q2hoGM9aBOkVvGTYez" target="_blank" ><i className="fas fa-video text-2xl text-red-400"></i></a>
              <span id="count" className="text-4xl font-bold text-white">
                <CountUp end={Number(channelData.videoCount)} separator="," duration={2} />
              </span>
            </div>
            <h1 id="count" className="text-3xl font-bold mb-6">
              Countdown to 12 billion views & 35 milion dollars!
            </h1>
          </div>

          <div className="mt-8 opacity-80">
            <p id="count" className="text-sm">Channel Anniversary: {channelData.channelAnniversary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
