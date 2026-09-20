/**
 * Pings /api/activity on a schedule so the durable CDN cache never goes
 * cold. Visitors always get an instant edge-cached response instead of
 * waiting on the upstream Last.fm and GitHub calls.
 */
export default async () => {
  const baseUrl = process.env.DEPLOY_PRIME_URL || process.env.URL;
  if (!baseUrl) return;

  await fetch(`${baseUrl}/api/activity`, { cache: "no-store" });
};

export const config = {
  schedule: "*/5 * * * *",
};
