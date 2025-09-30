import type { Track } from "@/lib/types";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const dummyTrack: Track = {
    name: "Dummy Track Name",
    artist: "Dummy Artist",
    album: "Dummy Album",
    url: "https://example.com/track",
    image: [
      {
        url: "https://via.placeholder.com/34",
        size: "small",
      },
      {
        url: "https://via.placeholder.com/64",
        size: "medium",
      },
      {
        url: "https://via.placeholder.com/174",
        size: "large",
      },
      {
        url: "https://via.placeholder.com/300",
        size: "extralarge",
      },
    ],
    nowPlaying: true,
  };

  return new Response(JSON.stringify(dummyTrack), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
