import type { APIRoute } from "astro";
import { getActivity } from "@/lib/activity";

export const prerender = false;

export const GET: APIRoute = async () => {
  const response = await getActivity();

  return Response.json(response, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, durable, max-age=60, stale-while-revalidate=300",
    },
  });
};
