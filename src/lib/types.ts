export type LastFmResponse = {
  recenttracks: {
    track: Array<{
      name: string;
      artist: { "#text": string };
      album: { "#text": string };
      url: string;
      image: Array<{
        "#text": string;
        size: string;
      }>;
      "@attr"?: { nowplaying: string };
    }>;
  };
};

export type Track = {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: Array<{
    url: string;
    size: string;
  }>;
  nowPlaying: boolean;
};

export const PostTypes = ["post", "work", "demo", "photos", "link"] as const;
