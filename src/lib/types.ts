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
      date?: {
        uts: string;
        "#text": string;
      };
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
  playedAt: string;
  nowPlaying: boolean;
};

export type GithubPullRequest = {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  repository_url: string;
  created_at: string;
  state: "open" | "closed";
  draft?: boolean;
  merged?: boolean;
  additions?: number;
  deletions?: number;
  pull_request?: {
    url: string;
  };
  user: {
    login: string;
  } | null;
};

export type GithubPullRequestSearchResponse = {
  items: GithubPullRequest[];
};

export type ActivityItem =
  | {
      type: "track";
      occurredAt: string;
      track: Track;
    }
  | {
      type: "pullRequest";
      occurredAt: string;
      pullRequest: {
        number: number;
        title: string;
        description: string | null;
        url: string;
        author: string | null;
        repo: string;
        state: "open" | "closed";
        status: "open" | "closed" | "merged" | "draft";
        additions: number;
        deletions: number;
      };
    };

export type ActivityResponse = {
  latest: ActivityItem | null;
  latestTrack: Extract<ActivityItem, { type: "track" }> | null;
  latestPullRequest: Extract<ActivityItem, { type: "pullRequest" }> | null;
  items: ActivityItem[];
};

export const PostTypes = ["post", "case-study", "demo", "photos", "project"] as const;
export const PostLayouts = ["agent", "command-k", "comments", "markdown"] as const;
