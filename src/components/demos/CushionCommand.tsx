import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { HomeIcon, PlugZap2Icon } from "lucide-react";
import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  BellSlashIcon,
  ChatBubbleOvalLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
  HashtagIcon,
  SparklesIcon,
  InboxIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  BoltIcon,
} from "@heroicons/react/16/solid";

import { Badge } from "@/components/primitives/Badge";
import { Key } from "@/components/primitives/Key";
import { cn } from "@/lib/utils";

type Page = "home" | "posts" | "channels" | "chat";

type PageMetadata = {
  title: string;
  icon?: React.ReactNode;
  showAsBreadcrumb: boolean;
};

const PAGE_META: Record<Page, PageMetadata> = {
  home: {
    title: "Home",
    icon: <HomeIcon className="size-3 opacity-70" />,
    showAsBreadcrumb: false,
  },
  posts: {
    title: "Posts",
    icon: <DocumentTextIcon className="size-3 opacity-70" />,
    showAsBreadcrumb: true,
  },
  chat: {
    title: "Chat",
    icon: <ChatBubbleOvalLeftIcon className="size-3 opacity-70" />,
    showAsBreadcrumb: true,
  },
  channels: {
    title: "Channels",
    icon: <HashtagIcon className="size-3 opacity-70" />,
    showAsBreadcrumb: true,
  },
};

export function CushionCommand() {
  const [query, setQuery] = React.useState<string>("");
  const [pages, setPages] = React.useState<string[]>(["home"]);

  const currentPage = pages[pages.length - 1] as Page;

  const navigateTo = React.useCallback((page: Page) => {
    setPages((prev) => [...prev, page]);
    setQuery("");
  }, []);

  const navigateBack = () => {
    setPages((prev) => {
      return prev.slice(0, -1);
    });
    setQuery("");
  };

  const view = React.useMemo(() => {
    switch (currentPage) {
      case "posts":
        return <PostsView />;
      case "chat":
        return <ChatView />;
      case "channels":
        return <ChannelsView />;
      default:
        return <HomeView navigateTo={navigateTo} />;
    }
  }, [currentPage, navigateTo]);

  const popPage = React.useCallback(() => {
    if (pages.length > 1) {
      setPages(pages.slice(0, -1));
      setQuery("");
    }
  }, [pages, setPages, setQuery]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !query && pages.length > 0) {
        e.preventDefault();
        popPage();
      }

      if (e.key === "Escape") {
        if (pages.length > 1) {
          e.preventDefault();
          popPage();
        }
      }
    },
    [query, pages.length, popPage],
  );

  const checkForShortcuts = React.useCallback((value: string): Page | null => {
    if (value === "#") return "channels";
    if (value === "+") return "posts";
    if (value === "@") return "chat";

    return null;
  }, []);

  const handleInputChange = React.useCallback(
    (value: string) => {
      const shortcutPage = checkForShortcuts(value);

      if (shortcutPage) {
        setPages(["home", shortcutPage]);
        setQuery("");
        return;
      }

      setQuery(value);
    },
    [checkForShortcuts],
  );

  return (
    <CommandPrimitive
      value=""
      loop
      className={cn(
        "bg-background text-primary flex w-[480px] flex-col overflow-hidden rounded-lg shadow-container dark:bg-gray-2",
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-11 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2",
      )}
    >
      <div className="flex h-11 items-center gap-2 border-b px-3 bg-gray-2 dark:bg-gray-3">
        <CommandBreadcrumb currentPage={currentPage} />
        <CommandPrimitive.Input
          placeholder="Search... (# for channels, + for posts, @ for chat)"
          value={query}
          onKeyDown={handleKeyDown}
          onValueChange={handleInputChange}
          autoFocus={false}
          className="placeholder:text-gray-9 flex items-center gap-3 h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 focus-visible:caret-accent"
        />
      </div>
      <CommandPrimitive.List className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto">
        {query.length > 0 && (
          <CommandPrimitive.Empty className="py-6 text-center text-sm">
            <p className="text-sm text-gray-10">No results found</p>
          </CommandPrimitive.Empty>
        )}
        {view}
      </CommandPrimitive.List>
    </CommandPrimitive>
  );
}

/** VIEWS */

function HomeView({ navigateTo }: { navigateTo: (page: Page) => void }) {
  return (
    <>
      <CommandGroup heading="Suggestions">
        <CommandItem
          value="Posts"
          keywords={["posts", "articles", "content"]}
          onSelect={() => navigateTo("posts")}
          shortcut="+"
        >
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4 opacity-70" />
            <span>Posts</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Channels"
          keywords={["channels", "topics"]}
          onSelect={() => navigateTo("channels")}
          shortcut="#"
        >
          <div className="flex items-center gap-2">
            <HashtagIcon className="h-4 w-4 opacity-70" />
            <span>Channels</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Chat"
          keywords={["chat", "messages", "dm"]}
          onSelect={() => navigateTo("chat")}
          shortcut="@"
        >
          <div className="flex items-center gap-2">
            <ChatBubbleOvalLeftIcon className="h-4 w-4 opacity-70" />
            <span>Chat</span>
          </div>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Goto...">
        <CommandItem
          value="Inbox"
          keywords={["inbox", "notifications", "updates"]}
        >
          <div className="flex items-center gap-2">
            <InboxIcon className="h-4 w-4 opacity-70" />
            <span>Inbox</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Drafts"
          keywords={["drafts", "unpublished", "draft"]}
        >
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4 opacity-70" />
            <span>Drafts</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Workspace Settings"
          keywords={["workspace", "team", "settings", "preferences", "config"]}
        >
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-4 w-4 opacity-70" />
            <span>Workspace settings</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Integrations"
          keywords={["integrations", "agents", "plugins", "settings"]}
        >
          <div className="flex items-center gap-2">
            <BoltIcon className="h-4 w-4 opacity-70" />
            <span>Integrations</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Account settings"
          keywords={["account", "settings", "preferences", "profile", "config"]}
        >
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4 opacity-70" />
            <span>Account settings</span>
          </div>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Do Not Disturb">
        <CommandItem
          value="DND Never"
          keywords={[
            "snooze",
            "notifications",
            "dnd",
            "disturb",
            "notifications",
            "on",
            "enable",
            "never",
          ]}
        >
          <div className="flex items-center gap-2">
            <BellIcon className="h-4 w-4 opacity-70" />
            <span>Never (notifications on)</span>
          </div>
        </CommandItem>
        <CommandItem
          value="DND 30 minutes"
          keywords={[
            "snooze",
            "notifications",
            "dnd",
            "disturb",
            "30",
            "minutes",
            "half",
            "hour",
          ]}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 opacity-70" />
            <span>For 30 minutes</span>
          </div>
        </CommandItem>
        <CommandItem
          value="DND 1 hour"
          keywords={[
            "snooze",
            "notifications",
            "dnd",
            "disturb",
            "1",
            "one",
            "hour",
          ]}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 opacity-70" />
            <span>For 1 hour</span>
          </div>
        </CommandItem>
        <CommandItem
          value="DND until tomorrow"
          keywords={[
            "snooze",
            "notifications",
            "dnd",
            "disturb",
            "tomorrow",
            "until",
            "morning",
          ]}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 opacity-70" />
            <span>Until tomorrow</span>
          </div>
        </CommandItem>
        <CommandItem
          value="DND Always"
          keywords={[
            "snooze",
            "dnd",
            "disturb",
            "always",
            "off",
            "disable",
            "notifications",
          ]}
        >
          <div className="flex items-center gap-2">
            <BellSlashIcon className="h-4 w-4 opacity-70" />
            <span>Always (notifications off)</span>
          </div>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Utilities">
        <CommandItem
          value="Send Feedback"
          keywords={[
            "feedback",
            "support",
            "help",
            "bug",
            "report",
            "issue",
            "suggest",
          ]}
        >
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-4 w-4 opacity-70" />
            <span>Send feedback</span>
          </div>
        </CommandItem>
        <CommandItem value="Logout" keywords={["logout", "signout", "exit"]}>
          <div className="flex items-center gap-2 text-red-500">
            <ArrowRightStartOnRectangleIcon className="h-4 w-4 opacity-70" />
            <span>Logout</span>
          </div>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

function PostsView() {
  return (
    <>
      <CommandGroup heading="Actions">
        <CommandItem
          value="Create new post"
          keywords={["create", "new", "post", "write", "draft"]}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 opacity-70" />
            <span>Create new post</span>
          </div>
        </CommandItem>
        <CommandItem
          value="View drafts"
          keywords={["drafts", "unpublished", "view"]}
        >
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4 opacity-70" />
            <span>View drafts</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Schedule post"
          keywords={["schedule", "publish", "later"]}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 opacity-70" />
            <span>Schedule post</span>
          </div>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Recent">
        <CommandItemSkeleton />
        <CommandItemSkeleton />
        <CommandItemSkeleton />
        <CommandItemSkeleton />
      </CommandGroup>
    </>
  );
}

function ChatView() {
  return (
    <>
      <CommandGroup heading="Actions">
        <CommandItem
          value="New conversation"
          keywords={["new", "chat", "conversation", "message"]}
        >
          <div className="flex items-center gap-2">
            <ChatBubbleOvalLeftIcon className="h-4 w-4 opacity-70" />
            <span>New conversation</span>
          </div>
        </CommandItem>
        <CommandItem
          value="View unread"
          keywords={["unread", "messages", "notifications"]}
        >
          <div className="flex items-center gap-2">
            <BellIcon className="h-4 w-4 opacity-70" />
            <span>View unread</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Search messages"
          keywords={["search", "find", "messages"]}
        >
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4 opacity-70" />
            <span>Search messages</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Archived chats"
          keywords={["archive", "archived", "old"]}
        >
          <div className="flex items-center gap-2">
            <InboxIcon className="h-4 w-4 opacity-70" />
            <span>Archived chats</span>
          </div>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Recent">
        <CommandItemSkeleton />
        <CommandItemSkeleton />
        <CommandItemSkeleton />
        <CommandItemSkeleton />
      </CommandGroup>
    </>
  );
}

function ChannelsView() {
  return (
    <>
      <CommandGroup heading="Actions">
        <CommandItem
          value="Create channel"
          keywords={["create", "new", "channel"]}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 opacity-70" />
            <span>Create channel</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Browse channels"
          keywords={["browse", "all", "channels", "discover"]}
        >
          <div className="flex items-center gap-2">
            <HashtagIcon className="h-4 w-4 opacity-70" />
            <span>Browse channels</span>
          </div>
        </CommandItem>
        <CommandItem
          value="Manage subscriptions"
          keywords={["manage", "subscriptions", "following"]}
        >
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-4 w-4 opacity-70" />
            <span>Manage subscriptions</span>
          </div>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Recent">
        <CommandItemSkeleton />
        <CommandItemSkeleton />
        <CommandItemSkeleton />
        <CommandItemSkeleton />
      </CommandGroup>
    </>
  );
}

/** PARTS */
function CommandBreadcrumb({ currentPage }: { currentPage: Page }) {
  const metadata = PAGE_META[currentPage];

  if (!metadata.showAsBreadcrumb) return null;

  return (
    <Badge
      variant="secondary"
      className="shrink-0 gap-1 bg-black/10 dark:bg-white/10 px-1"
    >
      {metadata.icon}
      {metadata.title}
    </Badge>
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "text-secondary [&_[cmdk-group-heading]]:text-gray-10 overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}
function CommandItem({
  className,
  shortcut,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> & { shortcut?: string }) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative group flex cursor-default select-none items-center rounded-lg px-3 py-1.5 h-10 text-sm text-primary font-medium outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-gray-2 data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        "data-[selected='true']:bg-gray-3",
        className,
      )}
      {...props}
    >
      {props.children}
      {shortcut && (
        <Key className="shrink-0 ml-auto text-gray-10">{shortcut}</Key>
      )}
    </CommandPrimitive.Item>
  );
}

function CommandItemSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 h-10">
      <div className="h-4 w-4 rounded bg-gray-4 animate-pulse" />
      <div className="h-3 w-32 rounded bg-gray-4 animate-pulse" />
    </div>
  );
}
