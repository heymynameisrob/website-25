import type { Post } from "@/content.config";

export function ScrollStripPost({
  post,
  onFocus,
  onKeyDown,
}: {
  post: Post & { optimizedImageSrc?: string; optimizedImageDarkSrc?: string };
  onKeyDown: React.KeyboardEventHandler<HTMLAnchorElement>;
  onFocus: (element: HTMLAnchorElement) => void;
}) {
  return (
    <a
      href={post.data.externalLink ?? `/posts/${post.id}`}
      target={post.data.externalLink ? "_blank" : undefined}
      key={post.id}
      className="group flex flex-col p-6 gap-6 bg-gray-2 aspect-square h-full shrink-0 rounded-sm border transition-all focus dark:bg-gray-3 hover:bg-gray-3 dark:hover:bg-gray-4 lg:p-8 lg:gap-8"
      onFocus={(e) => onFocus(e.currentTarget)}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-gray-10">{post.data.company ?? "Blog"}</h3>
        <p>{post.data.title}</p>
      </div>
      <div className="relative bg-gray-5 w-full h-full overflow-hidden">
        {post.data.imageDark ? (
          <>
            <img
              src={post.optimizedImageSrc ?? post.data.image_url}
              loading="lazy"
              className="absolute inset-0 object-cover object-left-top h-full w-full transition-all duration-400 ease-out dark:hidden"
            />
            <img
              src={post.optimizedImageDarkSrc ?? post.data.imageDark?.src}
              loading="lazy"
              className="absolute inset-0 object-cover object-left-top h-full w-full transition-all duration-400 ease-out hidden dark:block"
            />
          </>
        ) : (
          <img
            src={post.optimizedImageSrc ?? post.data.image_url}
            loading="lazy"
            className="absolute inset-0 object-cover object-left-top h-full w-full transition-all duration-400 ease-out"
          />
        )}
      </div>
    </a>
  );
}
