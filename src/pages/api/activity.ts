import type { APIRoute } from "astro";
import { getCachedValue } from "@/lib/netlify-blob-cache";
import type {
  ActivityItem,
  ActivityResponse,
  GithubPullRequest,
  GithubPullRequestSearchResponse,
  LastFmResponse,
  Track,
} from "@/lib/types";

export const prerender = false;

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";
const GITHUB_API_URL = "https://api.github.com";
const DEFAULT_GITHUB_USERNAME = "heymynameisrob";
const TRACK_CACHE_TIMEOUT_MS = 5 * 60 * 1000;
const PULL_REQUEST_CACHE_TIMEOUT_MS = 60 * 60 * 1000;
const ACTIVITY_CACHE_STORE = "activity";

export const GET: APIRoute = async function GET() {
  const [latestTrack, latestPullRequest] = await Promise.all([
    getCachedValue({
      key: "latest-track",
      load: getLatestTrack,
      storeName: ACTIVITY_CACHE_STORE,
      timeout: TRACK_CACHE_TIMEOUT_MS,
    }),
    getCachedValue({
      key: "latest-pull-request",
      load: getLatestPullRequest,
      storeName: ACTIVITY_CACHE_STORE,
      timeout: PULL_REQUEST_CACHE_TIMEOUT_MS,
    }),
  ]);
  const items = [latestTrack, latestPullRequest]
    .filter((item): item is ActivityItem => item !== null)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const response: ActivityResponse = {
    latest: items[0] ?? null,
    latestTrack,
    latestPullRequest,
    items,
  };

  return Response.json(response, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, durable, max-age=60, stale-while-revalidate=300",
    },
  });
};

async function getLatestTrack(): Promise<Extract<ActivityItem, { type: "track" }> | null> {
  const apiKey = import.meta.env.LASTFM_API_KEY;
  const username = import.meta.env.LASTFM_USERNAME;

  if (!apiKey || !username) return null;

  const url = new URL(LASTFM_API_URL);
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", username);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = (await response.json()) as LastFmResponse;
  const latestTrack = data.recenttracks.track[0];
  if (!latestTrack) return null;

  const track = normalizeTrack(latestTrack);

  return {
    type: "track",
    occurredAt: track.playedAt,
    track,
  };
}

async function getLatestPullRequest(): Promise<Extract<
  ActivityItem,
  { type: "pullRequest" }
> | null> {
  const username = import.meta.env.GITHUB_USERNAME ?? DEFAULT_GITHUB_USERNAME;
  const url = new URL(`${GITHUB_API_URL}/search/issues`);
  url.searchParams.set("q", `type:pr author:${username}`);
  url.searchParams.set("sort", "created");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "1");

  const response = await fetch(url, {
    headers: githubHeaders(),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as GithubPullRequestSearchResponse;
  const latestPullRequest = data.items[0];
  if (!latestPullRequest) return null;

  const pullRequestDetails = await getPullRequestDetails(latestPullRequest.pull_request?.url);
  const pullRequest = pullRequestDetails ?? latestPullRequest;

  return {
    type: "pullRequest",
    occurredAt: latestPullRequest.created_at,
    pullRequest: {
      number: latestPullRequest.number,
      title: latestPullRequest.title,
      description: latestPullRequest.body,
      url: latestPullRequest.html_url,
      author: latestPullRequest.user?.login ?? null,
      repo: repoNameFromApiUrl(latestPullRequest.repository_url),
      state: latestPullRequest.state,
      status: getPullRequestStatus(pullRequest),
      additions: pullRequest.additions ?? null,
      deletions: pullRequest.deletions ?? null,
    },
  };
}

function normalizeTrack(track: LastFmResponse["recenttracks"]["track"][number]): Track {
  const nowPlaying = track["@attr"]?.nowplaying === "true";

  return {
    name: track.name,
    artist: track.artist["#text"],
    album: track.album["#text"],
    url: track.url,
    image: track.image.map(image => ({
      url: image["#text"],
      size: image.size,
    })),
    playedAt: nowPlaying ? new Date().toISOString() : toIsoDate(track.date?.uts),
    nowPlaying,
  };
}

async function getPullRequestDetails(url: string | undefined): Promise<GithubPullRequest | null> {
  if (!url) return null;

  const response = await fetch(url, {
    headers: githubHeaders(),
  });

  if (!response.ok) return null;

  return (await response.json()) as GithubPullRequest;
}

function githubHeaders(): HeadersInit {
  const token = import.meta.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function getPullRequestStatus(
  pullRequest: GithubPullRequest
): "open" | "closed" | "merged" | "draft" {
  if (pullRequest.draft) return "draft";
  if (pullRequest.merged) return "merged";
  return pullRequest.state;
}

function repoNameFromApiUrl(repositoryUrl: string): string {
  return repositoryUrl.replace(`${GITHUB_API_URL}/repos/`, "");
}

function toIsoDate(uts: string | undefined): string {
  if (!uts) return new Date(0).toISOString();
  return new Date(Number(uts) * 1000).toISOString();
}
