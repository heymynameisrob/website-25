import { z } from "zod";
import type { LastFmResponse, Track } from "@/lib/types";
import type { APIRoute } from "astro";

export const prerender = false;

// Input validation schema
const credentialsSchema = z.object({
  apiKey: z.string().min(1),
  username: z.string().min(1),
});

export const GET: APIRoute = async () => {
  try {
    // Get environment variables
    const apiKey = import.meta.env.LASTFM_API_KEY;
    const username = import.meta.env.LASTFM_USERNAME;

    const credentials = credentialsSchema.safeParse({ apiKey, username });

    if (!credentials) {
      return new Response(
        JSON.stringify({
          error: "Invalid credentials provided",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`,
    );

    if (!response.ok) {
      throw new Error(`LastFM API returned ${response.status}`);
    }

    const data = (await response.json()) as LastFmResponse;
    const track = data.recenttracks.track[0];

    const formattedTrack: Track = {
      name: track.name,
      artist: track.artist["#text"],
      album: track.album["#text"],
      url: track.url,
      image: track.image.map((img) => ({
        url: img["#text"],
        size: img.size,
      })),
      nowPlaying: track["@attr"]?.nowplaying === "true",
    };

    return new Response(JSON.stringify(formattedTrack), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("LastFM API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch track data",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
