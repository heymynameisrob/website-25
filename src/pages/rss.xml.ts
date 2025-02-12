import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { isBefore } from "date-fns";
import type { RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const posts = await getCollection("posts");
  const filteredPosts = posts
    .filter((post) => !post.data.isExternal)
    .filter((post) => isBefore(post.data.date, new Date()));

  const rssItems: RSSFeedItem[] = filteredPosts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.description,
    link: `/post/${post.id}/`,
  }));

  return rss({
    title: "heymynameisrob",
    description: "My insane ramblings",
    site: context.site!,
    items: rssItems,
  });
}
